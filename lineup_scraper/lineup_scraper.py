from nba_api.stats.endpoints import leaguedashlineups
from nba_api.stats.static import teams
import pandas as pd
import time

team_ids = list(map(lambda t: t["id"], teams.get_teams()))
years = ['2024-25', '2023-24', '2022-23', '2021-22', '2020-21', '2019-20', '2018-19', 
    '2017-18', '2016-17', '2015-16', '2014-15', '2013-14', '2012-13', '2011-12', '2010-11', 
    '2009-10', '2008-09', '2007-08' # no data past this...
]
data = []

for year in years:
    print("Starting Year " + year)
    for t in team_ids:
        lineups = leaguedashlineups.LeagueDashLineups(
            group_quantity=2,
            per_mode_detailed='Totals',
            season_type_all_star='Regular Season',
            season=year,
            measure_type_detailed_defense='Advanced',
            team_id_nullable=t,
            league_id_nullable="00",
            timeout=1000,
        )
        df = pd.DataFrame(lineups.get_data_frames()[0])
        df["Year"] = year
        data.append(df)
        print(f'   {teams.find_team_name_by_id(t)["full_name"]}: {df.shape}')
        df = pd.concat(data, ignore_index=True)
        df.to_csv("tmp.csv", index=False)
        time.sleep(1)
    print("Completed year " + year)

df = pd.concat(data, ignore_index=True)
df.to_csv("two_man_lineups.csv", index=False)