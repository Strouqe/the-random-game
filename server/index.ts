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

const PORT = 8080;

const server = http.createServer((req, res) => {
  // console.log('Received request for ' + req);
});

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws: WebSocket) => {
  ws.on("message", (data: WebSocket.Data) => {
    const message = JSON.parse(data.toString());
    switch (message.type) {
      case "login":
        connectedUsers.push(message.data);
        // wss.clients.forEach((client) => {
        //   if (client !== ws && client.readyState === WebSocket.OPEN) {
        //     client.send(connectedUsers);
        //   }
        // });
        console.log('Conected users =======>',connectedUsers);
        break;
      case "logout":
        connectedUsers = connectedUsers.filter(
          (user: any) => user !== message.data
        );
        break;
      case "mission result":
        db.addEntry(
          message.data.name,
          message.data.currencyBalance,
          message.data.currencyIncome
        );
    }
    // let user = JSON.parse(data.toString())
    // db.addEntry(user.name, user.currencyBalance, user.currencyIncome)
    ws.send(JSON.stringify(`Hello, you sent -> ${data}`));
    console.log("received: %s", data);
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(connectedUsers);
        // client.send(JSON.stringify({ data: `Hello, you sent -> ${data}` }));
      }
    });
  });
  ws.send(JSON.stringify({ serverData }));
  setInterval(() => {
    characters = createCharacters();
    serverData = {
      missions,
      characters,
    };
    ws.send(JSON.stringify({ serverData }));
  }, 10000);
});

// wss.on('message', (message: WebSocket.Data) => {
//   console.log('received: %s', message);
//   ws.send(`Hello, you sent -> ${message}`);
// });
function generateData() {
  let serverData = {
    missions: createMissions(),
    characters: createCharacters(),
  };
  return { serverData };
}

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
