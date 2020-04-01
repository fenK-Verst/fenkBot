
const fs = require("fs");
const {VK} = require('vk-io');
const TOKEN = JSON.parse(fs.readFileSync('data.json', 'utf-8')).token;
const vk = new VK({
    token: TOKEN
});
const {api} = vk;
let rasp = "https://sun9-3.userapi.com/c846122/v846122093/d6776/NqM_20zkAbM.jpg";
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('schedule.db');

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
        db.all('SELECT l' + para + ' FROM lessons WHERE date=?', dat, function (err, rows) {
            if (err) {
                context.send(err.message)
            } else {

                if (rows[0]["l" + para]) {
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

            date = date.getSqlite();
            db.all('SELECT * FROM lessons WHERE date=?', date, function (err, rows) {
                if (err) {
                    console.log(err.message);
                    return;
                }
                let sql;
                if (rows.length > 0) {
                    sql = `UPdate lessons SET l1=?,l2=?,l3=?,l4=?,l5=?,l6=? WHERE date=?`;
                } else {
                    sql = `INSERT INTO lessons(l1,l2,l3,l4,l5,l6,date) VALUES (?,?,?,?,?,?,?)`;
                }
                db.run(sql, temp[0], temp[1], temp[2], temp[3], temp[4], temp[5], date, function (err) {
                    if (err) {
                        console.log(err.message);
                    }
                });

            });

            context.send("Рассписание установлено");
            await context.scene.leave();
        }
    }
]));
sceneManager.addScene(new StepScene('dz', [
    (context) => {
        let com = context.text.split(" ");

        if (com[0] == "/dz") {
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
            let dz = context.text;

            let date = new Date();
            date.setFullYear(year, month - 1, day);

            date.setHours(0, 0, 0, 0);
            date = date.getSqlite();
            db.all('SELECT * FROM lessons WHERE date=?', date, function (err, rows) {
                if (err) {
                    console.log(err.message);
                    return;
                }
                let sql;
                if (rows.length > 0) {
                    sql = `UPDATE lessons SET dz=? WHERE date=?`;
                } else {
                    sql = `INSERT INTO lessons(dz,date) VALUES (?,?)`;
                }
                db.run(sql, dz, date, function (err) {
                    if (err) {
                        console.log(err.message);
                    }
                });

            });
            context.send("Дз установлено");
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
    if ([161830362, 259251175, 503131193,262742265].includes(context.senderId)) {
        await context.scene.enter('upr');
    }else if ( [466733300].includes(context.senderId)){
        await context.send("Пашов нахуй");
    } else {
        await context.send("Тоби суда нельзя");
    }

});
vk.updates.hear(/^\/dz/i, async (context) => {
    if ([161830362, 259251175, 503131193,262742265].includes(context.senderId)) {
        await context.scene.enter('dz');
    }else if ( [466733300].includes(context.senderId)){
        await context.send("Пашов нахуй");
    } else {
        await context.send("Тоби суда нельзя");
    }


});
vk.updates.hear("/ex", async (context) => {
    const fetch = require('node-fetch');

    let link = context.attachments[0].url;
    // link = new URL(link);

    fetch(link)
        .then(res => {

            res.buffer().then(b => {
                fs.open(`rasp.xlsx`, 'w', function (err, fd) {
                    if (err) {
                        throw 'could not open file: ' + err;
                    }

                    // write the contents of the buffer, from position 0 to the end, to the file descriptor returned in opening our file
                    fs.write(fd, b, 0, b.length, null, function (err) {
                        if (err) throw 'error writing file: ' + err;
                        fs.close(fd, function () {
                            let exceltojson = require("xlsx-to-json-lc");
                            exceltojson({
                                input: "rasp.xlsx",
                                output: "123.json",
                                lowerCaseHeaders: true //to convert all excel headers to lowr case in json
                            }, async (err, result) => {
                                if (err) {
                                    console.error(err);
                                } else {
                                    // console.log(result);

                                    let n = [];
                                    result.forEach((value, index) => {
                                        let date = value.date,
                                            day = value.day,
                                            l1 = value["1"] || null,
                                            l12 = value["11"] || null,
                                            l2 = value["2"] || null,
                                            l21 = value["21"] || null,
                                            l3 = value["3"] || null,
                                            l4 = value["4"] || null,
                                            l5 = value["5"] || null,
                                            l6 = value["6"] || null;

                                        l12 = l12 ? " : " + l12 : '';
                                        l21 = l21 ? " : " + l21 : '';

                                        l1 = l1 ? l1 + l12 : null;
                                        l2 = l2 ? l2 + l21 : null;

                                        n.push({
                                            l1: l1,
                                            l2: l2,
                                            l3: l3,
                                            l4: l4,
                                            l5: l5,
                                            l6: l6,
                                            date: date
                                        });
                                    });
                                    db.run("DELETE FROM lessons");
                                    n.forEach((value, index) => {
                                        // console.log(index);
                                        let l1 = value.l1,
                                            l2 = value.l2,
                                            l3 = value.l3,
                                            l4 = value.l4,
                                            l5 = value.l5,
                                            l6 = value.l6,
                                            date = value.date;
                                        if (date) {
                                            date = date.split("/");

                                            date = new Date( (+date[2]), date[1] - 1, date[0]);

                                            date.setHours(0, 0, 0, 0);

                                            date = date.getSqlite();
                                            db.run(`INSERT INTO lessons(date,l1,l2,l3,l4,l5,l6)VALUES (?,?,?,?,?,?,?)`, [date, l1, l2, l3, l4, l5, l6], function (err) {
                                                if (err) {
                                                    return console.log(err.message);
                                                }
                                                console.log(`A row has been inserted with rowid ${this.lastID}`);
                                            });
                                        }
                                    });
                                    await context.send("done");

                                }
                            });

                        });
                    });
                });
            });

        })
        .catch(async (e) => {
            await context.send(e);
        })
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
            date = date.getSqlite();
            db.all('SELECT l1,l2,l3,l4,l5,l6,dz, date FROM lessons WHERE date=?', date, function (err, rows) {
                if (err) {
                    console.log(err.message);
                    reject(err.message)
                }

                let temp = '';
                if (rows.length > 0) {
                    for (let i = 1; i <= 6; i++) {
                        if (rows[0]["l" + i])
                            temp += (i + ":" + rows[0]["l" + i] + "\n");
                    }
                    if (rows[0]["dz"]) {
                        temp += `\n\nДз на этот день:\n
                                ${rows[0]["dz"]}`
                    }
                } else {
                    resolve("На этот день еще нет рассписания");
                    return;
                }

                let week = new Date(rows[0].date).getWeek() % 2 == 0 ? "Неделя: Числитель\n" : "Неделя: Знаменатель\n";
                let time = "Рассписание на " + date.toLocaleString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    timeZoneName: 'short'
                }).replace(/,.GMT\+6/, "") + "\n";
                resolve(week + time + temp);
            });
        }


    });

}

function inInterval(value, p) {
    return (value >= 1 && value <= 12 && p == "m") || (value >= 1 && value <= 31 && p == "d");
}

Date.prototype.getWeek = function () {
    let onejan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
};
Date.prototype.getSqlite = function () {
    let month = this.getMonth()+1;
    if (month.toString().length == 1) month = "0"+String(month);
    return `${this.getFullYear()}-${month}-${this.getDate()}`;
};
