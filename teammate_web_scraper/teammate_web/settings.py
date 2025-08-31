# Scrapy settings for teammate_web project
#
# For simplicity, this file contains only settings considered important or
# commonly used. You can find more settings consulting the documentation:
#
#     https://docs.scrapy.org/en/latest/topics/settings.html
#     https://docs.scrapy.org/en/latest/topics/downloader-middleware.html
#     https://docs.scrapy.org/en/latest/topics/spider-middleware.html

BOT_NAME = "teammate_web"

SPIDER_MODULES = ["teammate_web.spiders"]
NEWSPIDER_MODULE = "teammate_web.spiders"

# Crawl responsibly by identifying yourself (and your website) on the user-agent
# USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36'

# Obey robots.txt rules
ROBOTSTXT_OBEY = False

# Configure maximum concurrent requests performed by Scrapy (default: 16)
#CONCURRENT_REQUESTS = 32

# Configure a delay for requests for the same website (default: 0)
# See https://docs.scrapy.org/en/latest/topics/settings.html#download-delay
# See also autothrottle settings and docs
DOWNLOAD_DELAY = 3.5 # bball ref limits to max 20 requests per minute, good to be a bit under to not get blocked
# The download delay setting will honor only one of:
#CONCURRENT_REQUESTS_PER_DOMAIN = 16
#CONCURRENT_REQUESTS_PER_IP = 16

# Disable cookies (enabled by default)
#COOKIES_ENABLED = False

# Disable Telnet Console (enabled by default)
#TELNETCONSOLE_ENABLED = False

# Override the default request headers:
# DEFAULT_REQUEST_HEADERS = {
#     "User-Agent": "Mozilla/5.0 (Linux; Android 13; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36",
#     "Accept" : "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
#     "Accept-Encoding" : "gzip, deflate, br, zstd",
#     "Accept-Language" : "en",
#     "Cookie" : "mm-src-01jrwxexxy83v5m8=https://mp.mmvideocdn.com/mini-player/prod/voltax_mp.js; mm-player-session-id=VCvMkHVQvj8m7NEF; srcssfull=yes; is_live=true; osano_consentmanager_uuid=2f7a71f9-f874-4072-b7ac-24d4187f33dd; _ga=GA1.1.1865454163.1756579423; mm-user-id=yoUjp8dTIFSinwdj; mm-session-id=VCvMkHVQvj8m7NEF; _li_dcdm_c=.basketball-reference.com; _lc2_fpi=092437e7cb2b--01k3y4nsd3cj2xf4x2phtyq0gp; _lc2_fpi_meta=%7B%22w%22%3A1756579423651%7D; _lr_retry_request=true; _lr_env_src_ats=false; _cc_id=73fc8450a38ef813ce8b931ce1020b71; panoramaId_expiry=1757184223795; panoramaId=59a1c1a1c1631c478b958f2d964816d53938a480f9cac38db7653203df12997c; panoramaIdType=panoIndiv; gamera_user_id=5eacb8b1-7af3-4880-8a7f-f502780be825; pbjs_fabrickId=%7B%22fabrickId%22%3A%22E1%3Ah3OyS_pbuTKa3tI6ZdjqEuGhH7RfTQ89PYsbti3jfkJLV7FPj8G3jrQXDgMFn5kVhlzWRX23RRw31F74RxmAjakhg4Hc96deVxemUW_9csF7pL8OfVYKTW1u9fREG5NI%22%7D; _au_1d=AU1D-0100-001756579425-NA91FHHS-PSX7; ccuid=6b7fd37f-2951-4a8c-931a-266183dc9636; __qca=P1-ddc2732e-64b2-43c1-b900-2e8ee9b93072; __gads=ID=669ab9dd3f1f6988:T=1756579426:RT=1756579426:S=ALNI_MaH8Ajo0jWN9VGFIQi1rg7j6Ipx6A; __gpi=UID=00001262cccd8137:T=1756579426:RT=1756579426:S=ALNI_MaXUdpzdH-jmjduVSvccLbhNIUC8A; __eoi=ID=ae9b6146e0c2a939:T=1756579426:RT=1756579426:S=AA-AfjbkmweocXWj-dZ3JPxVkGz5; _lr_sampling_rate=100; __cf_bm=ZfwO1NQx80wVq1Fx.Y4UFcqFAC.A00hHhpZrsFEoQq0-1756579452-1.0.1.1-JdNvBdhQEuLRByGOsPKSpNfj6wcv1XufG.JGIz8pEvGfLzIZnmT19E_U1rbre.rRfOx021Uklj..By_tBgTao2D9jGebqzMgb5r4AjizWQs; __hstc=180814520.f37106a4b56f226f13e7b40f57fa8ea2.1756579458549.1756579458549.1756579458549.1; hubspotutk=f37106a4b56f226f13e7b40f57fa8ea2; __hssrc=1; sr_n=1%7CSat%2C%2030%20Aug%202025%2018%3A44%3A56%20GMT; _ga_FVWZ0RM4DH=GS2.1.s1756579453$o1$g1$t1756579516$j60$l0$h0; _ga_NR1HN85GXQ=GS2.1.s1756579423$o1$g1$t1756579522$j29$l0$h0; cto_bundle=rONDll9tYTFjYXFWR3FQbDcwZWJxcTdVa1NPMjMzV0hHWHQ5SmdmMFluWGhUZjZVdjUzandhUTE2Um5WViUyQktJdUp1eUtSbjEzUHJOQjcycnJaNDBqJTJCbXhXNTdPdXhqeE5IViUyRm5ZbUhtaE40bTFYcDVBdVVmbGpBdkZ1cE1VUEtJZEZlNzc0YWF4VFhSVnl1N1A5d2Y1Rlc4QzQ3WTc2cnBBTktqWE1tTUl3RFUlMkI3OCUzRA; cto_bidid=rrMNAF9wY2JyUXNXSjVteGY2ayUyRmQyRTVPTXhHN2dWWnhlJTJGUjA3dmJ5MW05SkVTdFpVRldyJTJGN3ZhT1NGaUhoSnF5bklyTHRZbjdFaHF1ZlB2d3N5Z3dDWXltdjZzMll0Vld3dlByaVNwSmlwamJhUmNEJTJCalJCSEhzQjhKdzclMkJZdmFTbnA; _ga_80FRT7VJ60=GS2.1.s1756579423$o1$g1$t1756579523$j28$l0$h0; __hssc=180814520.4.1756579458549; pbjs_fabrickId_cst=riwMLDMsbg%3D%3D",
#     "Priority" : "u=0, i",
#     "Referer" : "https://www.basketball-reference.com/leagues/NBA_2025.html",
#     "Upgrade-Insecure-Requests" : '1',
# }

# Enable or disable spider middlewares
# See https://docs.scrapy.org/en/latest/topics/spider-middleware.html
#SPIDER_MIDDLEWARES = {
#    "teammate_web.middlewares.TeammateWebSpiderMiddleware": 543,
#}

# Enable or disable downloader middlewares
# See https://docs.scrapy.org/en/latest/topics/downloader-middleware.html
#DOWNLOADER_MIDDLEWARES = {
#    "teammate_web.middlewares.TeammateWebDownloaderMiddleware": 543,
#}

# Enable or disable extensions
# See https://docs.scrapy.org/en/latest/topics/extensions.html
#EXTENSIONS = {
#    "scrapy.extensions.telnet.TelnetConsole": None,
#}

# Configure item pipelines
# See https://docs.scrapy.org/en/latest/topics/item-pipeline.html
#ITEM_PIPELINES = {
#    "teammate_web.pipelines.TeammateWebPipeline": 300,
#}

# Enable and configure the AutoThrottle extension (disabled by default)
# See https://docs.scrapy.org/en/latest/topics/autothrottle.html
#AUTOTHROTTLE_ENABLED = True
# The initial download delay
#AUTOTHROTTLE_START_DELAY = 5
# The maximum download delay to be set in case of high latencies
#AUTOTHROTTLE_MAX_DELAY = 60
# The average number of requests Scrapy should be sending in parallel to
# each remote server
#AUTOTHROTTLE_TARGET_CONCURRENCY = 1.0
# Enable showing throttling stats for every response received:
#AUTOTHROTTLE_DEBUG = False

# Enable and configure HTTP caching (disabled by default)
# See https://docs.scrapy.org/en/latest/topics/downloader-middleware.html#httpcache-middleware-settings
#HTTPCACHE_ENABLED = True
#HTTPCACHE_EXPIRATION_SECS = 0
#HTTPCACHE_DIR = "httpcache"
#HTTPCACHE_IGNORE_HTTP_CODES = []
#HTTPCACHE_STORAGE = "scrapy.extensions.httpcache.FilesystemCacheStorage"

# Set settings whose default value is deprecated to a future-proof value
TWISTED_REACTOR = "twisted.internet.asyncioreactor.AsyncioSelectorReactor"
FEED_EXPORT_ENCODING = "utf-8"
