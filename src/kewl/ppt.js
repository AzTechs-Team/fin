import {Client, Intents, Message } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();
import { slides } from './slides.js';

console.log(slides.length);
const bot = new Client({intents: [Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS]});
const PREFIX = ".kys";

bot.once('ready', async()=> {
    console.log('Ready');
});

bot.on('messageCreate',async (message)=>{
    if (message.content.startsWith(PREFIX)){    
        console.log(slides.length);
        let message_ = await message.channel.send(slides[0]);
        await message_.react('◀️');
        await message_.react('▶️');
}
})

const switcher = async (i, message) => {
    try {
      switch (i) {
        case 0:
          console.log(i);
          await message.edit(slides[i]);
          break;
        case 1:
          console.log(i);
          await message.edit(slides[i]);
          break;
        case 2:
          await message.edit(slides[i]);
          break;
        case 3:
          console.log(i+100);
          await message.edit(slides[i]);
          break;
        case 4:
          await message.edit(slides[i]);
          break;
        case 5:
          await message.edit(slides[i]);
          break;
        case 6:
          await message.edit(slides[i]);
          break;
        case 7:
          await message.edit(slides[i])
          break;
        case 8:
          await message.edit(slides[i]);
          break;
        case 9:
          await message.edit(slides[i]);
          break;
        case 10:
          await message.edit(slides[i]);
          break;
        case 11:
          await message.edit(slides[i]);
          break;
      }
    } catch (error) {
      console.log(error);
    }
  };
  

let i = 0;
bot.on('messageReactionAdd',async (reaction,user)=>{
    const { name } = reaction.emoji;
    const message = reaction.message;
    const user_id = user.id;
    try {
        if (user.bot) return;
        console.log(user.id);
        if (user.id == user_id){
          switch (name) {
            case '◀️':
              await reaction.users.remove(user);
              i = i - 1;
              i = i < 0 ? 0 : i;
              console.log(i);
              switcher(i, message);
              break;
            case '▶️':
              await reaction.users.remove(user);
              i = i + 1;
              i = i > 11 ? 11 : i;
              console.log(i);
              switcher(i, message);
              break;
            
          }
        }
      } catch (error) {
        console.log(error);
      }
})


bot.on('messageReactionRemove', (reaction, user) => {
    const { name } = reaction.emoji;
    try {
      switch (name) {
        case '◀️':
          console.log('unclicked backward');
          break;
        case '▶️':
          console.log('unclicked forward');
          break;
      }
    } catch (error) {
      console.log(error);
    }
  });

bot.login(process.env.DJSTOKEN);