import os
import time
import requests
import pystyle
import random
import sys
from pystyle import *

def sendRequest(s): 
    try: 
        return requests.get(s).content
    except Exception:
        pass

def saveFile(f,w):
    try:
        f.write(sendRequest(w))
    except Exception:
        pass 

os.system('clear')
os.system('mode con: cols=120 lines=50')

socks = open('socks5.txt','wb')

# HTTP Proxies Sources
socks_ = ["https://raw.githubusercontent.com/hookzof/socks5_list/master/proxy.txt", "https://raw.githubusercontent.com/MuRongPIG/Proxy-Master/main/socks5.txt", "https://github.com/Anonym0usWork1221/Free-Proxies/raw/main/proxy_files/socks5_proxies.txt", "https://raw.githubusercontent.com/AGDDoS/AGProxy/master/proxies/socks5.txt", "https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/socks5.txt", "https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/socks5.txt", "https://api.proxyscrape.com/v2/?request=displayproxies&protocol=socks5&timeout=10000&country=all&ssl=all&anonymity=all"]
for h in socks_:
    saveFile(socks, h)

Write.Print("[!] Successfully Scraped And Saved SOCKS5 Proxies!\n", Colors.white_to_red, interval=0)
time.sleep(1)


# Closing Files
socks.close()

# Done!
time.sleep(1)
Write.Print("Press any key to continue . . .", Colors.white_to_red, interval=0)
input()