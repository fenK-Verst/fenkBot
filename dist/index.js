"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bot_1 = require("./Bot");
const bot = new Bot_1.default();
bot
    .init()
    .then(() => {
    console.log(`Bot was started`);
})
    .catch(e => {
    console.error(e);
    process.exit(-1);
});
//# sourceMappingURL=index.js.map