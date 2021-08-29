import discordRest from '@discordjs/rest';
const { REST } = discordRest;

import dotenv from 'dotenv';
dotenv.config();

import { Routes } from 'discord-api-types/v9';
import { SlashCommandBuilder } from '@discordjs/builders';

const commands = [];

// Place your client and guild ids here
const guildId = '744874959905751091';
const clientId = '880907521198551101';

const data = new SlashCommandBuilder()
	.setName('bonus-please')
	.setDescription('Helps you get some bonus points!')
	// .addStringOption(option =>
	// 	option.setName('category')
	// 		.setDescription('The gif category')
	// 		.setRequired(true)
	// 		.addChoice('Funny', 'gif_funny')
	// 		.addChoice('Meme', 'gif_meme')
    //   .addChoice('Movie', 'gif_movie'));

const data1 = new SlashCommandBuilder()
	.setName('not-a-clue')
	.setDescription("Clues are everywhere but I'm not one of them!");
// .addStringOption(option =>
// 	option.setName('category')
// 		.setDescription('The gif category')
// 		.setRequired(true)
// 		.addChoice('Funny', 'gif_funny')
// 		.addChoice('Meme', 'gif_meme')
//   .addChoice('Movie', 'gif_movie'));

commands.push(data.toJSON());
commands.push(data1.toJSON());

const rest = new REST({ version: '9' }).setToken(process.env.DJSTOKEN);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();
