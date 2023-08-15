"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnEntries = exports.addEntry = void 0;
// const sqlite3 = require("sqlite3").verbose();
const sqlite3_1 = __importDefault(require("sqlite3"));
let sql;
let db = new sqlite3_1.default.Database("./test.db", sqlite3_1.default.OPEN_READWRITE, (err) => {
    if (err)
        return console.error(err.message);
    console.log("Connected to the test database.");
});
// sql = `CREATE TABLE users(id INTEGER PRIMARY KEY, name, balance, mission, difficulty, result)`
// db.run(sql)
// db.run("DROP TABLE users")
function addEntry(name, balance, mission, difficulty, result) {
    sql = `INSERT INTO users(name, balance, mission, difficulty, result) VALUES(?, ?, ?, ?, ?)`;
    db.run(sql, [name, balance, mission, difficulty, result], (err) => {
        if (err)
            return console.error(err.message);
    });
}
exports.addEntry = addEntry;
// sql = `INSERT INTO users(name, balance, mission, difficulty, result) VALUES(?, ?, ?, ?, ?)`;
// db.run(sql, ["Bob", 105, "creepy dungeon", 100, true], (err: any) => {
//   if (err) return console.error(err.message);
// });
//update the data
// sql = `UPDATE users SET name = ? WHERE id = ?`;
// db.run(sql, ["Sinjor", 1], (err: any) => {
//   if (err) return console.error(err.message);
// });
//delete
// sql = `DELETE FROM users WHERE id = ?`;
// db.run(sql, [1], (err: any) => {
//   if (err) return console.error(err.message);
// });
// export function returnEntries(): any[] {
//   sql = `SELECT * FROM users`;
//   let data
//   db.all(sql, [], (err: any, rows: any) => {
//     if (err) return console.error(err.message);
//     // rows.forEach((row: any) => {
//     //   data.push(row);
//     //   // console.log("row in db ts", row);
//     // });
//     data = JSON.stringify(rows);
//     // console.log("rows in db ts", data);
//   });
//   return data;
// }
//query the data
// sql = `SELECT * FROM users`;
// db.all(sql, [], (err: any, rows: any) => {
//   if (err) return console.error(err.message);
//   rows.forEach((row: any) => {
//   console.log(row);
//   });
// });
// return the table in an array
let data;
function returnEntries() {
    sql = `SELECT * FROM users`;
    db.all(sql, [], (err, rows) => {
        if (err)
            return console.error(err.message);
        // rows.forEach((row: any) => {
        //   data.push(row);
        //   // console.log("row in db ts", row);
        // });
        data = JSON.stringify(rows);
        // console.log("rows in db ts", data);
    });
    console.log("data in return db ts", data);
    return data;
}
exports.returnEntries = returnEntries;
