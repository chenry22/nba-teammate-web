# NBA Teammate Web
This is a little project I thought would be cool that maps networks of NBA players and their former teammates.

- `/docs` contains the GitHub pages source files (public website)
- `/pyvis_scripts` contains two scripts that do Pyvis visualizations of the collected data. One of these is a mapping considering all of the 2024-25 rosters and their time played together, the other allows you to generate a full network for any 2024-25 NBA player (though the data may be incomplete, since not all players have been parsed)
- `/teammate_web_scraper` contains the original Scrapy project used to collect the player and lineup data for the project. Lineup data was limited and time consuming, so another approach ended up being used for that.
- `lineup_scraper.py` is the script to compile two-man lineup data from the NBA API (2008-2025)