"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnEntries = exports.addEntry = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
let sql;
let db = new sqlite3_1.default.Database("./test.db", sqlite3_1.default.OPEN_READWRITE, (err) => {
    if (err)
        return console.error(err.message);
    console.log("Connected to the test database.");
});
// sql = `CREATE TABLE users(id INTEGER PRIMARY KEY, name, balance, timePlayed, points)`
// db.run(sql)
// db.run("DROP TABLE users")
function addEntry(name, balance, timePlayed, points) {
    sql = `INSERT INTO users(name, balance, timePlayed, points) VALUES(?, ?, ?, ?)`;
    db.run(sql, [name, balance, timePlayed, points], (err) => {
        if (err)
            return console.error(err.message);
    });
}
exports.addEntry = addEntry;
let data;
function returnEntries() {
    sql = `SELECT * FROM users`;
    db.all(sql, [], (err, rows) => {
        if (err)
            return console.error(err.message);
        data = JSON.stringify(rows);
    });
    return data;
}
exports.returnEntries = returnEntries;
