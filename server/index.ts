import * as WebSocket from "ws";
import * as http from "http";
import * as db from "./db";
import { createCharacters } from "./charecters";
import { createMissions } from "./missions";

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

const server = http.createServer((req, res) => {
  // console.log('Received request for ' + req);
});

const wss = new WebSocket.Server({ server });

let interval: any;

function startSendingData() {
  interval = setInterval(() => {
    wss.clients.forEach((client) => {
      // characters = createCharacters();
      // missions = createMissions();
      let currentConnectedUsers = getConneccedUsers();
      serverData = {
        missions,
        characters,
        currentConnectedUsers,
      };
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ serverData }));
      }
    });
  }, 10000);
  return interval;
}

function stopSendingData() {
  clearInterval(interval);
}

function getData() {
  characters = createCharacters();
  missions = createMissions();
  let currentConnectedUsers = getConneccedUsers();
  serverData = {
    missions,
    characters,
    currentConnectedUsers,
  };
  return JSON.stringify({serverData});
}

wss.on("connection", (ws: WebSocket) => {
  ws.on("message", (data: WebSocket.Data) => {
    const message = JSON.parse(data.toString());
    switch (message.type) {
      case "login":
        connectedUsers.push(message.data);
        // stopSendingData();
        // startSendingData();
        ws.send( getData() );
        console.log("Conected users ======>", connectedUsers);
        break;
      case "logout":
        connectedUsers = connectedUsers.filter(
          (user: any) => user !== message.data
        );
        console.log("connected users", connectedUsers);
        break;
      case "data request":
        // characters = createCharacters();
        // missions = createMissions();
        // let currentConnectedUsers = getConneccedUsers();
        // serverData = {
        //   missions,
        //   characters,
        //   currentConnectedUsers,
        // };
        console.log("data request", serverData);
        ws.send(getData());
        break
      case "mission result":
        db.addEntry(
          message.data.name,
          message.data.currencyBalance,
          message.data.currencyIncome
        );
    }

    ws.send(JSON.stringify(`Hello, you sent --> ${data}`));
    console.log("received: %s", data);
  });

  // ws.send(JSON.stringify({ serverData }));
});

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
