import giphyApi from 'giphy-api';
const gh = giphyApi(process.env.API);

import { query } from '../DB/query.js';
import { btn } from './buttonComponent.js';
import { clues } from './clues.js';

export class gamePlay{
    constructor(message){
        this.msg = message;
        // this.channelNames = ["Coral Reefs", "Oil Spills", "Tides", "Plastic Wastes", "Schools Of Fish", "Sea Floor"];
        this.channelNames = ["Coral Reefs"];
        this.cluesFound = [];
  }
  
  foundAClue(id) {
    this.cluesFound.push(id);
    console.log(this.cluesFound);
  }

    async createCategory(categoryName){
        this.categoryName = categoryName;
        let newCategory = await this.msg.guild.channels.create(this.categoryName, {type: 'GUILD_CATEGORY'});
        this.Player = await newCategory;

        this.query = await query(`INSERT INTO players VALUES('${this.msg.author.id}','${this.msg.author.username}',0,0);`);
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

    hideAndSeek() {
      // setInterval(() => {
      //     this.randomGifSpam();
      // }, 2500);
      setTimeout(()=>{
      let row = btn(Object.keys(clues)[0], 'Gottcha!');
      this.channels[0].send({ content:"...", components: [row] });
        // setTimeout(() => {
        //     let row = hideAndSeekBtn('btn1', 'Gottcha!');
        //     const randNum = Math.floor(Math.random() * 6);
        //     this.channels[randNum].send({ content: 'Clue 1', components: [row] });
        //     const btn = row.components[0].toJSON();
        //     console.log(btn);
        }, 2000);
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
