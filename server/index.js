"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ws_1 = __importDefault(require("ws"));
// const http = require("http");
const db = __importStar(require("./db.js"));
const characters_js_1 = __importDefault(require("./characters.js"));
const missions_js_1 = __importDefault(require("./missions.js"));
// import * as firebaseFunctions from "firebase-functions";
const app = (0, express_1.default)();
const port = process.env.PORT || 10000;
const server = app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
let characters = (0, characters_js_1.default)();
let missions = (0, missions_js_1.default)();
let connectedUsers = [];
let serverData = {
    missions,
    characters,
};
function getConneccedUsers() {
    return connectedUsers;
}
const PORT = 8080;
// const server = http.createServer((req: any, res: any) => {
//   console.log('Received request for ' + req + 'Responce' + res);
// });
const wss = new ws_1.default.Server({ server });
let interval;
// function startSendingData() {
//   interval = setInterval(() => {
//     wss.clients.forEach((client) => {
//       // characters = createCharacters();
//       // missions = createMissions();
//       let currentConnectedUsers = getConneccedUsers();
//       serverData = {
//         missions,
//         characters,
//         currentConnectedUsers,
//       };
//       if (client.readyState === WebSocket.OPEN) {
//         client.send(JSON.stringify({ serverData }));
//       }
//     });
//   }, 10000);
//   return interval;
// }
// function stopSendingData() {
//   clearInterval(interval);
// }
function getData() {
    characters = (0, characters_js_1.default)();
    missions = (0, missions_js_1.default)();
    let currentConnectedUsers = getConneccedUsers();
    serverData = {
        missions,
        characters,
        currentConnectedUsers,
    };
    return JSON.stringify({ serverData });
}
wss.on("connection", (ws) => {
    ws.on("message", (data) => {
        const message = JSON.parse(data.toString());
        switch (message.type) {
            case "login":
                connectedUsers.push(message.data);
                ws.send(getData());
                console.log("Conected users ======>", connectedUsers);
                break;
            case "logout":
                connectedUsers = connectedUsers.filter((user) => user.name !== message.data.name);
                console.log("connected users", connectedUsers);
                break;
            // case "update user data":
            //   connectedUsers = connectedUsers.map((user: any) => {
            //     if (user.name === message.data.name) {
            //       return message.data;
            //     }
            //     return user;
            //   });
            //   ws.send(getData());
            //   break;
            case "data request":
                console.log("data request", serverData);
                ws.send(getData());
                break;
            case "mission result":
                db.addEntry(message.data.name, message.data.currencyBalance, message.data.currencyIncome);
        }
        // ws.send(JSON.stringify(`Hello, you sent --> ${data}`));
        console.log("received: %s", data);
    });
    // ws.send(JSON.stringify({ serverData }));
});
// server.listen(PORT, () => {
//   console.log(`Server started on port  ${PORT}`);
// });
