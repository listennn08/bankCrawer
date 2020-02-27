const request = require('request');
const cheerio = require('cheerio');
function jpyLowest(){
    console.log("1")
    getData((body) => {
        console.log("4")
        var $ = cheerio.load(body)
        var rate = $('.rate-content-cash.text-right.print_table-cell') //每日
        //var rate = $('.text-right.rate-content-cash')
            .filter((index) => {
                return index % 2  && index < 14
            })
            .map((index, obj)=>{
                return $(obj).text()
            })
            .get()
        //console.log(rate)
        var lowest = Math.min(...rate)
        var gotoBackRightNow = (lowest == rate[0]) ? true : false
        console.log(rate)
        console.log(gotoBackRightNow);
    })
}
function getData(callback){
    console.log("2")
    url = 'https://rate.bot.com.tw/xrt/quote/ltm/JPY';
    //url = 'https://rate.bot.com.tw/xrt/quote/ltm/AUD';
    //url = 'https://rate.bot.com.tw/xrt/quote/ltm/SGD';
    //url = 'https://rate.bot.com.tw/xrt/quote/day/AUD';
    //ltm 歷史牌告匯率 day 美日牌告匯率

    request(url, (err, res, body) =>{
        console.log("3")
        callback(body)
    })
}
jpyLowest();
setInterval(jpyLowest, 24*60*60*1000);