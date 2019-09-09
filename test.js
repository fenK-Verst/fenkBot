var fs = require("fs");
var file = JSON.parse(fs.readFileSync('schedule.json', 'utf-8'))
const { VK } = require('vk-io');
//http://test-site1022.oml.ru/#access_token=9f930072c89dedc30ecc756615f6d9c4864a8a66660cc08b9cfe7b9d3e6111b8b4e7c56deed5bd983c90e&expires_in=86400&user_id=503131193&state=123456
const vk = new VK({
    token: "9f930072c89dedc30ecc756615f6d9c4864a8a66660cc08b9cfe7b9d3e6111b8b4e7c56deed5bd983c90e",
    appId: "7120878"
});
const { api } = vk;
var dat = new Date();
//console.log (dat.getHours());
//console.log (dat.getMinutes());
var hour = dat.getHours();
var min = dat.getMinutes();
hour=15;
min=00;
var pub = ["ovnocode", "tnull"]
console.log (pub[0])
var params = {
    "domain": "ovnocode",
    "count":1,
    "offset": randomInteger(1, 188)
}
/* api.wall.get(params).then(result =>{
     console.dir(result);
     if (typeof result.items[0].attachments[0].photo == "object")
     console.dir(result.items[0].attachments[0].photo.sizes[result.items[0].attachments[0].photo.sizes.length-1].url);
    fs.writeFileSync("file.json",JSON.stringify(result))
} );*/



file = JSON.parse(fs.readFileSync('file.json', 'utf-8'))
let rand = randomInteger(1,100)
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