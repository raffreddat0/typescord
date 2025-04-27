import undici from "undici";
import { RestOptions } from "types/rest";

export default class Rest {
  protected readonly path: string;
  #token: string;

  constructor(options: RestOptions) {
    this.path = options.path || "https://discord.com/api/v10";
    this.#token = options.token;
  }

  public async get(url: string) {
    const result = await undici.request(this.path + url, {
      method: "GET",
      headers: {
        Authorization: `Bot ${this.#token}`,
        "content-type": "application/json",
      },
    });
    return await result.body.json();
  }

  public async post(url: string, body: object) {
    const result = await undici.request(this.path + url, {
      method: "POST",
      headers: {
        Authorization: `Bot ${this.#token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return await result.body.json();
  }

  public async patch(url: string, body: object) {
    const result = await undici.request(this.path + url, {
      method: "PATCH",
      headers: {
        Authorization: `Bot ${this.#token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return await result.body.json();
  }

  public async put(url: string, body: object) {
    const result = await undici.request(this.path + url, {
      method: "PUT",
      headers: {
        Authorization: `Bot ${this.#token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return await result.body.json();
  }

  public async delete(url: string, body: object) {
    const result = await undici.request(this.path + url, {
      method: "PUT",
      headers: {
        Authorization: `Bot ${this.#token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return await result.body.json();
  }
}
export { Rest };