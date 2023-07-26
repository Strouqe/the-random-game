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
Object.defineProperty(exports, "__esModule", { value: true });
const WebSocket = __importStar(require("ws"));
const http = __importStar(require("http"));
const db = __importStar(require("./db"));
const charecters_1 = require("./charecters");
const missions_1 = require("./missions");
let characters = (0, charecters_1.createCharacters)();
let missions = (0, missions_1.createMissions)();
let connectedUsers = [];
let serverData = {
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
let interval;
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
    characters = (0, charecters_1.createCharacters)();
    missions = (0, missions_1.createMissions)();
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
                // stopSendingData();
                // startSendingData();
                ws.send(getData());
                console.log("Conected users ======>", connectedUsers);
                break;
            case "logout":
                connectedUsers = connectedUsers.filter((user) => user !== message.data);
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
                break;
            case "mission result":
                db.addEntry(message.data.name, message.data.currencyBalance, message.data.currencyIncome);
        }
        ws.send(JSON.stringify(`Hello, you sent --> ${data}`));
        console.log("received: %s", data);
    });
    // ws.send(JSON.stringify({ serverData }));
});
server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
