// const sqlite3 = require("sqlite3").verbose();
import sqlite3 from "sqlite3";

let sql;

let db = new sqlite3.Database(
  "./test.db",
  sqlite3.OPEN_READWRITE,
  (err: any) => {
    if (err) return console.error(err.message);
    console.log("Connected to the test database.");
  }
);

// sql = `CREATE TABLE users(id INTEGER PRIMARY KEY, name, balance, mission, difficulty, victory)`
// db.run(sql)

// db.run("DROP TABLE users")
export function addEntry(name: string, balance: number, mission: string, difficulty: string, victory: boolean) {
  sql = `INSERT INTO users(name, balance, mission, difficulty, victory) VALUES(?, ?, ?, ?, ?)`;
  db.run(sql, [name, balance, mission, difficulty, victory], (err: any) => {
    if (err) return console.error(err.message);
  });
}
// sql = `INSERT INTO users(name, balance, mission, difficulty, victory) VALUES(?, ?, ?, ?, ?)`;
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
let data
export function returnEntries(): string {
  sql = `SELECT * FROM users`;
  db.all(sql, [], (err: any, rows: any) => {
    if (err) return console.error(err.message);
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



