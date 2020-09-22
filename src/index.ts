import Bot from "./Bot";

const bot = new Bot();
bot
    .start()
    .then(() => {
        console.log(`Bot was started`);

    })
    .catch(e => {
        console.error(e);
        process.exit(-1);
    })