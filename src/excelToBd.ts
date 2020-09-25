import parseXlsx from 'excel';
import SqDatabase from "./Db";
const db = new SqDatabase();
// @ts-ignore
Date.prototype.getWeek = function () {
    let onejan = new Date(this.getFullYear(), 0, 1);
    // @ts-ignore
    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
};
// @ts-ignore
Date.prototype.getSqlite = function () {
    let month: string | number = this.getMonth() + 1;
    if (month.toString().length == 1) month = "0" + String(month);
    return `${this.getFullYear()}-${month}-${this.getDate()}`;
};
parseXlsx('outer/schedule.xlsx').then((parsed) => {
   const data = [];
   parsed.forEach(e => {
       const arr = e.filter((d,i) => {
           if (i > 13){
               return !!d;
           }
           return true;
       });
      data.push(arr);
   });
   let index = 0;
   const da = [];
   while (data[index][0].length){
       // console.log(data[index]);
       const lessons = [];
       const d = data[index];
       const date = new Date(Date.parse(d[0]));
       // console.log(date);
       lessons.push(date);
        for (let i=1;i<d.length-1;i+=2){
                let str = ``;
                if (d[i].length){
                    str+=d[i].trim();
                }
                if (d[i].length && d[i+1]){
                    str+=" / ";
                }
                if (d[i+1]){
                    str+=d[i+1].trim();
                }
                str = str.replace(/17вт1/i, '').replace(/МПиЗП/i, 'Моделирование').trim();
                lessons.push(str);
        }

       index++;
       da.push(lessons);
   }

   // console.log(da);
   da.forEach(e => {
       let date = e[0],
           l1=e[1],
           l2=e[2],
           l3=e[3],
           l4=e[4],
           l5=e[5],
           l6=e[6];


       const lessonsRaw = {l1,l2,l3,l4,l5,l6},
            lessons = JSON.stringify(lessonsRaw);


       date.setHours(0, 0, 0, 0);

       // @ts-ignore
       date = date.getSqlite();
       db
           .all('SELECT * FROM lessons WHERE date=?', [date])
           .then((rows) => {

               let sql;
               if (rows.length > 0) {
                   sql = `UPDATE lessons SET lessons=? WHERE date=?`;
               } else {
                   sql = `INSERT INTO lessons(lessons,date) VALUES (?,?)`;
               }
               return db
                   .run(sql, [lessons, date])
                   .catch((err: any) => {
                       throw err;
                   });

           })
           .catch(e => {
               console.log(e.message);
           })
           .then(() => {
               // console.log("Рассписание установлено");
           })
   })
}).catch(e => {
    console.error(e);
});