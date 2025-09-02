from pyvis.network import Network
import numpy as np
import json

# This file handles the data visualization through PyVis
# Basically parses through the .json file we generated to create a network display

team_to_color = {
    "MIA" : "#98002e", "LAL" : "#552583", "BOS" : "#007a33", "LAC" : "#c8102e", "BRK" : "#000000",
    "CHO" : "#00788c", "CHI" : "#ce1141", "ATL" : "#e03a3e", "PHO" : "#e56020", "DAL" : "#00538c", 
    "DEN" : "#fec524", "DET" : "#c8102e", "GSW" : "#1d428a", "HOU" : "#ce1141", "IND" : "#fdbb30", 
    "MEM" : "#5d76a9", "MIL" : "#00471b", "MIN" : "#0c2340", "NOP" : "#0c2340", "NYK" : "#f58426",
    "OKC" : "#007ac1", "ORL" : "#0077c0", "PHI" : "#006bb6", "POR" : "#e03a3e", "SAC" : "#5a2d81", 
    "SAS" : "#c4ced4", "TOR" : "#ce1141", "UTA" : "#002b5c", "CLE" : "#860038", "WAS" : "#002b5c"
}
players = {}
pairs = []

web = Network()
def add_or_update_node(net, node_id, **attrs):
    # search existing node
    for node in net.nodes:
        if node["id"] == node_id:
            node.update(attrs)
            return
    # if not found, add new
    net.add_node(node_id, **attrs)

nodes = list(team_to_color.keys()) # these should be href id OR team
weights = np.repeat(20, len(team_to_color.keys())).tolist() # how big the node is
shape = np.repeat("box", len(team_to_color.keys())).tolist()
names = list(team_to_color.keys()) # visible label (player name)
descs = list(team_to_color.keys())
colors = list(team_to_color.values()) # should be based on team
web.add_nodes(nodes, size=weights, title=descs, label=names, color=colors, shape=shape)

with open('../teammate_web_data.json', 'r') as file:
    data = json.load(file)
    file.close()
    for p in data:
        if p["year"] != "2024-25" and p['year'] != "2025":
            continue

        if not "player1" in p:
            val = (float((int(p["games_played"]) / 2.0) + int(p["games_started"])) / 82.0) + (float(p['win_shares']) * 1.5)
            weight = players[p["href"]] + val if p["href"] in players else val

            # player (name), href (id), year, team (edge), games_played, games_started, minutes_played, win_shares, win_shares_per_48, box_plus_minus
            add_or_update_node(web, p["href"], label=p["player"], 
                color=team_to_color[p["team"]], size=max(weight, 1.0), 
                shape=("star" if float(p['win_shares']) >= 7.0 else "dot"),
                title=(f'{p["player"]}\n{p["team"]} {p["year"]}\nGames Played: {p["games_played"]}\nGames Started: {p["games_started"]}\nWin Shares: {p["win_shares"]}')
            )

            edge_weight = max((float((int(p["games_played"]) / 2.0) + int(p["games_started"])) / 1000.0), 0.05)
            web.add_edge(p["href"], p["team"], width=edge_weight, 
                title=f'{p["player"]}\nGP: {p["games_played"]}, GS: {p["games_started"]}'
            )
            players[p["href"]] = weight
        else:
            # player1, player2, year, team, minutes_played, points_diff
            node = p["player1"] + p["player2"]
            if node in pairs:
                continue

            # web.add_node(node, label=None,
            #     shape=("star" if float(p["points_diff"]) >= 0 else "triangle"), 
            #     size=abs(float(p["points_diff"])),
            #     color=team_to_color[p["team"]],
            #     title=f'{p["team"]} {p["year"]}\n{p["minutes_played"]} minutes played\n{p["points_diff"]} point diff vs opponents',
            # )
            
            # set placeholder, to be replaced later
            if not p['player1'] in players:
                web.add_node(p["player1"], size=3.0, label=None,
                    color=team_to_color[p["team"]])
            if not p['player2'] in players:
                web.add_node(p["player2"], size=3.0, label=None,
                    color=team_to_color[p["team"]])

            web.add_edge(p["player1"], p["player2"], 
                width=max(float(abs(float(p["points_diff"])) * int(p["minutes_played"].split(":")[0]) / 2000.0), 0.05),
                color=team_to_color[p["team"]],
                title=f'{p["team"]} {p["year"]}\n{p["minutes_played"]} minutes played\n{p["points_diff"]} point diff vs opponents',
                alpha=(1.0 if float(p["points_diff"]) >= 0.0 else 0.5)
            )
            # web.add_edge(node, p["player1"], width=float(float(p["minutes_played"].split(":")[0]) / 10000.0))
            # web.add_edge(node, p["player2"], width=float(float(p["minutes_played"].split(":")[0]) / 10000.0))
            # web.add_edge(node, p["team"], width=float(abs(float(p["points_diff"])) / 2000.0))
            pairs.append(node)

    web.force_atlas_2based()
    web.show_buttons(filter_=['physics'])
    web.show("nba_web.html", notebook=False)
