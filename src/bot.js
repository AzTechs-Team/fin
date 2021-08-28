// Require the necessary discord.js classes
import {Client, Intents } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});

client.once('ready', async()=> {
    console.log('Ready');
});

client.login(process.env.DJSTOKEN);
