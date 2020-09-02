import Bot from "./Bot";

const bot = new Bot();
bot
    .init()
    .then(() => {
        console.log(`Bot was started`);

    })
    .catch(e => {
        console.error(e);
        process.exit(-1);
    })