# NBA Teammate Web
This is a little project I thought would be cool that maps networks of NBA players and their former teammates. Right now the deployed GitHub Pages site is just a map of players who played at least 1 game during the 2024-25 NBA season (and pairings that played at least 20 minutes together). Hopefully soon I can set up more filtering and allow people to see the networks of individual players!

- `/data` contains a helper script that converts the lineup .csv into Sigma readable .json
- `/docs` contains the GitHub pages source files (public website)
- `/lineup_scraper` contains the script used to compile two-man lineup data from the NBA API (2008-2025)
- `/pyvis_scripts` contains two scripts that do Pyvis visualizations of the collected data. One of these is a mapping considering all of the 2024-25 rosters and their time played together, the other allows you to generate a full network for any 2024-25 NBA player (though the data may be incomplete, since not all players have been parsed)
- `/teammate_web_scraper` contains the original Scrapy project used to collect the player and lineup data for the project. Lineup data was limited and time consuming, so another approach ended up being used for that.
- `/web_app` contains the web app built off Sigma JS