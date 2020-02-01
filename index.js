//"06f5e9828503a3d5b72a08a3d556d799eafebd8c505c08fe048d366a582aef205e89ccc9159e0fe58a91d"
//id 185873386
const fs = require("fs");
const {VK} = require('vk-io');

const vk = new VK({
    token: "06f5e9828503a3d5b72a08a3d556d799eafebd8c505c08fe048d366a582aef205e89ccc9159e0fe58a91d"
});
const {api} = vk;
let rasp = "https://sun9-3.userapi.com/c846122/v846122093/d6776/NqM_20zkAbM.jpg";
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('schedule.db');

// var TelegramBot = require('node-telegram-bot-api'); // Устанавливаем токен, который выдавал нам бот
// var token = '917044014:AAEWZIEZOgjGmYnXjscYRMYFda259a88Tx8'; // Включить опрос сервера. Бот должен обращаться к серверу Telegram, чтобы получать актуальную информацию 
// var bot = new TelegramBot(token, { polling: true });


const {SessionManager} = require('@vk-io/session');
const {SceneManager, StepScene} = require('@vk-io/scenes');
const sessionManager = new SessionManager();
const sceneManager = new SceneManager();

/* fs.writeFileSync('users.json', JSON.stringify(file, null, 2));
file = JSON.parse(fs.readFileSync('users.json', 'utf-8')) */

//file = JSON.parse(fs.readFileSync('schedule.json', 'utf-8'))
console.log("Bot was started");
vk.updates.hear('/start', async (context) => {
    await context.send(`
		My commands list
		/cat - Фото котика
		/time - Показать дату 
        /reverse - Reverse text
        /ras - Скинуть рассписание на сегодня
        /ras next - Скинуть рассписание на завтра
        /ras img - Скинуть рассписание в виде картинки
        /ras <день> - Скинуть рассписание определенного дня
        /ras <день> <месяц> - Скинуть рассписание определенного дня и месяца
        /para - Скинуть следующую пару
	`);
});

vk.updates.hear('/mem', async (context) => {
    let ret;

    api.wall.get({
        domain: "q_qvazar"
    }).then(value => {
        console.dir(value)
    }).catch(e => {
        throw e;
    });
    await context.send('mem');
});

vk.updates.hear('/cat', async (context) => {
    await Promise.all([
        context.sendPhoto('https://loremflickr.com/1280/719/')
    ]);
});

vk.updates.hear(['/time', '/date'], async (context) => {
    var dat = new Date();
    context.send(dat.getHours() + ":" + dat.getMinutes() + ":" + dat.getSeconds() + "\n" + dat.getDate() + "." + (dat.getMonth() + 1) + "." + dat.getFullYear());
});
vk.updates.hear(/^\/para/i, async (context) => {
    let dat = new Date(),
        hour,
        min,
        para,
        com = context.text.split(" ");

    if (com.length > 1) {
        hour = Number(com[1]);
        min = Number(com[2]);
    } else {
        hour = dat.getHours();
        min = dat.getMinutes();
    }

    if (hour >= 0 && hour < 8) {
        para = 1;
    } else if (hour >= 8 && hour <= 9) {
        if (hour == 9 && min >= 40) {
            para = 3;
        } else {
            para = 2;

        }
    } else if (hour >= 10 && hour <= 11) {
        if ((hour == 11 && min >= 40)) {
            para = 4;
        } else {
            para = 3;

        }
    } else if (hour >= 12 && hour <= 13) {
        if (hour == 13 && min >= 30) {
            para = 5;
        } else {
            para = 4;

        }
    } else if (hour >= 14 && hour <= 15) {
        if (hour >= 15 && min >= 10) {
            para = 6;
        } else {
            para = 5;

        }
    } else if (hour == 16) {
        if (hour >= 16 && min >= 50) {
            para = "S";
        } else {
            para = 6;
        }
    } else if (hour >= 17) {
        if (hour <= 18 && min >= 20) {
            para = "S";
        } else {
            para = "Poz";
        }
    }

    dat.setHours(0, 0, 0, 0);
    if (para == "Poz") {
        context.send("Поздно для пар уже");
    } else if (para == "S") {
        context.send("Это последняя пара");
    } else {
        db.all('SELECT l' + para + ' FROM LESSONS WHERE DATE=?', dat, function (err, rows) {
            if (err) {
                context.send(err.message)
            } else {

                if (rows[0]["l" + para] || rows[0]["l" + para] != "Null") {
                    context.send(para + ":" + rows[0]["l" + para])
                } else {
                    context.send("Пара не установлена")
                }

            }
        })
    }
});

vk.updates.hear(/^\/reverse (.+)/i, async (context) => {
    await context.send(
        context.$match[1].split('').reverse().join('')
    );

});

vk.updates.hear(/^\/ras/i, async (context) => {

    let com = context.text.split(" ");
    let date = new Date();
    date.setHours(0, 0, 0, 0);
    switch (com.length) {
        case 1:
            getRasp(date).then((value) => {
                context.send(value)
            });

            break;

        case 2:
            if (com[1].toUpperCase() == "NEXT") {

                date.setDate(date.getDate() + 1);

                getRasp(date).then((value) => {
                    context.send(value);
                });
            } else if (com[1].toUpperCase() == "IMG") {
                context.sendPhoto(rasp)
            } else {
                let newDate = com[1].split("."),
                    day = newDate[0],
                    month = newDate[1] - 1 || new Date().getMonth(),
                    year = newDate[2] || new Date().getFullYear();


                date = new Date(year, month, day);
                date.setHours(0, 0, 0, 0);
                getRasp(date).then((value) => {
                    context.send(value)
                });
            }
            break;
        case 3: {
            date.setFullYear(new Date().getFullYear(), com[2] - 1, com[1]);
            getRasp(date).then((value) => {
                context.send(value);
            });
            break;
        }
        default:
            await context.send("Неверное количество параметров");
    }

});

vk.updates.hear(/^\/about/i, async (context) => {


    context.send("Bot for schedule 17-VT-1 by @id161830362 (fenK) ")

});
vk.updates.hear(/^\/imp/i, async (context) => {
    let oFile = fs.readFileSync('oFile.txt', 'utf-8');
    context.send(oFile);

});
vk.updates.hear(/^\/simp/i, async (context) => {
    await context.scene.enter('OVS');

});

vk.updates.hear(/^\/kek/i, async (context) => {

    if (context.attachments.length == 0) {
        if (context.senderType == "user")
            context.send('\/' + "kek Фото");

    } else {
        rasp = context.attachments[0].largePhoto;

        context.send("Фото установено")
    }
});
let day, month, year;
//file = JSON.parse(fs.readFileSync('schedule.json', 'utf-8'))
sceneManager.addScene(new StepScene('upr', [
    (context) => {
        let com = context.text.split(" ");

        if (com[0] == "/upr") {
            switch (com.length) {
                case 1:
                    month = new Date().getMonth() + 1;
                    day = new Date().getDate();
                    year = new Date().getFullYear();
                    break;

                case 2:
                    if (com[1].toUpperCase() == "NEXT") {
                        let dat = new Date();
                        dat.setDate(dat.getDate() + 1);
                        month = dat.getMonth() + 1;
                        day = dat.getDate();
                        year = dat.getFullYear();

                    } else {
                        let newDate = com[1].split(".");
                        day = +newDate[0];
                        month = +newDate[1] || Number(new Date().getMonth()) + 1;
                        year = +newDate[2] || new Date().getFullYear();
                    }
                    break;
                case 3:
                    day = +com[1];
                    month = +com[2];
                    year = new Date().getFullYear();
                    break;
                case 4:
                    day = +com[1];
                    month = +com[2];
                    year = +com[3];
                    break;
            }
            month = Number(month);
            day = Number(day);
            year = Number(year);
            context.send("day:" + day + "\n" + "month:" + month + "\n" + "year:" + year);

            if (inInterval(month, "m") && inInterval(day, "d")) {
                return context.send('Введите данные');
            } else {
                context.scene.leave();
            }
        }

        return context.scene.step.next();
    },

    async (context) => {
        if (inInterval(month, "m") && inInterval(day, "d")) {
            let temp = context.text.split(" ");

            temp = temp.map(function (val) {
                if (!val || val.toUpperCase() == 'Щ') {
                    return null
                } else {
                    return val;
                }
            });
            for (let i = 0; i < 6; i++) {
                if (!temp[i]) {
                    temp[i] = null
                }
            }


            let date = new Date();
            date.setFullYear(year, month - 1, day);

            date.setHours(0, 0, 0, 0);

            db.all('SELECT * FROM LESSONS WHERE DATE=?', date, function (err, rows) {
                if (err) {
                    console.log(err.message);
                    return;
                }
                let sql;
                if (rows.length > 0) {
                    sql = `UPDATE LESSONS SET l1=?,l2=?,l3=?,l4=?,l5=?,l6=? WHERE date=?`;
                } else {
                    sql = `INSERT INTO LESSONS(l1,l2,l3,l4,l5,l6,date) VALUES (?,?,?,?,?,?,?)`;
                }
                db.run(sql, temp[0], temp[1], temp[2], temp[3], temp[4], temp[5], date, function (err) {
                    if (err) {
                        console.log(err.message);
                    }
                });

            });


            /* for (var i = 1; i <= 6; i++) {
                 temp[i]=[];
                 if (i <= iz.length) {
                     temp[month][day][i.toString()] = iz[i - 1]
                 } else
                     file[month][day][i.toString()] = "Null"
             }*/
            //fs.writeFileSync('schedule.json', JSON.stringify(file, null, 2));
            //file = JSON.parse(fs.readFileSync('schedule.json', 'utf-8'))
            context.send("Рассписание установлено");
            await context.scene.leave();
        }
    }
]));
sceneManager.addScene(new StepScene('OVS', [
    (context) => {
        let com = context.text.split(" ");

        if (com[0] == "/simp") {
            return context.send('Введите данные');
        }
        return context.scene.step.next();
    },

    async (context) => {

        let con = context.text.split(" "),
            str = "";

        for (let i = 0; i < con.length; i++) {
            str += con[i] + " ";
        }

        fs.writeFileSync('oFile.txt', str);

        context.send("Сообщение установлено");
        await context.scene.leave();
    }

]));


vk.updates.on('message', sessionManager.middleware);
vk.updates.on('message', sceneManager.middleware);
vk.updates.on('message', sceneManager.middlewareIntercept);

vk.updates.hear(/^\/upr/i, async (context) => {
    if (context.senderId == 161830362 || context.senderId == 259251175 || context.senderId == 503131193) {
        await context.scene.enter('upr');
    } else {
        await context.send("Тоби суда нельзя");
    }

});


vk.updates.start().catch(console.error);


function getRasp(date) {
    return new Promise((resolve, reject) => {
        if (isNaN(date.getTime())) {
            resolve("Что-то пошло не так");
        } else {

            if (date.getDay() == 0) {
                resolve("Воскресенье, нет пар");
                return
            }

            db.all('SELECT l1,l2,l3,l4,l5,l6, date FROM LESSONS WHERE DATE=?', date, function (err, rows) {
                if (err) {
                    console.log(err.message);
                    reject(err.message)
                }

                let temp = '';
                if (rows.length > 0) {
                    for (let i = 1; i <= 6; i++) {
                        if (rows[0]["l" + i] && rows[0]["l" + i] != "Null")
                            temp += (i + ":" + rows[0]["l" + i] + "\n");
                    }
                }

                if (temp == "") {
                    resolve("На этот день еще нет рассписания");
                }


                let time = "Рассписание на " + date.toLocaleString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    timeZoneName: 'short'
                }).replace(/,.GMT\+6/, "") + "\n";
                resolve(time + temp);
            });
        }


    });

}

function inInterval(value, p) {
    return (value >= 1 && value <= 12 && p == "m") || (value >= 1 && value <= 31 && p == "d");
}
