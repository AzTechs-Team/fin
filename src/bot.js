import { Client, Intents } from 'discord.js';

import dotenv from 'dotenv';
dotenv.config();

import { gamePlay } from './Game.js';

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});

client.once('ready', () => {
  console.log('The bot is ready lets go!');
});

client.on('interactionCreate', async interaction => {
    // if (!interaction.isCommand()) return;

    if (interaction.isButton()) {
        await interaction.reply({ content: `hellooooo ${interaction.customId}` });
        return;
    }
	// if (interaction.commandName === 'ping') {
    //     let row = btn('btn1', 'Gottcha!');
    //     let row_ = disabledBtn('btn2', 'Swim away :D');
    //     await interaction.reply({ content: 'Clue', components: [row] });
        
    //     const filter = i => i.customId === 'btn1';

    //     const collector = interaction.channel.createMessageComponentCollector({ filter, time: 10000 });

    //     collector.on('collect', async i => {
    //         if (i.customId === 'btn1') {
    //             await i.reply({ content: 'A button was clicked!', components: [] });
    //         }
    //     });

    //     collector.on('end', collected => {
    //         console.log(`Collected ${collected.size} items`)
    //         interaction.editReply({components: [row_]});
    //     });
    // }
});

client.on('messageCreate', async(message) => {
    if (message.author.bot) return;
    if(message.content.startsWith('~')){
        switch(message.content){
            case "~start": {
                let newPlayer = new gamePlay(message);
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

client.login(process.env.DJSTOKEN);
