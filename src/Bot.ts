// import {VK} from 'vk-io';
import {MessageContext, VK} from "vk-io";
import * as fs from 'fs';
import {SessionManager} from '@vk-io/session';
import {SceneManager, StepScene} from '@vk-io/scenes';
import {HearManager} from '@vk-io/hear';
import SqDatabase from "./Db";

let month: number,
    day: number,
    year: number;
require('dotenv').config();
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

export type SchoolDay = {
    date: Date
    lessons: Lessons | string
    homework: string
}

export type Message = {
    regexp: RegExp;
    func: (context: MessageContext) => void;
}

export type Lessons = {
    l1: string
    l2: string
    l3: string
    l4: string
    l5: string
    l6: string
}
const Bot = class {

    private weekSeparator: string = `|`;
    private allowedUsers = [161830362, 259251175, 503131193, 262742265];
    private vk: VK | undefined;
    private db: SqDatabase;
    private hearManager: HearManager<MessageContext>;
    private sessionManager: SessionManager<{}>;
    private sceneManager: SceneManager;
    private scenes: StepScene[] = [
        new StepScene('OVS', [
            async (context) => {
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
        ]),
        new StepScene('upr', [
            async (context: any) => {
                let com = context.text.split(" ");


                if (com[0] != "/upr") {
                    return context.scene.step.next();
                }
                const args = this.ras.parseArguments(com);
                day = args.day;
                year = args.year;
                month = args.month;
                context.send("day:" + day + "\n" + "month:" + month + "\n" + "year:" + year);

                if (this.inInterval(month, "m") && this.inInterval(day, "d")) {
                    return context.send('Введите данные');
                }
                return context.scene.leave();
            },

            async (context: any) => {
                let lessonsRaw = context.text.split(" ");
                lessonsRaw = lessonsRaw.map((val: string) => {
                    if (!val || val.toUpperCase() == 'Щ') {
                        return null
                    }
                    return val;

                });
                let lessonsArray: Lessons = {l1: "", l2: "", l3: "", l4: "", l5: "", l6: ""};
                lessonsRaw.forEach((lesson, i) => {
                    const index = `l${i + 1}`;
                    lessonsArray[index] = lesson
                });
                const lessons = JSON.stringify(lessonsArray);
                let date = new Date();
                date.setFullYear(year, month - 1, day);

                date.setHours(0, 0, 0, 0);

                // @ts-ignore
                date = date.getSqlite();
                this.db
                    .all('SELECT * FROM lessons WHERE date=?', [date])
                    .then((rows) => {

                        let sql;
                        if (rows.length > 0) {
                            sql = `UPDATE lessons SET lessons=? WHERE date=?`;
                        } else {
                            sql = `INSERT INTO lessons(lessons,date) VALUES (?,?)`;
                        }
                        return this.db
                            .run(sql, [lessons, date])
                            .catch((err: any) => {
                                throw err;
                            });

                    })
                    .catch(e => {
                        context.send(e.message);
                    })
                    .then(() => {
                        context.send("Рассписание установлено");
                    })


                await context.scene.leave();

            }
        ]),
        new StepScene('dz', [
            (context: any) => {
                let com = context.text.split(" ");

                if (com[0] != "/dz") {
                    return context.scene.step.next();
                }
                const args = this.ras.parseArguments(com);
                day = args.day;
                year = args.year;
                month = args.month;


                context.send("day:" + day + "\n" + "month:" + month + "\n" + "year:" + year);

                if (this.inInterval(month, "m") && this.inInterval(day, "d")) {
                    return context.send('Введите данные');
                }
                context.send('Invalid date');
                context.scene.leave();


            },

            async (context: any) => {
                    let dz = context.text;
                    if (dz.toLowerCase() == 'щ') dz = null;
                    let date = new Date();
                    // @ts-ignore
                    date.setFullYear(year, month - 1, day);

                    date.setHours(0, 0, 0, 0);
                    // @ts-ignore
                    date = date.getSqlite();
                    this.db.all('SELECT * FROM lessons WHERE date=?', [date]).then((rows)=> {
                        let sql;
                        if (rows.length > 0) {
                            sql = `UPDATE lessons SET homework=? WHERE date=?`;
                        } else {
                            sql = `INSERT INTO lessons(homework,date) VALUES (?,?)`;
                        }

                        this.db.run(sql, [dz,date]).catch((err: any) =>  {
                            context.send(err.message);
                        });

                    }).catch(e => context.send(e)).then(() => context.send("Дз установлено"));

                    await context.scene.leave();
                }

        ]),
    ];
    private schedulePhoto: string = `https://sun2.beeline-kz.userapi.com/u4ir5sOHZ2s5zi6suVA_ALkst3a2MtP55JJqrQ/6MP9dIqWD5g.jpg`;

    private messageHandlers = {
        help: async (context: MessageContext) => {
            const text = `My commands list
                        /cat - Фото котика
                        /time - Показать дату
                        /reverse - Reverse text
                        /ras - Скинуть рассписание на сегодня
                        /ras next - Скинуть рассписание на завтра
                        /ras img - Скинуть рассписание в виде картинки
                        /ras <день> - Скинуть рассписание определенного дня
                        /ras <день> <месяц> - Скинуть рассписание определенного дня и месяца
                        /para - Скинуть следующую пару
                    `;
            await context.send(text);
        },
        cat: async (context: MessageContext) => {
            await context.sendPhotos(
                [
                    {value: 'https://loremflickr.com/1280/719/'}
                ],
            )
        },
        time: async (context: MessageContext) => {
            const dat = new Date();
            await context.send(dat.getHours() + ":" + dat.getMinutes() + ":" + dat.getSeconds() + "\n" + dat.getDate() + "." + (dat.getMonth() + 1) + "." + dat.getFullYear());
        },
        schedule: async (context: MessageContext) => {
            let com = context.text.split(" ");
            let date = new Date();
            date.setHours(0, 0, 0, 0);
            switch (com.length) {
                case 1:
                    this.getSchedule(date).then(async (value) => {
                        await context.send(value)
                    });
                    break;

                case 2:
                    if (com[1].toLowerCase() == "next") {

                        date.setDate(date.getDate() + 1);

                        this.getSchedule(date).then((value) => {
                            context.send(value);
                        });
                    } else if (com[1].toUpperCase() == "IMG") {
                        await context.sendPhotos(
                            [
                                {value: this.schedulePhoto}
                            ],
                        )
                    } else {
                        let newDate = com[1].split('.'),
                            day = +newDate[0],
                            month = +newDate[1] - 1 || new Date().getMonth(),
                            year = +newDate[2] || new Date().getFullYear();

                        date = new Date(year, month, day);
                        date.setHours(0, 0, 0, 0);

                        this.getSchedule(date).then((value) => {
                            context.send(value);
                        });
                    }
                    break;
                case 3: {
                    date.setFullYear(new Date().getFullYear(), +com[2] - 1, +com[1]);
                    this.getSchedule(date).then((value) => {
                        context.send(value);
                    });
                    break;
                }
                default:
                    await context.send("Неверное количество параметров");
            }
        },
        para: async (context: MessageContext) => {
            let dat = new Date(),
                hour,
                min,
                para: string | number = ``,
                com = context.text.split(" ");

            if (com.length > 1) {
                hour = Number(com[1]);
                min = Number(com[2]);
            } else {
                hour = dat.getHours();
                min = dat.getMinutes();
            }
            const intervals = []
            intervals["9:00:00"] = "10:30:00";
            intervals["10:40:00"] = "12:10:00";
            intervals["12:20:00"] = "13:50:00";
            intervals["14:00:00"] = "15:30:00";
            intervals["15:40:00"] = "17:10:00";
            intervals["17:20:00"] = "18:50:00";
            for (const i in intervals) {
                console.log(intervals[i], i);
            }
            return;
            const rez = this.checkTime('10:00:00', '10:22:00');

            dat.setHours(0, 0, 0, 0);
            //@ts-ignore
            dat = dat.getSqlite();
            if (para == "Poz") {
                await context.send("Поздно для пар уже");
            } else if (para == "Last") {
                await context.send("Это последняя пара");
            } else {
                this.db
                    .all('SELECT lessons FROM lessons WHERE date=?', [dat])
                    .then(async (rows) => {
                        const row: SchoolDay = rows[0],
                            lessons = row?.lessons;
                        if (lessons) {
                            const lesson = lessons["l" + para] || null;
                            await context.send(para + ":" + lesson);
                        } else {
                            await context.send("Пара не установлена");
                        }
                    })
                    .catch(e => {
                        context.send(e.message)
                    })
            }
        },
        setLessons: async (context: MessageContext) => {
            if (this.allowedUsers.includes(context.senderId)) {
                return await context.scene.enter('upr');
            }
            await context.send("Тоби суда нельзя");

        },
        setHomework: async (context: MessageContext) => {
            if (this.allowedUsers.includes(context.senderId)) {
                return await context.scene.enter('dz');
            }
            await context.send("Тоби суда нельзя");

        }
    }
    private messages: Message[] = [
        {
            regexp: /^\/(help|start)$/,
            func: this.messageHandlers.help
        },
        {
            regexp: /^\/cat$/,
            func: this.messageHandlers.cat
        },
        {
            regexp: /^\/(date|time)$/,
            func: this.messageHandlers.time
        },
        {
            regexp: /^\/ras/,
            func: this.messageHandlers.schedule
        },
        {
            regexp: /^\/para/,
            func: this.messageHandlers.para,
        },
        {
            regexp: /^\/upr/,
            func: this.messageHandlers.setLessons,
        },
        {
            regexp: /^\/dz/,
            func: this.messageHandlers.setHomework,
        },
    ]


    private init = {
        messages: () => {
            const {hearManager} = this;
            this.messages.forEach((message: Message) => {
                hearManager.hear(message.regexp, message.func);
            })

        },
        handlers: () => {
            const {vk, sceneManager, hearManager, sessionManager} = this;
            vk.updates.on('message_new', sessionManager.middleware);
            vk.updates.on('message_new', sceneManager.middleware);
            vk.updates.on('message_new', hearManager.middleware);
            vk.updates.on('message_new', sceneManager.middlewareIntercept);

        },
        scenes: () => {
            this.sceneManager.addScenes(this.scenes);
        },
        state: () => {
            const token = process.env.TOKEN;
            this.vk = new VK({token: token});

            this.hearManager = new HearManager<MessageContext>();
            this.sessionManager = new SessionManager();
            this.sceneManager = new SceneManager();

            this.db = new SqDatabase();
        },
    }

    start = async () => {
        this.init.state();
        this.init.handlers();
        this.init.scenes();
        this.init.messages();

        this.vk.updates
            .start()
            .catch(e => {
                throw e
            });
    }


    getSchedule = async (date: Date) => {
        if (isNaN(date.getTime())) {
            throw "Неверно указано время";
        }

        if (date.getDay() == 0) {
            return "Воскресенье, нет пар";
        }

        const {db} = this;
        return db
            //@ts-ignore
            .all('SELECT * FROM lessons WHERE date=?', [date.getSqlite()])
            .then((rows) => {
                const row: SchoolDay = rows[0];
                if (rows.length == 0) {
                    return "На этот день еще нет рассписания";
                }
                const homework = row.homework;
                const lessons: Lessons | string = row.lessons;

                if (!(lessons || homework)){
                    return "На этот день еще нет рассписания";
                }

                return this.ras.getFormattedOutput(row);

            })
            .catch(e => {
                return e.message
            });
    }
    inInterval = (value: string | number, p: string): boolean => {
        return (value >= 1 && value <= 12 && p == "m") || (value >= 1 && value <= 31 && p == "d");
    };
    ras = {
        getFormattedOutput: (day: SchoolDay): string => {
            let messageText = `\n`;
            let {lessons, date, homework} = day;

            if (typeof lessons === "string") {
                lessons = JSON.parse(lessons);
            }
            for (let i = 1; i <= 6; i++) {
                const lesson = lessons["l" + i];
                if (lesson) {
                    messageText += (i + ":" + lesson + "\n");
                }
            }
            if (homework) {
                messageText += `\n\nДз на этот день:\n${homework}`
            }

            let week = "Неделя: ";
            date = new Date(date);
            // @ts-ignore
            week += date.getWeek() % 2 == 0 ? "Числитель" : "Знаменатель";
            week += `\n`;

            const formattedDate = date.toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timeZoneName: 'short',
            }).replace(/,.GMT\+6/, "") + "\n";
            const time = "Рассписание на " + formattedDate;
            return (week + time + messageText);
        },
        parseArguments: (args: string[]) => {
            let day, month, year;
            switch (args.length) {
                case 1:
                    month = new Date().getMonth() + 1;
                    day = new Date().getDate();
                    year = new Date().getFullYear();
                    break;

                case 2:
                    if (args[1].toUpperCase() == "NEXT") {
                        let dat = new Date();
                        dat.setDate(dat.getDate() + 1);
                        month = dat.getMonth() + 1;
                        day = dat.getDate();
                        year = dat.getFullYear();

                    } else {
                        let newDate = args[1].split(".");
                        day = newDate[0];
                        month = newDate[1] || Number(new Date().getMonth()) + 1;
                        year = newDate[2] || new Date().getFullYear();
                    }
                    break;
                case 3:
                    day = args[1];
                    month = args[2];
                    year = new Date().getFullYear();
                    break;
                case 4:
                    day = args[1];
                    month = args[2];
                    year = args[3];
                    break;
            }
            month = Number(month);
            day = Number(day);
            year = Number(year);

            return {day, month, year};
        }
    }
    checkTime = (beg: string, end: string): boolean => {
        let s = 60,
            d = ':',
            t = new Date,
            b = beg.split(d),
            e = end.split(d);
            // @ts-ignore
        b = b [0] * s * s + b [1] * s + +b [2];

            // @ts-ignore
        e = e [0] * s * s + e [1] * s + +e [2];

            const z = t.getHours() * s * s + t.getMinutes() * s + t.getSeconds();
        // @ts-ignore
        return (z >= b && z <= e);
    }


}
export default Bot;