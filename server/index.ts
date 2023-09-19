import express from "express";
import WebSocket from "ws";
import createCharacters from "./characters.js";
import * as db from "./db.js";
import createMissions, { startMission } from "./missions.js";

const app = express();

const port = process.env.PORT || 10000;

const server = app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

let characters = createCharacters();

let missions = createMissions();

let connectedUsers: any = [];

function getConneccedUsers() {
  return connectedUsers;
}

const wss = new WebSocket.Server({ server });

let dbdata;
function getData(): string {
  characters = createCharacters();
  missions = createMissions();
  let currentConnectedUsers = getConneccedUsers();
  dbdata = db.returnEntries();
  let data = {
    missions,
    characters,
    currentConnectedUsers,
    dbdata,
  };
  let responce = JSON.stringify({
    type: "data responce",
    data: data,
  });
  return responce;
}

wss.on("connection", (ws: WebSocket) => {
  ws.on("message", (data: any) => {
    const message = JSON.parse(data.toString()) && JSON.parse(data.toString());
    switch (message.type) {
      case "name validation":
        if (
          connectedUsers.some((user: any) => user.name === message.data)
        ) {
          let responce = JSON.stringify({
            type: "name validation",
            data: "invalid",
          })
          console.log("name invalid");
          ws.send(responce);
        } else {
          let responce = JSON.stringify({
            type: "name validation",
            data: "valid",
          })
          ws.send(responce);
        }
        break;
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
      case "dbData request":
        let dbData = db.returnEntries()
        let dbDataResponce = JSON.stringify({
          type: "dbData responce",
          data: dbData,
        });
        ws.send(dbDataResponce)
        break
      case "mission result":
        let result = startMission(message.data.difficulty, message.data.party, message.data.specialization, message.data.requirements);
        let responce = JSON.stringify({
          type: "mission result responce",
          data: result ? "Victory" : "Defeat",
        });
        ws.send(responce);
        break;
      case "end user session":
        let entry = JSON.parse(message.data)
       db.addEntry(
                entry.name,
                entry.currencyBalance,
                entry.timePlayed,
                entry.points,
            );
        break
    }
  });
});
