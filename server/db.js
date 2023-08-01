"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addEntry = void 0;
// const sqlite3 = require("sqlite3").verbose();
const sqlite3_1 = __importDefault(require("sqlite3"));
let sql;
let db = new sqlite3_1.default.Database("./test.db", sqlite3_1.default.OPEN_READWRITE, (err) => {
    if (err)
        return console.error(err.message);
    console.log("Connected to the test database.");
});
// sql = `CREATE TABLE users(id INTEGER PRIMARY KEY, name, balance, income)`
// db.run(sql)
// db.run("DROP TABLE users")
function addEntry(name, balance, income) {
    sql = `INSERT INTO users(name, balance, income) VALUES(?, ?, ?)`;
    db.run(sql, [name, balance, income], (err) => {
        if (err)
            return console.error(err.message);
    });
}
exports.addEntry = addEntry;
// sql = `INSERT INTO users(name, balance, income) VALUES(?, ?, ?)`;
// db.run(sql, ["Bob", 105, 19], (err: any) => {
//   if (err) return console.error(err.message);
// });
//update the data
sql = `UPDATE users SET name = ? WHERE id = ?`;
db.run(sql, ["Sinjor", 1], (err) => {
    if (err)
        return console.error(err.message);
});
//delete
sql = `DELETE FROM users WHERE id = ?`;
db.run(sql, [1], (err) => {
    if (err)
        return console.error(err.message);
});
//query the data
sql = `SELECT * FROM users`;
db.all(sql, [], (err, rows) => {
    if (err)
        return console.error(err.message);
    rows.forEach((row) => {
        console.log(row);
    });
});
