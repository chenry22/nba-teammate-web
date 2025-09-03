# NBA Teammate Web
This is a little project I thought would be cool that maps networks of NBA players and their former teammates.

[The main page](https://chenry22.github.io/nba-teammate-web/) shows the complete web of the 2024-25 NBA season (pairings that played at least 20 minutes together).

Visit [`/player_index`](https://chenry22.github.io/nba-teammate-web/player_index) to get a list of all player networks possible to be created. Visit `/player?id={nba_id}` to get that network directly. For example, Bam Adebayo has the ID 1628389, so you would go to [`/player?id=1628389`](https://chenry22.github.io/nba-teammate-web/player?id=1628389) to visit his network (WIP).

- `/data` contains a helper script that converts the lineup .csv into Sigma readable .json
- `/docs` contains the GitHub pages source files (public website)
- `/lineup_scraper` contains the script used to compile two-man lineup data from the NBA API (2008-2025)
- `/pyvis_scripts` contains two scripts that do Pyvis visualizations of the collected data. One of these is a mapping considering all of the 2024-25 rosters and their time played together, the other allows you to generate a full network for any 2024-25 NBA player (though the data may be incomplete, since not all players have been parsed)
- `/teammate_web_scraper` contains the original Scrapy project used to collect the player and lineup data for the project. Lineup data was limited and time consuming, so another approach ended up being used for that.
- `/web_app` contains the web app built off Sigma JS