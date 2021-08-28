import dotenv from "dotenv";
dotenv.config();
import { Client, Intents} from "discord.js";
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});

client.once('ready', () => {
    console.log('The bot is ready lets go!');
});

client.on("messageCreate", async (message) => {
    if(message.content == '!ded'){
        let guild = await message.guild;
        let spamChannels = await guild.channels.fetch();
        spamChannels.forEach(spamChannel => {
            if(spamChannel.name == 'ggs' || spamChannel.name == 'coral-reefs' || spamChannel.name == 'oil-spills' || spamChannel.name == 'tides' || spamChannel.name == 'plastic-wastes' || spamChannel.name == 'schools-of-fish'|| spamChannel.name == 'sea-floor'|| spamChannel.name == 'FUCK THIS SHIT')
            spamChannel.delete();
            console.log(`deleted ${spamChannel.name}!`);
        })
    }
})

client.login(process.env.DJSTOKEN);