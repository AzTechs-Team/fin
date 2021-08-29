import {Client, Intents, MessageSelectMenu, MessageActionRow, MessageEmbed} from 'discord.js';

import dotenv from 'dotenv';
dotenv.config();

import { gamePlay } from './Game.js';
import { btn, disabledBtn } from './buttonComponent.js';
import { clues } from './info.js';
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

client.on('interactionCreate', async interaction => {
    // Empty Command!
    if(interaction.isButton() && interaction.customId == "btn3") {
        console.log(interaction.customId);
        await interaction.reply({content: 'Threads are the best way to have a conversation!'});
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
            counter ++;
        })
    }
    else if(interaction.isButton() && interaction.customId == "btn4"){

        // const selectRow = new MessageActionRow()
        //     .addComponents(new MessageSelectMenu()
        //         .setCustomId('quiz')
        //         .setPlaceholder('Select the right one!')
        //         .addOptions[(
        //             {
        //                 label: "Select me",
        //                 description: "Obviously this is correct!",
        //                 valueOf: "one"
        //             },
        //             {
        //                 label: "Select me",
        //                 description: "Obviously this is correct!",
        //                 valueOf: "two"
        //             },
        //             {
        //                 label: "Select me",
        //                 description: "Obviously this is correct!",
        //                 valueOf: "three"
        //             }
        //         )]
        //     );
        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('select')
                    .setPlaceholder('Nothing selected')
                    .addOptions([
                        {
                            label: 'Select me',
                            description: 'This is a description',
                            value: 'first_option',
                        },
                        {
                            label: 'You can select me too',
                            description: 'This is also a description',
                            value: 'second_option',
                        },
                    ]),
            );

        await interaction.reply({ content: 'Pong!', components: [row] });
        // const embed = new MessageEmbed()
        //     .setColor('#0099ff')
        //     .setTitle('Quize Time')
        //     .setDescription('Some description here');
        // console.log(interaction.customId);
        // await interaction.reply({content: 'ummm Quize Time!', embeds: [embed]});
        console.log('Quize Complete!');
    }
    else if(interaction.isSelectMenu()){
        console.log(interaction);
        if(interaction.values[0] == "first_option") {
            interaction.reply({content: '100 points to you <3'})
        }
    }
    else if(interaction.isCommand()){
        console.log(interaction.commandName);
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
                let row = btn('btn4', 'Swim away :D');
                await interaction.reply({content: 'This was the right answer! (what to do...)', components: [row]});
            }
            break;
        }
    }
})

client.on('messageCreate', async(message) => {
    if (message.author.bot) return;
    if(message.content.startsWith('~')){
        switch(message.content){
            case "~start": {
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

client.login(process.env.DJSTOKEN);
