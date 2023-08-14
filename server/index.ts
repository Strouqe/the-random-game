import express from "express";
import WebSocket from "ws";
import createCharacters from "./characters.js";
import * as db from "./db.js";
import createMissions from "./missions.js";

const app = express();

const port = process.env.PORT || 10000;

const server = app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

let characters = createCharacters();

let missions = createMissions();

let connectedUsers: any = [];

let serverData: any = {
  missions,
  characters,
};

function getConneccedUsers() {
  return connectedUsers;
}

const PORT = 8080;

const wss = new WebSocket.Server({ server });

let interval: any;

let dbdata
function getData() {
  characters = createCharacters();
  missions = createMissions();
  let currentConnectedUsers = getConneccedUsers();
  dbdata = db.returnEntries(); 
  console.log("dbdata in index ts", db.returnEntries());
  serverData = {
    missions,
    characters,
    currentConnectedUsers,
    dbdata
  };
  return JSON.stringify({ serverData });
}

wss.on("connection", (ws: WebSocket) => {
  ws.on("message", (data: any) => {
    const message = JSON.parse(data.toString());
    switch (message.type) {
      case "login":
        connectedUsers.push(message.data);
        ws.send(getData());
        break;
      case "logout":
        connectedUsers = connectedUsers.filter(
          (user: any) => user.name !== message.data.name
        );

        break;
      case "update":
        connectedUsers = connectedUsers.map((user: any) => {
          if (user.name !== JSON.parse(message.data).name) {
            return user;
          }
          return JSON.parse(message.data);
        });
        break;
      case "data request":
        ws.send(getData());
        break;
      case "mission result":
        db.addEntry(
          message.data.name,
          message.data.currencyBalance,
          message.data.mission,
          message.data.difficulty,
          message.data.victory
        );
    }
  });
});
