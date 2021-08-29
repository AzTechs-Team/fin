import giphyApi from 'giphy-api';
const gh = giphyApi(process.env.API);

import { query } from '../DB/query.js';
import { btn } from './buttonComponent.js';
import { clues } from './clues.js';
import { slides } from './kewl/slides.js';

export class gamePlay{
  constructor(message){
    this.msg = message;
    this.id = this.msg.author.id;
    this.channelNames = ["Coral Reefs", "Oil Spills", "Tides", "Plastic Wastes", "Schools Of Fish", "Sea Floor"];
    // this.channelNames = ["Coral Reefs"];
    this.cluesFound = [];
  }

  async foundAClue(id) {
    if (!this.cluesFound.includes(id)) {
      this.cluesFound.push(id);
      let updatePoints = await query(`
      UPDATE players SET
      lifepts = '${this.cluesFound.length * 20}'
      WHERE id='${this.id}'
      `);
      if (updatePoints == false) {
        this.msg.channel.send('Oops! Something went wrong while updating the points');
        this.cluesFound.pop();
      }
    }
  }

  async startPPT() {
    this.pptCounter = 0;
    this.ppt = await this.msg.channel.send(slides[0]);
    this.ppt.react('◀️');
    this.ppt.react('▶️');
  }

  async makeRole(){
      let allRoles = await this.msg.guild.roles.fetch();
      let everyOneRole;
      allRoles.forEach(roli => {
          if(roli.name == '@everyone') {
              everyOneRole = roli;
              // console.log(roli.name, roli.id);
              return
          }
      })
      // console.log(await everyOneRole.name);
      this.everOneRole = await everyOneRole;
      let colors = ['GREEN', 'BLUE', 'PURPLE', 'ORANGE', 'GOLD'];
      const randNum = Math.floor(Math.random() * 5);
      let color = colors[randNum];
      let role = await this.msg.guild.roles.create({name: `Player: ${this.msg.name}`, mentionable: true, color: color});
      let GuildMember = await this.msg.member.roles.add(role);
      this.Player = GuildMember;
      this.PersonRole = role;
  }


  async createCategory(categoryName){
      this.categoryName = categoryName;
      let newCategory = await this.msg.guild.channels.create(this.categoryName, {type: 'GUILD_CATEGORY'});
      let perms = await newCategory.permissionOverwrites;
      // console.log(perms);
      perms.set([
          {id: this.everOneRole, deny: ['VIEW_CHANNEL']},
          {id: this.PersonRole, allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']}
      ])
      this.Player = await newCategory;

    //TODO: ask user for concent
    this.query = await query(`
      INSERT INTO players
      VALUES('${this.msg.author.id}','${this.msg.author.username}',0,0)
      ON CONFLICT (id) 
      DO 
      UPDATE SET lifepts = 0 ,confusionpts = 0;
      `);
      if (this.query == false) {
          this.msg.channel.send('Oops! Could not start the game. Try again!');
      }
  }

  createChannel(){
      let channels = [];
      this.channelNames.forEach(async (channel) => {
          let channel_ = await this.msg.guild.channels.create(channel, {parent: this.Player});
          channels.push(channel_);
      });
      this.channels = channels;
  }

  async randomGifSpam() {
      const tagsList = ["shark", "coral reef", "fish", "ocean",
          "marine ecosystem", "shark cute", "finding nemo",
          "little mermaid", "dolphins", "jelly fish"]
      const randTag = Math.floor(Math.random() * tagsList.length);
      const res = await gh.random({
          tag: tagsList[randTag],
          rating: 'g',
          fmt: 'json',
          limit: 1
      });
      const randNum = Math.floor(Math.random() * this.channels.length);
      this.channels[randNum].send(res.data.embed_url);
  }

  findYourWayHome() {
    setInterval(() => {
      this.randomGifSpam();
      
      if (this.cluesFound.length === 4) {
        clearInterval()
      }
    }, 2500);

    let duration = 10000
    const interval = setInterval(() => {
      let setClue = this.cluesFound.length
      if (setClue === 4) {
        clearInterval(interval);
      }

      console.log(setClue, Object.keys(clues)[setClue]);
      
      let row = btn(Object.keys(clues)[setClue], Object.keys(clues)[setClue]);

      const randNum = Math.floor(Math.random() * this.channels.length);
      this.channels[randNum].send({ content: "...", components: [row] });
    }, duration);
  }

  deleteChannels(){
      setInterval(5000, function (){
          this.Player.delete();
          console.log('category deleted!');
          this.channel_.forEach( (channel, i) => {
              channel.delete();
              console.log(`Channel ${i} deleted!`)
          })
      })
  }
}
