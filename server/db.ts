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

// sql = `CREATE TABLE users(id INTEGER PRIMARY KEY, name, balance, timePlayed, points)`
// db.run(sql)

// db.run("DROP TABLE users")
export function addEntry(name: string, balance: number, timePlayed: number, points: number) {
  sql = `INSERT INTO users(name, balance, timePlayed, points) VALUES(?, ?, ?, ?)`;
  db.run(sql, [name, balance, timePlayed, points], (err: any) => {
    if (err) return console.error(err.message);
  });
}

let data
export function returnEntries(): string {
  sql = `SELECT * FROM users`;
  db.all(sql, [], (err: any, rows: any) => {
    if (err) return console.error(err.message);
    data = JSON.stringify(rows);
  });
  return data;
}



