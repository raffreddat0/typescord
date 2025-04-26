import Client from '@structures/client/main';
import Guild from '@structures/guild';
import Cache from './main';

export default class Guilds extends Cache<string, Guild> {
    constructor(client: Client) {
        super(client);
    }
    
    fix(data: any[] | any) {
        if (Array.isArray(data)) {
            for (const guild of data) {
                if (!(guild instanceof Guild)) {
                    const fixed = new Guild(this.client, guild);
                    this.set(guild.id, fixed);
                } else
                    this.set(guild.id, guild);
            }
        } else if (!(data instanceof Guild)) {
            const fixed = new Guild(this.client, data);
            this.set(data.id, fixed);
        } else
            this.set(data.id, data);
    }
}