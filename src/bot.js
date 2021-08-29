import {Client, Intents, MessageSelectMenu, MessageActionRow, MessageEmbed} from 'discord.js';

import dotenv from 'dotenv';
dotenv.config();

import { gamePlay } from './game.js';
import { btn, disabledBtn } from './buttonComponent.js';
import { clues } from './info.js';
import { slides } from './kewl/slides.js';
import { quiz } from './quiz.js';

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

    if (interaction.isButton() && interaction.customId==='Clue 1') {
        const filter = i => i.customId === 'Clue 1';
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: duration });
        
        let row_ = disabledBtn('btn2', 'Swim away :D');
        interaction.reply({ content: clues[interaction.customId] });

        collector.on('end', collected => {
            console.log(interaction.user.id);
            interaction.message.edit({ components: [row_] });
            allPlayers.forEach(element => {
                if (element.id === interaction.user.id) {
                    element.foundAClue(interaction.customId);
                }
            });
        });
    }
});

client.on('interactionCreate', async interaction => {
    // Empty Command!
    if(interaction.isButton() && interaction.customId === "Clue 4") {
        console.log(interaction.customId);
        allPlayers.forEach(element => {
            if (element.id === interaction.user.id) {
                element.foundAClue(interaction.customId);
            }
        });
        await interaction.reply({content: clues['Clue 5']});
        let threadChat = await interaction.channel.threads.create({
            name: 'food-talk',
            autoArchiveDuration: 60,
            reason: 'Needed a separate thread for food',
        });
        console.log(threadChat.id);
        let counter = 0;
        client.on("messageCreate", async message => {
            if(message.author.bot) return;
            gamePlay.chat(counter, threadChat);
            counter++;
            
            if (counter === 5) {
                allPlayers.forEach(element => {
                    if (element.id === interaction.user.id) {
                        element.foundAClue(interaction.customId);
                    }
                });
            }
        })
    }

    else if (interaction.isButton() && interaction.customId == "Clue 3") {
        allPlayers.forEach(element => {
            if (element.id === interaction.user.id) {
                element.foundAClue('Clue 3');
            }
        });

        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('select')
                    .setPlaceholder('Nothing selected')
                    .addOptions([
                        {
                            label: 'fin',
                            description: 'This is a description',
                            value: 'first_option',
                        },
                        {
                            label: 'fin',
                            description: 'This is also a description',
                            value: 'second_option',
                        },
                    ]),
            );
        await interaction.reply({ content: 'Lets go!', components: [row] });
    }
        
    else if(interaction.isSelectMenu()){
        if(interaction.values[0] == "first_option") {
            quiz(interaction.message);
        }
        if (interaction.values[0] == "second_option") {
            quiz(interaction.message);
        }

        setTimeout(() => {
            if (interaction.values[0] == "first_option") {
                let row = btn('Clue 4', 'Clue 4');
                interaction.message.edit({ content: clues['Clue 4'], components: [row] });

                allPlayers.forEach(element => {
                    if (element.id === interaction.user.id) {
                        element.foundAClue('Clue 4');
                    }
                });

            }
            else {
                // let row = disabledBtn('Clue 4', 'Clue 4');
                interaction.message.edit({ content: 'oops! bad luck. Try again' });
            }
        }, 10000);
    }
    else if(interaction.isCommand()){
        // console.log(interaction.commandName);
        switch(interaction.commandName) {
            // bait
            case "bonus-please": {
                await interaction.deferReply();
                setTimeout(async function (){
                    await interaction.editReply('lmao bruh XD');
                }, 7000)
            }
            break;
            // actually clue
            case "not-a-clue": {
                // let row = btn('btn4', 'Gottach :D');
                // await interaction.reply({ content: clues['Clue 2'], components: [row] });
                allPlayers.forEach(element => {
                    console.log(element.id)
                    if (element.id === interaction.user.id) {
                        element.foundAClue('Clue 2');
                        element.triggerNextClue();
                    }
                    console.log(element.cluesFound)
                });
                let embed = new MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('Clue 2')
                    .setDescription(clues['Clue 2']);
                await interaction.reply({ embeds: [embed] });

            }
            break;
        }
    }
})

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
                            newPlayer.dmInstructions();
                            await newPlayer.makeRole();
                            await newPlayer.createCategory('ggs');
                            newPlayer.createChannel();
                            setTimeout(() => {
                                newPlayer.findYourWayHome();
                            }, 6000);
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

client.login(process.env.TOKEN);
