var fs = require("fs");

const { VK } = require('vk-io');
//http://test-site1022.oml.ru/#access_token=9f930072c89dedc30ecc756615f6d9c4864a8a66660cc08b9cfe7b9d3e6111b8b4e7c56deed5bd983c90e&expires_in=86400&user_id=503131193&state=123456
/*const vk = new VK({
    token: "9f930072c89dedc30ecc756615f6d9c4864a8a66660cc08b9cfe7b9d3e6111b8b4e7c56deed5bd983c90e",
    appId: "7120878"
});
const { api } = vk;
*/
const sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('schedule.db');

/*db.run('CREATE TABLE LESSONS(date,week,l1,l2,l3,l4,l5,l6)',(e)=>{
    console.log(e)
});*/


// 


var a = [];
a[1]={
    "1":"Null",
    "2":"ОМТ",
    "3": "Мат.Стат",
    "4": "Чис.Мет",
    "5":"Null",
    "6": "Null"
}
a[2] = {
    "1": "Null",
    "2": "Инж.Графика",
    "3": "Политология",
    "4": "ОМТ",
    "5": "Чис.Мет",
    "6": "Null"
}
a[3] = {
    "1": "Null",
    "2": "Политология",
    "3": "Физ-ра",
    "4": "ОМТ/Мат.Стат",
    "5": "Null",
    "6": "Null"
}
a[4] = {
    "1": "Сети",
    "2": "Мат.Стат",
    "3": "ОС",
    "4": "Null",
    "5": "Null",
    "6": "Null"
}
a[5] = {
    "1": "Чис.Мет",
    "2": "Сети",
    "3": "ОМТ",
    "4": "Мат.Стат",
    "5": "Null",
    "6": "Null"
}
a[6] = {
    "1": "Null",
    "2": "Null",
    "3": "Инж.Графика",
    "4": "ОС/Сети",
    "5": "Физ-ра",
    "6": "Null"
}
a[0] = {
    "1": "Null",
    "2": "Null",
    "3": "Null",
    "4": "Null",
    "5": "Null",
    "6": "Null"
}
let d1 = new Date(1575655200000);
let d2 = new Date(1573063200000);
console.log(d1);
console.log(d2)
/*db.run('DELETE FROM Lessons', [], (err, rows) => {
    if (err) {
       console.log(err.message);
    }
})*/
/*db.run('DROP TABLE LESSONS', [], (err, rows) => {
        if (err) {
            throw err;
        }
        console.log(err, rows)
    });*/
let nowDate = new Date();
nowDate.setHours(0, 0, 0, 0);
// nowDate.setFullYear(new Date().getFullYear(), new Date().getMonth(), 17+1);

/*for (var i = 1; i <= 12; i++) {
    for (var j = 1; j <= 31; j++) {
        var data = new Date(2019, i - 1, j);
        let b = a[data.getDay()][1]
        
        db.run(`INSERT INTO LESSONS(date,l1,l2,l3,l4,l5,l6)VALUES (?,?,?,?,?,?,?)`, data, a[data.getDay()][1], a[data.getDay()][2], a[data.getDay()][3], a[data.getDay()][4], a[data.getDay()][5], a[data.getDay()][6] , function (err) {
            if (err) {
                return console.log(err.message);
            }
            console.log(`A row has been inserted with rowid ${this.lastID}`);
        });
    }

}*/

/*db.all('SELECT L1,l2,l3,l4,l5,l6,DATE FROM LESSONS WHERE DATE=?', nowDate, (err, rows) => {
    if (err) {
        console.log(err.message)
    }
    console.table(rows)
});*/

/*db.all('SELECT lessons,date FROM LESSONS', [], (err, rows) => {
    if (err) {
        throw err;
    }
    console.table(rows);
    
});*/

/*for (var i = 1; i <= 12; i++) {
    for (var j = 1; j <= 31; j++) {
        var data = new Date(2019, i - 1, j)
        //console.log(data.getDate())
        console.log(data.getDay())
        console.dir(data.toDateString())
        file[i][j]={}
        file[i][j] = a[data.getDay()]
        /*if (file[i][j]) {
            if (data.getWeek() % 2) {
                file[i][j].week = "Н"
            } else {
                file[i][j].week = "Ч"
            }
        }*/
        /*console.dir(file[i][j])

    }
}
fs.writeFileSync("schedule.json", JSON.stringify(file))
let rand = randomInteger(1,100)*/
//console.dir(file.items[rand].attachments[0].photo.sizes[file.items[rand].attachments[0].photo.sizes.length-1].url);


function inInterval(value) {
    if (value >= 1 && value <= 12) {
        return true;
    } else {
        return false;
    }
}
//console.log(inInterval('ыв'))

/*if (hour >0  &&  hour <8 ){
  console.log(file[dat.getMonth()][dat.getDate()])
}else if (hour >=8 && hour <=9){
    if (hour == 9 && min>=30){
        console.log(file[dat.getMonth()+1][dat.getDate()]["3"])
    }else{
        console.log(file[dat.getMonth()+1][dat.getDate()]["2"])
       
    }
}else if (hour>=10 && hour <=11){
    if ( (hour == 11 && min >= 10) ) {
        console.log(file[dat.getMonth() + 1][dat.getDate()]["4"])
    } else {
        console.log(file[dat.getMonth() + 1][dat.getDate()]["3"])

    }
} else if (hour >= 12 && hour <= 13) {
    if (hour == 13 && min >= 10) {
        console.log(file[dat.getMonth() + 1][dat.getDate()]["5"])
    } else {
        console.log(file[dat.getMonth() + 1][dat.getDate()]["4"])

    }
} else if (hour >= 14 && hour <= 15 ) {
    if (hour == 15 && min>=10) {
        console.log(file[dat.getMonth() + 1][dat.getDate()]["6"])
    } else {
        console.log(file[dat.getMonth() + 1][dat.getDate()]["5"])

    }
} else if (hour >= 18 ) {
    if (hour == 18 && min < 10) {
        console.log(file[dat.getMonth() + 1][dat.getDate()]["6"])
    } else {
        console.log("Поздно уже для пар то")

    }
}*/function randomInteger(min, max) {
    // получить случайное число от (min-0.5) до (max+0.5)
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}
Date.prototype.getWeek = function () {
    var date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}