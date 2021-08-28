class Commands{
    
    async static switcher(){
        console.log(await this.command);
        switch(this.command){
            case "~start": {
                console.log('here!');
            }
            break;
        }
    }
}
