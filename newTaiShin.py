import time
from colorama import init, Fore, Back, Style
from termcolor import colored
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.chrome.options import Options

def scrap():
    try:
        while True:
            #無頭模式
            options = Options()
            options.add_argument('--incognito')
            options.add_argument('--headless')
            options.add_argument('--disable-gpu')
            options.add_argument('log-level=3') #log levelINFO = 0, WARNING = 1, LOG_ERROR = 2, LOG_FATAL = 3.
            driver = webdriver.Chrome(options=options)
            wait = WebDriverWait(driver, 1000)
            #currentType 幣值
            #queryInterval 查詢區間
            url = "https://www.taishinbank.com.tw/TSB/customer-service-center/lookup/history/?queryflg=1&currencyType=JPY&spotcash=spot&queryInterval=30"
            driver.get(url)
            time.sleep(1)
            table = driver.find_element_by_class_name('display')
            tbody = table.find_element_by_tag_name('tbody')
            trs = tbody.find_elements_by_tag_name('tr')
            rate = []
            for tr in trs:
                td = tr.find_elements_by_tag_name('td')[2].text
                rate.append(td)
            init()
            print('\t\t')
            print(rate)
            print("Today Rate: ",end="")
            print(Fore.GREEN + rate[0] +Fore.RESET)
            Lowest = Fore.YELLOW + "YES" if rate[0] == min(rate) else Fore.RED + "NO"
            print ("Is Lowest Rate: " + Lowest + Fore.RESET)
            driver.quit()
            time.sleep(60*60*6)

    except Exception as e:
        print('Error')
        print(e)


if __name__ == '__main__':
    scrap()
