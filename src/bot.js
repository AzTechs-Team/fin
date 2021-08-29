import { Client, Intents } from 'discord.js';

import dotenv from 'dotenv';
dotenv.config();

import { gamePlay } from './Game.js';
import { disabledBtn } from './buttonComponent.js';
import { clues } from './clues.js';
import { slides } from './kewl/slides.js';

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS]
});

client.once('ready', () => {
  console.log('The bot is ready lets go!');
});

let allPlayers = [];

client.on('interactionCreate', async interaction => {

    let duration = 4000;
    // let currentTimeStamp = new Date().getTime();

    if (interaction.isButton()) {
        const filter = i => Object.keys(clues).includes(i.customId);
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: duration });
        
        let row_ = disabledBtn('btn2', 'Swim away :D');
        interaction.reply({ content: clues[interaction.customId] });

        collector.on('end', collected => {
            console.log(interaction.user.id);
            interaction.message.edit({ components: [row_] });
            allPlayers.forEach(element => {
                if (element.id === interaction.user.id) {
                    console.log(element.cluesFound);
                    element.foundAClue(interaction.customId);
                }
            });
        });
    }
});

client.on('messageCreate', async(message) => {
    if (message.author.bot) return;
    if(message.content.startsWith('!')){
        switch(message.content){
            case "!start": {
                let newPlayer = new gamePlay(message);
                allPlayers.push(newPlayer);

                newPlayer.startPPT();

                client.on('messageReactionAdd', async (reaction, user) => {
                    const { name } = reaction.emoji;
                    if (user.bot) return;
                    if (user.id === newPlayer.id) {
                        switch (name) {
                            case '◀️':
                                await reaction.users.remove(user);
                                newPlayer.pptCounter = newPlayer.pptCounter - 1;
                                newPlayer.pptCounter = newPlayer.pptCounter < 0 ? 0 : newPlayer.pptCounter;
                                pptSwitcher(newPlayer.pptCounter, newPlayer.ppt);
                                break;
                            case '▶️':
                                await reaction.users.remove(user);
                                newPlayer.pptCounter = newPlayer.pptCounter + 1;
                                newPlayer.pptCounter = newPlayer.pptCounter > 12 ? 12 : newPlayer.pptCounter;
                                pptSwitcher(newPlayer.pptCounter, newPlayer.ppt);
                                break;
                        }
                        if (newPlayer.pptCounter === slides.length - 1) {
                            await newPlayer.ppt.reactions.removeAll()
                            await newPlayer.makeRole();
                            await newPlayer.createCategory('ggs');
                            newPlayer.createChannel();
                            newPlayer.findYourWayHome();
                        }
                    }
                });
            }
            break;
        }
    }
})

const pptSwitcher = async (i, message) => {
    await message.edit(slides[i]);
};

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
