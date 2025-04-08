import Guild from '@classes/guild';
import Cache from './main';

export default class Guilds extends Cache<string, Guild> {
    constructor() {
        super();
    }
    
    fix(data: any[] | any) {
        if (Array.isArray(data)) {
            for (const guild of data) {
                if (!(guild instanceof Guild)) {
                    const fixed = new Guild(guild);
                    this.set(guild.id, fixed);
                } else
                    this.set(guild.id, guild);
            }
        } else if (!(data instanceof Guild)) {
            const fixed = new Guild(data);
            this.set(data.id, fixed);
        } else
            this.set(data.id, data);
    }
}