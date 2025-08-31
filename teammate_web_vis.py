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

web = Network()

nodes = list(team_to_color.keys()) # these should be href id OR team
weights = np.repeat(12, len(team_to_color.keys())).tolist() # how big the node is
names = list(team_to_color.keys()) # visible label (player name)
descs = list(team_to_color.keys())
colors = list(team_to_color.values()) # should be based on team
web.add_nodes(nodes, size=weights, title=descs, label=names, color=colors)

with open('teammate_web_data.json', 'r') as file:
    data = json.load(file)
    file.close()
    for p in data:
        if p["year"] != "2024-25":
            continue

        if not "player1" in p:
            val = (float((int(p["games_played"]) / 2.0) + int(p["games_started"])) / 82.0) + (float(p['win_shares']) * 2.0)
            weight = players[p["player"]] + val if p["player"] in players else val

            # player (name), href (id), year, team (edge), "games_played": "80", "games_started": "55", "minutes_played": "1733", "win_shares": "6.7", "win_shares_per_48": ".185", "box_plus_minus": "3.9"},
            web.add_node(p["href"], label=p["player"], color=team_to_color[p["team"]],
                         size=(weight), 
                         title=(f'{p["player"]}\n{p["team"]} {p["year"]}\nGames Played: {p["games_played"]}\nGames Started: {p["games_started"]}\nWin Shares: {p["win_shares"]}'))
            edge_weight = min((float((int(p["games_played"]) / 2.0) + int(p["games_started"])) / 100000.0), 0.05)
            print(edge_weight)
            web.add_edge(p["href"], p["team"], value=edge_weight, 
                         title=f'{p["player"]}\nGP: {p["games_played"]}, GS: {p["games_started"]}')
            players[p["player"]] = weight
        else:
            # teammate data
            print('teammate node')
    web.show("nba_web.html", notebook=False)
