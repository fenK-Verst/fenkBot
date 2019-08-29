var fs = require("fs");
var file = JSON.parse(fs.readFileSync('schedule.json', 'utf-8'))
var dat = new Date();
//console.log (dat.getHours());
//console.log (dat.getMinutes());
var hour = dat.getHours();
var min = dat.getMinutes();
hour=15;
min=00;




if (hour >0  &&  hour <8 ){
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
}