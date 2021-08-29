import { MessageEmbed, MessageButton } from "discord.js";
import paginationEmbed from 'discordjs-button-pagination';

const embed1 = new MessageEmbed()
  .setTitle("Sharkiee")
  .setDescription("Don’t trust sharks—they’ll spill your sea-crets.")
  .setColor('#0099ff');

const embed2 = new MessageEmbed()
  .setTitle("hehehe")
  .setDescription("Why are sharks hard to trust? They tell great white lies.")
  .setColor('#0099ff');

const embed3 = new MessageEmbed()
  .setTitle("fin.")
  .setDescription("Why did the shark cross the reef? To get to the other tide!")
  .setColor('#0099ff');
    
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
  embed2,
  embed3
]

const buttonList = [button1, button2];

export const quiz = (message) => {
  const duration = 30000;
  paginationEmbed(message, pages, buttonList, duration);

};