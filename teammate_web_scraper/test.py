import requests
url = "https://www.basketball-reference.com/leagues/NBA_2025_per_game.html"
headers = {
    "User-Agent": "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0)",
}
response = requests.get(url, headers=headers)
print(response.status_code)