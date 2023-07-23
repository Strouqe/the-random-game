const sqlite3 = require("sqlite3").verbose();

let sql;

let db = new sqlite3.Database(
  "./test.db",
  sqlite3.OPEN_READWRITE,
  (err: any) => {
    if (err) return console.error(err.message);
    console.log("Connected to the test database.");
  }
);

// sql = `CREATE TABLE users(id INTEGER PRIMARY KEY, name, balance, income)`
// db.run(sql)

// db.run("DROP TABLE users")
export function addEntry(name: string, balance: number, income: number) {
  sql = `INSERT INTO users(name, balance, income) VALUES(?, ?, ?)`;
  db.run(sql, [name, balance, income], (err: any) => {
    if (err) return console.error(err.message);
  });
}
// sql = `INSERT INTO users(name, balance, income) VALUES(?, ?, ?)`;
// db.run(sql, ["Bob", 105, 19], (err: any) => {
//   if (err) return console.error(err.message);
// });

//update the data
sql = `UPDATE users SET name = ? WHERE id = ?`;
db.run(sql, ["Sinjor", 1], (err: any) => {
  if (err) return console.error(err.message);
});

//delete
sql = `DELETE FROM users WHERE id = ?`;
db.run(sql, [1], (err: any) => {
  if (err) return console.error(err.message);
});



//query the data
sql = `SELECT * FROM users`;
db.all(sql, [], (err: any, rows: any) => {
  if (err) return console.error(err.message);
  rows.forEach((row: any) => {
  console.log(row);
  });
});


