"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entry = void 0;
const db = require("../config/sql-db");
class Entry {
    constructor(name, balance, timePlayed, points) {
        this.name = name;
        this.balance = balance;
        this.timePlayed = timePlayed;
        this.points = points;
        this.save();
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            // db.addEntry(this.name, this.balance, this.timePlayed, this.points);
            let sql = `
    INSERT INTO user_sessions(name, balance, timePlayed, points) 
    VALUES(
      '${this.name}', 
      '${this.balance}', 
      '${this.timePlayed}', 
      '${this.points}'
    )`;
            const [newEntry, _] = yield db.execute(sql);
            return newEntry;
        });
    }
    static returnEntries() {
        return __awaiter(this, void 0, void 0, function* () {
            let sql = `SELECT * FROM user_sessions`;
            const [entries, _] = yield db.execute(sql);
            console.log('db responce', entries);
            return JSON.stringify(entries);
        });
    }
}
exports.Entry = Entry;
// module.exports = Entry;
