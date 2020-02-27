let nodeoutlook = require('nodejs-nodemailer-outlook');
let chrome = require('selenium-webdriver/chrome')
let { Builder, By, until } = require('selenium-webdriver');

const getData = () => {

    let driver = new Builder()
             .forBrowser('chrome')
             .setChromeOptions(new chrome.Options().headless())
             .build();
    let url = 'https://www.taishinbank.com.tw/TSB/customer-service-center/lookup/history/?queryflg=1&currencyType=JPY&spotcash=spot&queryInterval=30';
    let textPromise = driver.get(url)
        .then(() => driver.findElements(By.xpath("//table[@class='display']/tbody/tr/td")))
        .then( td => {
            return td.map(async (el) => await el.getText());
        });


    textPromise.then( data => {
        return new Promise( resolve => {
            setTimeout(()=> resolve(data), 5000)
        })
    }).then( async d => {
        let date = [];
        let rate4Buyin = [];
        d.forEach( async (el, i) => {
            if (i % 3 == 0) {
                let tmpDate = await el;
                date.push(tmpDate);
            } else if (i % 3 == 2) {
                let tmpBuy = await el;
                rate4Buyin.push(tmpBuy);
            }
        })
        return  await [date, rate4Buyin];
    }).then( data => {
        let map = {};
        for (let i = 0; i < data[0].length;i++) {
            map[data[0][i]] = _fix4Digit(data[1][i]);
        }
        callback(driver, map)
    })
    /** 小數點後 4 位補滿 0 */
    const _fix4Digit = (num) => {
        if (typeof num == 'number') num = num.toString();
        let beforeDot = num.split('.')[0]; 
        let afterDot = num.split('.')[1];
        return (afterDot.length < 4) ? _fix4Digit(`${beforeDot}.${afterDot}${'0'}`) : `${beforeDot}.${afterDot}`
    }
    
}


const callback = (driver, rates/*, map*/) => {
    let lowest = Math.min(...Object.values(rates));
    let today = _formatTime(new Date())
    if ( rates[today] == lowest) console.log(Object.keys(rates).indexOf(today))
    // console.log(lowest)
    // let lowestDay = Object.keys(rates).find( key => rates[key] === lowest);
    // console.log(lowestDay)
    // if (rate[0] == lowest) send(rate, rate[0])
    // if (map[n] == lowest) send(map, rate[0])
    // console.log(rates);
    driver.quit();

    /** 時間格式化 yyyy/mm/dd */
    function _formatTime (t) {
        let yy = t.getFullYear();
        let mm = (t.getMonth()+1) < 10 ? `0${t.getMonth()+1}` : t.getMonth()+1;
        let dd = t.getDate < 10 ? `0${t.getDate()}` : t.getDate();
        return `${yy}/${mm}/${dd}`
    } 
}

getData();

const send = (rate, tRate) => {
    let allRate = rate.map( el => `<font color="green">${el}</font>`).join(', ');
    // let date = Object.keys(map1).map( el => `<td>${el}</td>`);
    // let rrate = Object.values(map1).map( el => `<td>${el}</td>`);
    // let table = '<table><tr><td>日期</td><td>賣出</td></tr>';
    // for (let i=0; i<rrate.length;i++) {
    //     table += `<tr>${date[i]}${rrate[i]}</tr>`;
    // }
    // table += '</table>'
    nodeoutlook.sendEmail({
        auth: {
            user: "******@outlook.com",
            pass: "******"
        },
        from: '******@outlook.com',
        to: '******@gmail.com',
        subject: '匯率低點通報',
        // html: `<b>今天匯率是最低點: <font color='red'>${tRate}</font></b><br>30天匯率: <table style="border:1px #000 solid;border-collapse:collapse;" border=1>${table}</table>`,
        html: `<b>今天匯率是最低點: <font color='red'>${tRate}</font></b><br>30天匯率: ${allRate}`,
        text: 'This is text version!',
        // replyTo: 'receiverXXX@gmail.com',
        // attachments: [
        //     {
        //         filename: 'text1.txt',
        //         content: 'hello world!'
        //     },
        // ],
        onError: (e) => console.log(e),
        onSuccess: (i) => console.log(i)
    });
}


/*
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
        user: '******@outlook.com',
        pass: '******'
    }
});
var options = {
    from: '******<gamil.com>',
    to: '******@gmail.com',
    subject: '匯率低點通報',
    html: '',
}

transporter.sendMail(options, function(err, info) {
    if (err) {
        console.log(err);
    } else {
        console.log('訊息發送:' + info.response);
    }
});
*/
