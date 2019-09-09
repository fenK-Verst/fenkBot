//"06f5e9828503a3d5b72a08a3d556d799eafebd8c505c08fe048d366a582aef205e89ccc9159e0fe58a91d"
//id 185873386
var fs = require("fs");
const { VK } = require('vk-io');

const vk = new VK({
    token: "06f5e9828503a3d5b72a08a3d556d799eafebd8c505c08fe048d366a582aef205e89ccc9159e0fe58a91d"
});
var rasp = "https://sun9-3.userapi.com/c846122/v846122093/d6776/NqM_20zkAbM.jpg"


// var TelegramBot = require('node-telegram-bot-api'); // Устанавливаем токен, который выдавал нам бот
// var token = '917044014:AAEWZIEZOgjGmYnXjscYRMYFda259a88Tx8'; // Включить опрос сервера. Бот должен обращаться к серверу Telegram, чтобы получать актуальную информацию 
// var bot = new TelegramBot(token, { polling: true });



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
    var para;
    //bot.sendMessage("518054807", "hour:" + hour + "\n" + "min:" + min);


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


    // bot.sendMessage("518054807", para);


    if (para == "Poz") {
        context.send("Поздно для пар уже");
    } else if (para == "S") {
        context.send("Это последняя пара");
    } else if (file[dat.getMonth() + 1][dat.getDate()][String(para)].toUpperCase() != "NULL" && file[dat.getMonth() + 1][dat.getDate()][String(para)].toUpperCase() != "Щ") {
        context.send(para + ":" + file[dat.getMonth() + 1][dat.getDate()][String(para)])
    } else {
        context.send("Пары нет/рассписание не установлено")
    }
});

vk.updates.hear(/^\/reverse (.+)/i, async (context) => {
    await context.send(
        context.$match[1].split('').reverse().join('')
    );
});

vk.updates.hear(/^\/ras/i, async (context) => {
    var com = context.text.split(" ");

    file = JSON.parse(fs.readFileSync('schedule.json', 'utf-8'))
    switch (com.length) {
        case 1:
            context.send(getRasp(file[new Date().getMonth() + 1][new Date().getDate()], new Date().getMonth() + 1, new Date().getDate()))
            break;

        case 2: if (com[1].toUpperCase() == "NEXT") {
            var dat = new Date();
            dat.setDate(dat.getDate() + 1)
            context.send(getRasp(file[dat.getMonth() + 1][dat.getDate()], dat.getMonth() + 1, dat.getDate()))
        } else if (com[1].toUpperCase() == "IMG") {
            context.sendPhoto(rasp)
        }
        else
            context.send(getRasp(file[new Date().getMonth() + 1][com[1]], new Date().getMonth() + 1, com[1])); break;
        case 3: context.send(getRasp(file[com[2]][com[1]], com[2], com[1])); break;
        default: context.send("Неверное количество параметров");
    }

});

vk.updates.hear(/^\/about/i, async (context) => {

   
    context.send("Bot for schedule 17-VT-1 by @id161830362 (fenK) ")
    
});
vk.updates.hear(/^\/imp/i, async (context) => {
    var oFile = fs.readFileSync('oFile.txt', 'utf-8');
    context.send(oFile);

});
vk.updates.hear(/^\/simp/i, async (context) => {
    
    
    await context.scene.enter('OVS');

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
                    month = new Date().getMonth() + 1;
                    day = new Date().getDate();
                    break;

                case 2: if (com[1].toUpperCase() == "NEXT") {
                    var dat = new Date();
                    dat.setDate(dat.getDate() + 1)

                    month = dat.getMonth() + 1;
                    day = dat.getDate();
                } else {

                    month = new Date().getMonth() + 1;
                    day = com[1];
                }
                    break;
                case 3:
                    day = com[1];
                    month = com[2];

                    break;

            }
            //context.send("day:"+day+"\n"+"month:"+month)

            if (inInterval(month, "m") && inInterval(day, "d")) {
                return context.send('Введите данные');
            }

            else {
                context.scene.leave();
            }
        }

        return context.scene.step.next();
    },

    async (context) => {

        // console.log(day);
        // console.log(month)
        // console.log("\n")
        var iz = context.text.split(" ");

        if (inInterval(month, "m") && inInterval(day, "d")) {
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
    }
]));
sceneManager.addScene(new StepScene('OVS', [
    (context) => {
        var com = context.text.split(" ");



        if (com[0] == "/simp") {
            return context.send('Введите данные');
        }
        return context.scene.step.next();
    },

    async (context) => {

        var con = context.text.split(" ");
        var str = "";
        for (var i = 0; i < con.length; i++) {
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
    await context.scene.enter('upr');
});




vk.updates.start().catch(console.error);



function getRasp(n,month,day) {
    var str = "Рассписание на "+day+"."+month+"\n"
    for (key in n) {

        if (n[key].toUpperCase() != "NULL" && n[key].toUpperCase() != "Щ") {

            str += key + ":" + n[key] + "\n"
        }
    }
    if (str == ("Рассписание на " + day + " " + month + "\n"))
        return ("На этот день еще нет рассписания")
    return (str);

}
function inInterval(value, p) {
    if ((value >= 1 && value <= 12 && p == "m") || (value >= 1 && value <= 31 && p == "d")) {
        return true;
    } else {
        return false;
    }
}
