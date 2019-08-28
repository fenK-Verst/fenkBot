 var fs = require("fs");
// /* fs.writeFileSync('users.json', JSON.stringify(file, null, 2));
// file = JSON.parse(fs.readFileSync('users.json', 'utf-8')) */

 Date.prototype.daysInMonth = function () {
     return 32 - new Date(this.getFullYear(), this.getMonth(), 32).getDate();
 };

// var file={}
// for (var i=1;i<=12;i++){
//     file[i]={}
//     var dat = new Date(2019, i-1);
//     console.log(dat.daysInMonth() )
//     for (var j = 1; j <= dat.daysInMonth(); j++) {
//         file[i][j]={}
        
//         for (var k = 1; k <= 6; k++) {
//             file[i][j][k]="Null"
//           //  console.log(k)
            
           
//         }
//     }
// } 
// // file = JSON.parse(fs.readFileSync('schedule.json', 'utf-8')) 
// // console.dir(file["1"]["1"]["2"])
// fs.writeFileSync('schedule.json', JSON.stringify(file))
const { VK } = require('vk-io');

const { SessionManager } = require('@vk-io/session');
const { SceneManager, StepScene } = require('@vk-io/scenes');

const vk = new VK({
    token: "06f5e9828503a3d5b72a08a3d556d799eafebd8c505c08fe048d366a582aef205e89ccc9159e0fe58a91d"
});

const sessionManager = new SessionManager();
const sceneManager = new SceneManager();

sceneManager.addScene(new StepScene('signup', [
    (context) => {
        if (context.scene.step.firstTime || !context.text) {
            return context.send('What\'s your name?');
        }

        context.scene.state.firstName = context.text;

        return context.scene.step.next();
    },
    (context) => {
        if (context.scene.step.firstTime || !context.text) {
            return context.send('How old are you?');
        }

        context.scene.state.age = Number(context.text);

        return context.scene.step.next();
    },
    async (context) => {
        const { firstName, age } = context.scene.state;

        await context.send(`👤 ${firstName} ${age} ages`);

        await context.scene.leave();
    }
]));
var day, month;
file = JSON.parse(fs.readFileSync('schedule.json', 'utf-8'))
sceneManager.addScene(new StepScene('upr', [
    (context) => {
        var com = context.text.split(" ");
       
        
       
        if (com.length<=3 && com[0]=="/upr" ) {
            switch (com.length) {
                case 1:
                   month=new Date().getMonth();
                    day = new Date().getDate();
                    break;

                case 2: if (com[1].toUpperCase() == "NEXT") {
                    var dat = new Date();
                    dat.setDate(dat.getDate() + 1)
                  
                    month = dat.getMonth();
                    day = dat.getDate();
                }else{
                   
                    month = new Date().getMonth();
                    day = com[1];
                }
                    break;
                case 3: 
                    month = com[2]
                    day = com[1];
                break;
               
            }
            return context.send('Введите данные');
        }

        return context.scene.step.next();
    },

    async (context) => {
       

        await context.send(JSON.stringify(context));
        console.log(day);
        console.log (month)
        console.log("\n")
        var iz = context.text.split(" ");
        for (var i = 1;i<=iz.length;i++){
            file[month][day][i.toString()]=iz[i-1]
        }
        fs.writeFileSync('schedule.json', JSON.stringify(file, null, 2));
        file = JSON.parse(fs.readFileSync('schedule.json', 'utf-8')) 
   
        await context.scene.leave();
    }
]));



vk.updates.on('message', sessionManager.middleware);
vk.updates.on('message', sceneManager.middleware);
vk.updates.on('message', sceneManager.middlewareIntercept);

vk.updates.hear(/^\/upr/i, async (context) => {
    await context.scene.enter('upr');
});
vk.updates.start().catch(console.error);