require('dotenv').config();
const musql = require('mysql2');
const pool = musql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '12345',
    database: process.env.DB_NAME || 'rndm_game',
});
module.exports = pool.promise();
// let sql = "SELECT * FROM `user_sessions`"
// pool.execute(sql, (err, result) => {
// if(err) throw err;
// result.forEach(row => {
//   console.log(row);
//   console.log(row.id);
//   console.log(row.name);
//   console.log(row.balance);
// })
// })
// export function addEntry(name: string, balance: number, timePlayed: number, points: number) {
//   sql = `INSERT INTO user_sessions(name, balance, timePlayed, points) VALUES(?, ?, ?, ?)`;
//   pool.execute(sql, [name, balance, timePlayed, points], (err: any) => {
//     if (err) return console.error(err.message);
//   });
// }
// export function returnEntries(): string {
//   let data: string;
//   sql = `SELECT * FROM user_sessions`;
//   pool.execute(sql, [], (err: any, rows: any) => {
//     if (err) return console.error(err.message);
//     data = JSON.stringify(rows);
//   });
//   return data;
// }
// const mysql = require('mysql2/promise');
// async function main() {
//   const connection = await mysql.createConnection({host:'localhost', user: 'root', password:'anusbananus12', database: 'rndm_game'});
//   const [rows, fields] = await connection.execute('SELECT * FROM `user_Sessions`', []);
//   console.log('rows', rows);
//   console.log('fields', fields);
// }
// main().catch(console.error);
// async function addUserSession(sessionId: string, userId: number) {
//   const connection = await mysql.createConnection({host:'localhost', user: 'root', password:'anusbananus12', database: 'rndm_game'});
//   const [rows, fields] = await connection.execute('INSERT INTO `user_Sessions` (`session_id`, `user_id`) VALUES (?, ?)', [sessionId, userId]);
//   console.log(`Added user session with session_id ${sessionId} and user_id ${userId}`);
// }
