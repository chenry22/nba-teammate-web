from pyvis.network import Network
import numpy as np
import sys
import json

# This file handles the data visualization through PyVis
#   of a specific player -> maps all former teams and teammates

# Basically parses through the .json file we generated to create a network display
if len(sys.argv) != 2:
    print("   Usage: python player_web_vis.py [player_reference]")
    print("   Players are identified by their Basketball Reference URL.")
    print("     E.g. Dario Saric would be identifiable by '/players/s/saricda01.html'")
    exit()
player = sys.argv[1]

team_to_color = {
    "MIA" : "#98002e", "LAL" : "#f9a01b", "BOS" : "#007a33", "LAC" : "#c8102e", "BRK" : "#000000",
    "CHO" : "#00788c", "CHI" : "#ce1141", "ATL" : "#e03a3e", "PHO" : "#e56020", "DAL" : "#00538c", 
    "DEN" : "#fec524", "DET" : "#c8102e", "GSW" : "#ffc72c", "HOU" : "#ce1141", "IND" : "#fdbb30", 
    "MEM" : "#5d76a9", "MIL" : "#00471b", "MIN" : "#0c2340", "NOP" : "#0c2340", "NYK" : "#f58426",
    "OKC" : "#007ac1", "ORL" : "#0077c0", "PHI" : "#006bb6", "POR" : "#e03a3e", "SAC" : "#5a2d81", 
    "SAS" : "#c4ced4", "TOR" : "#ce1141", "UTA" : "#002b5c", "CLE" : "#860038", "WAS" : "#002b5c",
    "SEA" : "#00653A"
}
names = {}
player_teams = {}
pairs = []
teammates = {}

web = Network(filter_menu=True, height='650px')
team_node_size = 48.0
team_node_mass = 3.0

player_node_size = 70.0

teammate_node_size = 1.0
teammate_node_max_size = 26.0

def add_or_update_node(net, node_id, **attrs):
    for node in net.nodes:
        if node["id"] == node_id:
            if node_id == player:
                # don't mess w existing player, only add once basically
                return
            node.update(attrs)
            return
    net.add_node(node_id, **attrs)
def add_or_update_edge(net, from_id, to_id, **attrs):
    for e in net.edges:
        if e["from"] == from_id and e["to"] == to_id:
            e.update(attrs)
            return
    net.add_edge(from_id, to_id, **attrs)


with open('../teammate_web_data.json', 'r') as file:
    data = json.load(file)
    file.close()
    for p in data:
        if not "player1" in p:
            names[p["href"]] = p["player"]
    if not player in names:
        print("Error: Player does not exist in database.")
        exit()

    # add player
    web.add_node(player, label=names[player], 
        title=names[player], color="#b4f9fc", 
        borderWidth=3, borderWidthSelected=True,
        size=player_node_size, shape="ellipse",
    )

    for p in data:
        if not "player1" in p:
            # player node
            # player, href, year, team, games_played, games_started, minutes_played, win_shares, win_shares_per_48, box_plus_minus
            if p['href'] != player:
                continue

            # add team if doesn't exist
            add_or_update_node(web, p["team"], 
                color=team_to_color[p["team"]],
                size=team_node_size,
                label=p["team"], title=p["team"], 
                shape="box", mass=team_node_mass
            )
            
            # show link to team
            weight = float((int(p["games_played"]) / 2.0) + int(p["games_started"])) / 82.0 + float(p['win_shares'])
            if p["team"] in player_teams:
                player_teams[p["team"]]["team_val"] += weight
                player_teams[p["team"]]["years"].append(p["year"])
                player_teams[p["team"]]["gp"] += int(p["games_played"])
                player_teams[p["team"]]["gs"] += int(p["games_started"])
                player_teams[p["team"]]["ws"] += float(p["win_shares"])
                player_teams[p["team"]]["bpm"].append(p["box_plus_minus"])
            else: 
                player_teams[p["team"]] = {
                    "team_val" : weight, "years" : [p["year"]],
                    "gp" : int(p["games_played"]), "gs" : int(p["games_started"]),
                    "ws" : float(p["win_shares"]), "bpm" : [p["box_plus_minus"]]
                }
            
            t = player_teams[p["team"]]
            add_or_update_edge(web, p["href"], p["team"], 
                width=min(t["team_val"] * 0.4, 5.0),
                color=team_to_color[p["team"]],
                title=f'{p["player"]} | {p["team"]}\n{", ".join(t["years"])}\nBPM: {" || ".join(t["bpm"])}\nGP: {t["gp"]}, GS: {t["gs"]}, Win Shares: {t["ws"]}'
            )
        else:
            # teammate node
            # player1, player2, year, team, minutes_played, points_diff
            if p["player1"] != player and p["player2"] != player:
                continue
            # don't double count same relationships
            node = p["player1"] + p["player2"]
            check = p["player1"] + p["player2"] + p["team"] + p["year"]
            mins = float(p["minutes_played"].split(":")[0])
            year = p["year"]
            teammate_val = mins * max(float(p["points_diff"]), 0.5)
            if check in pairs:
                continue

            # update working cache
            if node in teammates:
                if p["team"] in teammates[node]["teams"]:
                    teammates[node]["teams"][p["team"]]["years"].append(year)
                    teammates[node]["teams"][p["team"]]["mins"] += mins
                    teammates[node]["teams"][p["team"]]["pd"].append(p["points_diff"])
                    teammates[node]["teams"][p["team"]]["val"] += teammate_val
                else: 
                    teammates[node]["teams"][p["team"]] = {
                        "years" : [year], "mins" : mins, "val" : teammate_val, "pd" : [p["points_diff"]]
                    }
                teammates[node]["mins"] += mins
                teammates[node]["val"] += teammate_val
            else:
                teammates[node] = { 
                    "teams" : { 
                        p["team"] : { 
                            "years" : [year], "mins" : mins, "val" : teammate_val, "pd" : [p["points_diff"]] 
                        }
                    },
                    "mins" : mins, "val" : teammate_val
                }

            other = p["player1"] if p["player1"] != player else p["player2"]
            label=(names[other] if other in names else other) 
            teammate_yrs = ""
            for tm in teammates[node]["teams"]:
                teammate_yrs += "| " + tm + " " + ", ".join(teammates[node]["teams"][tm]["years"]) + " |"
            teammate_label = f'{names[player]} & {label}\n{teammate_yrs}\n{teammates[node]["mins"]} minutes' 
            teammate_weight = min(teammate_node_size + teammates[node]["val"] * 0.001, teammate_node_max_size)
            add_or_update_node(web, node, 
                size=teammate_weight,
                shape=("star" if teammate_weight >= 9.0 else "dot"),
                title=f'{label}\nMinutes: {teammates[node]["mins"]}\n{teammate_yrs}', 
                label=label, mass=(1.0 + teammates[node]["val"] * 0.00004),
                color=team_to_color[p["team"]]
            )
            add_or_update_node(web, p["team"], 
                color=team_to_color[p["team"]], 
                size=team_node_size,
                label=p["team"], title=p["team"], 
                shape="box", mass=team_node_mass
            )
            
            # edge from player to teammate
            add_or_update_edge(web, node, player,
                width=min(teammates[node]["mins"] * 0.001, 10.0), 
                color=team_to_color[p["team"]],
                title=teammate_label
            )

            # edge from teammate to team
            team = teammates[node]["teams"][p["team"]]
            val_weight = min(max(team["val"] * 0.0004, 0.05), 10.0)
            teammate_val_label = title=f'{names[player]} & {label}\n{p["team"]} {", ".join(team["years"])}\nBPM: {", ".join(team["pd"])}\n{team["mins"]} minutes'
            add_or_update_edge(web, node, p["team"],
                width=val_weight, color=team_to_color[p["team"]],
                title=teammate_val_label
            )
            pairs.append(check)

    web.show_buttons(filter_=['physics'])
    web.show("nba_player_web.html", notebook=False)
