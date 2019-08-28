//"06f5e9828503a3d5b72a08a3d556d799eafebd8c505c08fe048d366a582aef205e89ccc9159e0fe58a91d"
//id 185873386

const { VK } = require('vk-io');

const vk = new VK({
    token: "06f5e9828503a3d5b72a08a3d556d799eafebd8c505c08fe048d366a582aef205e89ccc9159e0fe58a91d"
});

vk.updates.hear('/start', async (context) => {
    await context.send(`
		My commands list
		/cat - Cat photo
		/purr - Cat purring
		/time - The current date
		/reverse - Reverse text
	`);
});

vk.updates.hear('/cat', async (context) => {
    await Promise.all([
        context.send('Wait for the uploads awesome 😻'),

        context.sendPhoto('https://loremflickr.com/400/300/')
    ]);
});

vk.updates.hear(['/time', '/date'], async (context) => {
    await context.send(String(new Date()));
});

vk.updates.hear(/^\/reverse (.+)/i, async (context) => {
    await context.send(
        context.$match[1].split('').reverse().join('')
    );
});

const catsPurring = [
    'http://ronsen.org/purrfectsounds/purrs/trip.mp3',
    'http://ronsen.org/purrfectsounds/purrs/maja.mp3',
    'http://ronsen.org/purrfectsounds/purrs/chicken.mp3'
];

vk.updates.hear('/purr', async (context) => {
    const link = catsPurring[Math.floor(Math.random() * catsPurring.length)];

    await Promise.all([
        context.send('Wait for the uploads purring 😻'),

        context.sendAudioMessage(link)
    ]);
});

vk.updates.hear(/^\/uch/i, async (context) => {
   
    await context.send(
        context.send(context.attachments[0].largePhoto)
    );
});

vk.updates.start().catch(console.error);