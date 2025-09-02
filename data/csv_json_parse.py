from collections import defaultdict
from numpy import NaN
import pandas as pd
import json

df = pd.read_csv("lineups_2025_08.csv")
edges = []
edges_by_year = {}
for index, row in df.iterrows():
    p1 = row["GROUP_ID"].split("-")[1]
    p2 = row["GROUP_ID"].split("-")[2]
    year = row["Year"]
    edge = {
        "player1" : p1, "player2" : p2, "year" : year,
        "label" : row["GROUP_NAME"], "team" : row["TEAM_ABBREVIATION"],
        "gp" : row["GP"], "win_pct" : row["W_PCT"], "min" : row["MIN"],
        "e_net_rating" : row["E_NET_RATING"]
    }
    if not row["TEAM_ABBREVIATION"] is NaN:
        edges.append(edge)
        if year in edges_by_year:
            edges_by_year[year].append(edge)
        else:
            edges_by_year[year] = [edge]

with open("lineup_edges.json", "w") as f:
    json.dump(edges, f, indent=1)
for year, edges in edges_by_year.items():
    with open(f"{year}.json", "w") as f:
        json.dump(edges, f, indent=1)

print("Export complete!")
