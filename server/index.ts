import * as WebSocket from "ws";
import * as http from "http";
import { createCharacters } from "./charecters";
import { createMissions } from "./missions";


let characters = createCharacters()

let missions = createMissions()

let serverData: any = {
  missions,
  characters,
}

const PORT = 8080;

const server = http.createServer((req, res) => {
  // console.log('Received request for ' + req);
});

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws: WebSocket) => {
  ws.on("message", (message: WebSocket.Data) => {
    // ws.send(JSON.stringify(`Hello, you sent -> ${message}`));
    console.log("received: %s", message);
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({ message: `Hello, you sent -> ${message}` })
        );
      }
    });
  });
  ws.send(JSON.stringify( {serverData}));
  setInterval(() => {
    characters = createCharacters()
    serverData = {
      missions,
      characters,
    }
    ws.send(JSON.stringify( {serverData} ));
  }, 10000);
});

// wss.on('message', (message: WebSocket.Data) => {
//   console.log('received: %s', message);
//   ws.send(`Hello, you sent -> ${message}`);
// });
function generateData(){
  let serverData = {
    missions: createMissions(),
    charecters: createCharacters(),
  }
  return {serverData}
}

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
