import {MessageEmbed, MessageActionRow, MessageButton, Client, Intents} from "discord.js";
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});
import dotenv from 'dotenv';
dotenv.config();

client.once('ready', () => {
    console.log('The bot is ready lets go!');
});

const embed1 = new MessageEmbed()
    .setTitle("First Page")
    .setDescription("My First Dev.to Post");

const embed2 = new MessageEmbed()
    .setTitle("Second Page")
    .setDescription("The second page of my dev.to post");
const button1 = new MessageButton()
    .setCustomId("previousbtn")
    .setLabel("Previous")
    .setStyle("DANGER");

const button2 = new MessageButton()
    .setCustomId("nextbtn")
    .setLabel("Next")
    .setStyle("SUCCESS");

const pages = [
    embed1,
    embed2
]

const buttonList = [button1, button2];


client.on('messageCreate', async (message) => {
    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('primary')
                .setLabel('Primary')
                .setStyle('PRIMARY'),
        );
    if(message.content == '!start') {
        // console.log(embed1);
        message.channel.send({ content: 'asd', components: [row]});
        // paginationEmbed(message, pages, buttonList, 10000);
    }
})

client.login(process.env.DJSTOKEN);