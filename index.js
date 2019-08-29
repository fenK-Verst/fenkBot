//"06f5e9828503a3d5b72a08a3d556d799eafebd8c505c08fe048d366a582aef205e89ccc9159e0fe58a91d"
//id 185873386
var fs = require("fs");
const { VK } = require('vk-io');

const vk = new VK({
    token: "06f5e9828503a3d5b72a08a3d556d799eafebd8c505c08fe048d366a582aef205e89ccc9159e0fe58a91d"
});
var rasp = "https://sun9-3.userapi.com/c846122/v846122093/d6776/NqM_20zkAbM.jpg"

const { SessionManager } = require('@vk-io/session');
const { SceneManager, StepScene } = require('@vk-io/scenes');
const sessionManager = new SessionManager();
const sceneManager = new SceneManager();

/* fs.writeFileSync('users.json', JSON.stringify(file, null, 2));
file = JSON.parse(fs.readFileSync('users.json', 'utf-8')) */

file = JSON.parse(fs.readFileSync('schedule.json', 'utf-8'))
console.log()
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
	`);
});

vk.updates.hear('/cat', async (context) => {
    await Promise.all([
        context.send('Wait for the uploads awesome 😻'),

        context.sendPhoto('https://loremflickr.com/1280/719/')
    ]);
});

vk.updates.hear(['/time', '/date'], async (context) => {
    await context.send(String(new Date()));
});
vk.updates.hear(/^\/para/i, async (context) => {
    var dat = new Date();
    //console.log (dat.getHours());
    //console.log (dat.getMinutes());

    var com = context.text.split(" ");
    file = JSON.parse(fs.readFileSync('schedule.json', 'utf-8'))
    if (com.length > 1) {
        var hour = Number(com[1]);
        var min = Number(com[2]);
    } else {
        var hour = dat.getHours();
        var min = dat.getMinutes();

    }

    if (hour >= 0 && hour < 8) {
        context.send(file[dat.getMonth()][dat.getDate()])
    } else if (hour >= 8 && hour <= 9) {
        if (hour == 9 && min >= 30) {
            context.send(file[dat.getMonth() + 1][dat.getDate()]["3"])
        } else {
            context.send(file[dat.getMonth() + 1][dat.getDate()]["2"])

        }
    } else if (hour >= 10 && hour <= 11) {
        if ((hour == 11 && min >= 10)) {
            context.send(file[dat.getMonth() + 1][dat.getDate()]["4"])
        } else {
            context.send(file[dat.getMonth() + 1][dat.getDate()]["3"])

        }
    } else if (hour >= 12 && hour <= 13) {
        if (hour == 13 && min >= 10) {
            context.send(file[dat.getMonth() + 1][dat.getDate()]["5"])
        } else {
            context.send(file[dat.getMonth() + 1][dat.getDate()]["4"])

        }
    } else if (hour >= 14 && hour <= 15) {
        if (hour == 15 && min >= 10) {
            context.send(file[dat.getMonth() + 1][dat.getDate()]["6"])
        } else {
            context.send(file[dat.getMonth() + 1][dat.getDate()]["5"])

        }
    } else if (hour >= 18) {
        if (hour == 18 && min < 10) {
            context.send(file[dat.getMonth() + 1][dat.getDate()]["6"])
        } else {
            context.send("Поздно уже для пар то")

        }
    }
});

vk.updates.hear(/^\/reverse (.+)/i, async (context) => {
    await context.send(
        context.$match[1].split('').reverse().join('')
    );
});
vk.updates.hear(/^\/para (.+)/i, async (context) => {
    await context.send(
        context.$match[1].split('').reverse().join('')
    );
});

vk.updates.hear(/^\/ras/i, async (context) => {
    var com = context.text.split(" ");
    file = JSON.parse(fs.readFileSync('schedule.json', 'utf-8'))
    switch (com.length) {
        case 1:
            context.send(getRasp(file[new Date().getMonth()][new Date().getDate()]))
            break;

        case 2: if (com[1].toUpperCase() == "NEXT") {
            var dat = new Date();
            dat.setDate(dat.getDate() + 1)
            context.send(getRasp(file[dat.getMonth()][dat.getDate()]))
        } else if (com[1].toUpperCase() == "IMG") {
            context.sendPhoto(rasp)
        }
        else
            context.send(getRasp(file[new Date().getMonth()][com[1]])); break;
        case 3: context.send(getRasp(file[com[2]][com[1]])); break;
        default: context.send("Неверное количество параметров");
    }

});

vk.updates.hear(/^\/kek/i, async (context) => {

    if (context.attachments.length == 0) {
        if (context.senderType == "user")
            context.send('\/' + "kek Фото")

    } else {
        rasp = context.attachments[0].largePhoto;

        context.send("Фото установено")
    }
});

var day, month;
file = JSON.parse(fs.readFileSync('schedule.json', 'utf-8'))
sceneManager.addScene(new StepScene('upr', [
    (context) => {
        var com = context.text.split(" ");



        if (com[0] == "/upr") {
            switch (com.length) {
                case 1:
                    month = new Date().getMonth()+1;
                    day = new Date().getDate();
                    break;

                case 2: if (com[1].toUpperCase() == "NEXT") {
                    var dat = new Date();
                    dat.setDate(dat.getDate() + 1)

                    month = dat.getMonth()+1;
                    day = dat.getDate();
                } else {

                    month = new Date().getMonth()+1;
                    day = com[1];
                }
                    break;
                case 3:
                    month = com[2]
                    day = com[1];
                    break;

            }
            return context.send('Введите данные');
        }

        return context.scene.step.next();
    },

    async (context) => {

        // console.log(day);
        // console.log(month)
        // console.log("\n")
        var iz = context.text.split(" ");
        for (var i = 1; i <= 6; i++) {
            if (i <= iz.length) {
                file[month][day][i.toString()] = iz[i - 1]
            } else
                file[month][day][i.toString()] = "Null"
        }
        fs.writeFileSync('schedule.json', JSON.stringify(file, null, 2));
        file = JSON.parse(fs.readFileSync('schedule.json', 'utf-8'))
        context.send("Рассписание установлено");
        await context.scene.leave();
    }
]));



vk.updates.on('message', sessionManager.middleware);
vk.updates.on('message', sceneManager.middleware);
vk.updates.on('message', sceneManager.middlewareIntercept);

vk.updates.hear(/^\/upr/i, async (context) => {
    await context.scene.enter('upr');
});




vk.updates.start().catch(console.error);



function getRasp(n) {
    var str = ""
    for (key in n) {

        if (n[key].toUpperCase() != "NULL") {

            str += key + ":" + n[key] + "\n"
        }
    }
    if (str == "")
        return ("На этот день еще нет рассписания")
    return (str);

}