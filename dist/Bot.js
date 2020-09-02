"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import {VK} from 'vk-io';
const vk_io_1 = require("vk-io");
const fs = require("fs");
const session_1 = require("@vk-io/session");
const scenes_1 = require("@vk-io/scenes");
const hear_1 = require("@vk-io/hear");
require('dotenv').config();
const sessionManager = new session_1.SessionManager(), sceneManager = new scenes_1.SceneManager(), hearManager = new hear_1.HearManager();
const Bot = class {
    constructor() {
        this.init = async () => {
            const token = process.env.TOKEN;
            this.vk = new vk_io_1.VK({ token: token });
            this.initHandlers();
            this.initScenes();
            this.vk.updates
                .start()
                .catch(e => { throw e; });
        };
        this.initHandlers = () => {
            const { vk } = this;
            vk.updates.on('message_new', sessionManager.middleware);
            vk.updates.on('message_new', sceneManager.middleware);
            vk.updates.on('message_new', hearManager.middleware);
            vk.updates.on('message_new', sceneManager.middlewareIntercept); // Default scene entry handler
            hearManager.hear(/^\/simp/i, async (context) => {
                console.log(context);
                await context.scene.enter('OVS');
            });
        };
        this.initScenes = () => {
            // sceneManager.addScene(new StepScene('upr', [
            //     (context: any) => {
            //         let com = context.text.split(" ");
            //
            //         if (com[0] == "/upr") {
            //             switch (com.length) {
            //                 case 1:
            //                     month = new Date().getMonth() + 1;
            //                     day = new Date().getDate();
            //                     year = new Date().getFullYear();
            //                     break;
            //
            //                 case 2:
            //                     if (com[1].toUpperCase() == "NEXT") {
            //                         let dat = new Date();
            //                         dat.setDate(dat.getDate() + 1);
            //                         month = dat.getMonth() + 1;
            //                         day = dat.getDate();
            //                         year = dat.getFullYear();
            //
            //                     } else {
            //                         let newDate = com[1].split(".");
            //                         day = +newDate[0];
            //                         month = +newDate[1] || Number(new Date().getMonth()) + 1;
            //                         year = +newDate[2] || new Date().getFullYear();
            //                     }
            //                     break;
            //                 case 3:
            //                     day = +com[1];
            //                     month = +com[2];
            //                     year = new Date().getFullYear();
            //                     break;
            //                 case 4:
            //                     day = +com[1];
            //                     month = +com[2];
            //                     year = +com[3];
            //                     break;
            //             }
            //             month = Number(month);
            //             day = Number(day);
            //             year = Number(year);
            //             context.send("day:" + day + "\n" + "month:" + month + "\n" + "year:" + year);
            //
            //             if (inInterval(month, "m") && inInterval(day, "d")) {
            //                 return context.send('Введите данные');
            //             } else {
            //                 context.scene.leave();
            //             }
            //         }
            //
            //         return context.scene.step.next();
            //     },
            //
            //     async (context: any) => {
            //         if (inInterval(month, "m") && inInterval(day, "d")) {
            //             let temp = context.text.split(" ");
            //
            //             temp = temp.map(function (val: string) {
            //                 if (!val || val.toUpperCase() == 'Щ') {
            //                     return null
            //                 } else {
            //                     return val;
            //                 }
            //             });
            //             for (let i = 0; i < 6; i++) {
            //                 if (!temp[i]) {
            //                     temp[i] = null
            //                 }
            //             }
            //
            //             let date = new Date();
            //             // @ts-ignore
            //             date.setFullYear(year, month - 1, day);
            //
            //             date.setHours(0, 0, 0, 0);
            //
            //             // @ts-ignore
            //             date = date.getSqlite();
            //             db.all('SELECT * FROM lessons WHERE date=?', date, function (err: any, rows: any) {
            //                 if (err) {
            //                     console.log(err.message);
            //                     return;
            //                 }
            //                 let sql;
            //                 if (rows.length > 0) {
            //                     sql = `UPDATE lessons SET l1=?,l2=?,l3=?,l4=?,l5=?,l6=? WHERE date=?`;
            //                 } else {
            //                     sql = `INSERT INTO lessons(l1,l2,l3,l4,l5,l6,date) VALUES (?,?,?,?,?,?,?)`;
            //                 }
            //                 db.run(sql, temp[0], temp[1], temp[2], temp[3], temp[4], temp[5], date, function (err: any) {
            //                     if (err) {
            //                         console.log(err.message);
            //                     }
            //                 });
            //
            //             });
            //
            //             context.send("Рассписание установлено");
            //             await context.scene.leave();
            //         }
            //     }
            // ]));
            // sceneManager.addScene(new StepScene('dz', [
            //     (context: any) => {
            //         let com = context.text.split(" ");
            //
            //         if (com[0] == "/dz") {
            //             switch (com.length) {
            //                 case 1:
            //                     month = new Date().getMonth() + 1;
            //                     day = new Date().getDate();
            //                     year = new Date().getFullYear();
            //                     break;
            //
            //                 case 2:
            //                     if (com[1].toUpperCase() == "NEXT") {
            //                         let dat = new Date();
            //                         dat.setDate(dat.getDate() + 1);
            //                         month = dat.getMonth() + 1;
            //                         day = dat.getDate();
            //                         year = dat.getFullYear();
            //
            //                     } else {
            //                         let newDate = com[1].split(".");
            //                         day = +newDate[0];
            //                         month = +newDate[1] || Number(new Date().getMonth()) + 1;
            //                         year = +newDate[2] || new Date().getFullYear();
            //                     }
            //                     break;
            //                 case 3:
            //                     day = +com[1];
            //                     month = +com[2];
            //                     year = new Date().getFullYear();
            //                     break;
            //                 case 4:
            //                     day = +com[1];
            //                     month = +com[2];
            //                     year = +com[3];
            //                     break;
            //             }
            //             month = Number(month);
            //             day = Number(day);
            //             year = Number(year);
            //             context.send("day:" + day + "\n" + "month:" + month + "\n" + "year:" + year);
            //
            //             if (inInterval(month, "m") && inInterval(day, "d")) {
            //                 return context.send('Введите данные');
            //             } else {
            //                 context.scene.leave();
            //             }
            //         }
            //
            //         return context.scene.step.next();
            //     },
            //
            //     async (context: any) => {
            //         if (inInterval(month, "m") && inInterval(day, "d")) {
            //             let dz = context.text;
            //
            //             let date = new Date();
            //             // @ts-ignore
            //             date.setFullYear(year, month - 1, day);
            //
            //             date.setHours(0, 0, 0, 0);
            //             // @ts-ignore
            //             date = date.getSqlite();
            //             db.all('SELECT * FROM lessons WHERE date=?', date, function (err: any, rows: any) {
            //                 if (err) {
            //                     console.log(err.message);
            //                     return;
            //                 }
            //                 let sql;
            //                 if (rows.length > 0) {
            //                     sql = `UPDATE lessons SET dz=? WHERE date=?`;
            //                 } else {
            //                     sql = `INSERT INTO lessons(dz,date) VALUES (?,?)`;
            //                 }
            //                 db.run(sql, dz, date, function (err: any) {
            //                     if (err) {
            //                         console.log(err.message);
            //                     }
            //                 });
            //
            //             });
            //             context.send("Дз установлено");
            //             await context.scene.leave();
            //         }
            //     }
            // ]));
            sceneManager.addScenes([
                new scenes_1.StepScene('OVS', [
                    async (context) => {
                        let com = context.text.split(" ");
                        if (com[0] == "/simp") {
                            return context.send('Введите данные');
                        }
                        return context.scene.step.next();
                    },
                    async (context) => {
                        let con = context.text.split(" "), str = "";
                        for (let i = 0; i < con.length; i++) {
                            str += con[i] + " ";
                        }
                        fs.writeFileSync('oFile.txt', str);
                        context.send("Сообщение установлено");
                        await context.scene.leave();
                    }
                ]),
            ]);
        };
    }
};
exports.default = Bot;
//# sourceMappingURL=Bot.js.map