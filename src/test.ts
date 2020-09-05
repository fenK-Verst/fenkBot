import {Lessons} from "./Bot";
import SqDatabase from "./Db";

let defaultDate = new Date();

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

const lessonsArray: Lessons[] = [
    {
        l1: ``,
        l2: `Облачные вычисления`,
        l3: `Охрана труда`,
        l4: `Методы защиты информации`,
        l5: `Физ-ра`,
        l6: ``,
    },
    {
        l1: ``,
        l2: `Охрана трудая`,
        l3: `Моделирование`,
        l4: `Методы защиты информации`,
        l5: `WEB ПиИТ`,
        l6: ``,
    },
    {
        l1: ``,
        l2: ``,
        l3: `Экономика`,
        l4: `Методы защиты информации`,
        l5: `WEB ПиИТ`,
        l6: `Игры`,
    },
    {
        l1: `Моделирование`,
        l2: `Экономика`,
        l3: `Облачные вычисления`,
        l4: `Основы предпринимательской деятельности`,
        l5: ``,
        l6: ``,
    },
    {
        l1: ``,
        l2: `Игры/Охрана труда`,
        l3: `Облачные вычисления`,
        l4: `Основы предпринимательской деятельности`,
        l5: `Моделирование/WEB ПиИт`,
        l6: ``,
    },
];
const db = new SqDatabase();

for (let i = 0; i < 150; i++) {
    defaultDate = new Date(defaultDate.setDate(defaultDate.getDate() + 1));
    // @ts-ignore
    const date = defaultDate.getSqlite();
    let ls: Lessons | undefined | string = lessonsArray[defaultDate.getDay() - 1];
    // console.log(defaultDate.getSqlite() + ` `+ JSON.stringify(ls));
    const lessons = JSON.stringify(ls);
    db.all('SELECT * FROM lessons WHERE date=?', [date])
        .then((rows) => {

            let sql;
            if (rows.length > 0) {
                sql = `UPDATE lessons
                       SET lessons=?
                       WHERE date = ?`;
            } else {
                sql = `INSERT INTO lessons(lessons, date)
                       VALUES (?, ?)`;
            }
            // console.log(sql, rows);
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


}