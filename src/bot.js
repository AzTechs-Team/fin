import { Client, Intents } from 'discord.js';

import dotenv from 'dotenv';
dotenv.config();

import { gamePlay } from './Game.js';
import { disabledBtn } from './buttonComponent.js';
import { clues } from './clues.js';

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});

client.once('ready', () => {
  console.log('The bot is ready lets go!');
});

client.on('interactionCreate', async interaction => {

    let duration = 4000;
    let currentTimeStamp = new Date().getTime();

    if (interaction.isButton()) {
        const filter = i => i.customId === 'Clue 1';
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: duration });
        
        let row_ = disabledBtn('btn2', 'Swim away :D');
        interaction.reply({ content: clues[interaction.customId] });
        
        collector.on('collect', async i => {
            if (i.customId === 'Clue 1') {
                console.log(i);
            }
            console.log('collect');
        });

        collector.on('end', collected => {
            console.log(`Collected ${collected.size} items`)
            interaction.message.edit({components:[row_]})
        });
    }
});

client.on('messageCreate', async(message) => {
    if (message.author.bot) return;
    if(message.content.startsWith('~')){
        switch(message.content){
            case "~start": {
                let newPlayer = new gamePlay(message);
                await newPlayer.makeRole();
                await newPlayer.createCategory('ggs');
                newPlayer.createChannel();
                newPlayer.hideAndSeek();
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

client.login(process.env.TOKEN);
