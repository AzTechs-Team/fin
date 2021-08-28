// Require the necessary discord.js classes
import { Client, Intents } from 'discord.js';

import dotenv from 'dotenv';
import giphyApi from 'giphy-api';
dotenv.config();

const gh = giphyApi(process.env.API);

import { query } from '../DB/query.js';

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});

class StartWithChannel {
    constructor(message){
        this.msg = message;
        this.channelNames = ["Coral Reefs", "Oil Spills", "Tides", "Plastic Wastes", "Schools Of Fish", "Sea Floor"];
    }

    async createCategory(categoryName){
        this.categoryName = categoryName;
        let newCategory = await this.msg.guild.channels.create(this.categoryName, {type: 'GUILD_CATEGORY'});
        this.Player = await newCategory;

        this.query = await query(`INSERT INTO players VALUES('${this.msg.author.id}','${this.msg.author.username}',0,0);`);
        if (this.query == false) {
            this.msg.channel.send('Oops! Could not start the game. Try again!');
        }
    }

    createChannel(){
        let channels = [];
        this.channelNames.forEach(async (channel) => {
            let channel_ = await this.msg.guild.channels.create(channel, {parent: this.Player});
            channels.push(channel_);
        });
        this.channels = channels;
    }

    async randomGifSpam() {
        const res = await gh.random({
            tag: 'shark cute',
            rating: 'g',
            fmt: 'json',
            limit: 1
        });
        const randNum = Math.floor(Math.random() * 6);
        this.channels[randNum].send(res.data.embed_url);
    }

    hideAndSeek() {
        setInterval(() => {
            this.randomGifSpam();
        }, 2500);
    }
}

client.once('ready', () => {
  console.log('The bot is ready lets go!');
});

client.on('messageCreate', async(message) => {
    if (message.author.bot) return;
    if(message.content.startsWith('~')){
        switch(message.content){
            case "~start": {
                let newPlayer = new StartWithChannel(message);
                await newPlayer.createCategory('ggs');
                newPlayer.createChannel();
                newPlayer.hideAndSeek();
                // let newCategory = await message.guild.channels.create('demoCategory', {type: 'GUILD_CATEGORY'});
                // channelNames.forEach(channel => {
                    
                // })                
                // console.log(newCategory);
            }
            break;
        }
    }
})

// client.on('messageCreate', async(message) => {
//     if (message.author.bot) return;
//     if(await message.content.startsWith('~')){
//         let commands = new Commands(message)
//         commands.switcher();
//     }
// })
// class Commands{
//     static switcher(){
//         console.log(await this.command);
//         switch(this.command){
//             case "~start": {
//                 console.log('here!');
//             }
//             break;
//         }
//     } 
// }

client.login(process.env.DJSTOKEN);