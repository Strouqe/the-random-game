const db = require("../config/sql-db");

export class Entry {
	name: string;
	balance: number;
	timePlayed: number;
	points: number;
	entries: any;
	constructor(name, balance, timePlayed, points) {
		this.name = name;
		this.balance = balance;
		this.timePlayed = timePlayed;
		this.points = points;
		this.save();
	}

	async save() {
		let sql = `
    INSERT INTO user_sessions(name, balance, timePlayed, points) 
    VALUES(
      '${this.name}', 
      '${this.balance}', 
      '${this.timePlayed}', 
      '${this.points}'
    )`;
		const [newEntry, _] = await db.execute(sql);
		return newEntry;
	}

	static async returnEntries() {
		let sql = `SELECT * FROM user_sessions`;
		const [entries, _] = await db.execute(sql);
		return JSON.stringify(entries);
	}
}

