import scrapy
from scrapy import Selector

# there may or may not be a good way to find # of games played together in a season
#   RealGM has a sort of thing, but it's kind of hard to work w and also doesn't filter by season 
#   Like it is just conglomerated, which doesn't super help

# problems that are going to occur -> supersonics relocation (SEA = OKC)
# perhaps CHA as well with bobcats, hornet, whatever

class TeammateWebSpider(scrapy.Spider):
    name = "teammates"
    player_start = 493 # bball ref rank num to start at
    batch_size = 50 # number of players to parse in a given iteration

    # "Mozilla/5.0 (Linux; Android 13; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36"
    user_agent = "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0)"
    # "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
    # "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0)"

    start_urls = [
        # main page with player table
        "https://www.basketball-reference.com/leagues/NBA_2025_per_game.html",
    ]

    # item format:
    #   href: /players/g/gilgesh01.html
    #   name: Shai Gilgeous-Alexander
    #   teams: [
    #      { year: 2018-19, team: LAC, games_played: 82, games_started: 73,
    #        minutes: 2174, win_shares: 3.3, win_shares_per_48: .074, box_plus_minus: -0.5 }, 
    #      ...
    #      { year: 2024-25, team: OKC, games_played: 76, games_started: 76, ... }
    #    ]

    # item format:
    #   year: 2018-19
    #   teammates: [
    #       { player_1: /players/g/gilgesh01.html, player_2: /players/g/gallida01.html, minutes_played: 1374:56, plus_minus: 0.9 }
    #       ...
    #       { player_1: /players/g/gilgesh01.html, player_2: players/s/scottmi01.html, minutes_played: 252:56, plus_minus: 0.6 }
    #   ]

    # this is the default url response handler
    def parse(self, response):
        players = response.css("table#per_game_stats tbody tr").xpath("./td[@data-stat='name_display']").css('a::attr(href)')
        player_links = []
        prev = ''
        # get links in order, so i can section off the parsing properly
        for p in players:
            link = p.get()
            if prev != link:
                player_links.append(link)
                prev = link
        # yield response.follow(player_links.pop(), callback=self.parse_player)
        yield from response.follow_all(player_links[(self.player_start - 1) : (self.player_start - 1 + self.batch_size)], callback=self.parse_player)

    # get all teams played with, then req through lineup pages
    def parse_player(self, response):
        stats_table = response.css("table#advanced tbody tr")
        for row in stats_table:
            # ignore 2TM since this is just a conglomeration of data that we already scrape
            if not row.xpath("./td[@data-stat='team_name_abbr']").css('a::text').get() is None:
                yield {
                    "player" : response.css("div#meta span::text").get(), "href" : response.request.url.split(".com")[1],
                    "year" : row.css("th a::text").get(), "team" : row.xpath("./td[@data-stat='team_name_abbr']").css('a::text').get(), 
                    "games_played" : row.xpath("./td[@data-stat='games']//text()").get(), "games_started" : row.xpath("./td[@data-stat='games_started']//text()").get(), 
                    "minutes_played" : row.xpath("./td[@data-stat='mp']//text()").get(), "win_shares" : row.xpath("./td[@data-stat='ws']//text()").get(), 
                    "win_shares_per_48" : row.xpath("./td[@data-stat='ws_per_48']//text()").get(), "box_plus_minus" : row.xpath("./td[@data-stat='bpm']//text()").get()
                }

        lineup_div = response.css("div#inner_nav ul li.full")
        title = lineup_div.xpath("//p[contains(text(), 'Player lineups')]")
        lineup_links = set(title.xpath('following-sibling::ul').css("li a::attr(href)").getall())
        # yield response.follow(lineup_links.pop(), callback=self.parse_lineup)
        yield from response.follow_all(lineup_links, callback=self.parse_lineup)
        
    # get teammate data from the current year
    def parse_lineup(self, response):
        commented_table_div = response.xpath("//div[@id='all_lineups-2-man']").get()
        table = commented_table_div.split("<!--")[1].split("-->")[0]
        pairs_table = Selector(text=table).css('tbody tr')
        for row in pairs_table:
            # ignore averages for 2-player pairings
            if not row.xpath("./td[@data-stat='lineup']/a[1]/@href").get() is None:
                yield {
                    "player1" : row.xpath("./td[@data-stat='lineup']/a[1]/@href").get(), 
                    "player2" : row.xpath("./td[@data-stat='lineup']/a[2]/@href").get(), 
                    "year" : response.request.url.split("/")[-1],
                    "team" : row.xpath("./td[@data-stat='team_id']/a/text()").get(), 
                    "minutes_played" : row.xpath("./td[@data-stat='mp']/text()").get(), 
                    "points_diff" : row.xpath("./td[@data-stat='diff_pts']/text()").get(), 
                }

