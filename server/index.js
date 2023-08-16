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
const characters_js_1 = __importDefault(require("./characters.js"));
const db = __importStar(require("./db.js"));
const missions_js_1 = __importDefault(require("./missions.js"));
const missions_js_2 = require("./missions.js");
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
const wss = new ws_1.default.Server({ server });
let interval;
let dbdata;
function getData() {
    characters = (0, characters_js_1.default)();
    missions = (0, missions_js_1.default)();
    let currentConnectedUsers = getConneccedUsers();
    dbdata = db.returnEntries();
    // console.log("dbdata in index ts", db.returnEntries());
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
wss.on("connection", (ws) => {
    ws.on("message", (data) => {
        const message = JSON.parse(data.toString());
        switch (message.type) {
            case "login":
                connectedUsers.push(message.data);
                ws.send(getData());
                break;
            case "logout":
                connectedUsers = connectedUsers.filter((user) => user.name !== message.data.name);
                break;
            case "update":
                connectedUsers = connectedUsers.map((user) => {
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
                let result = (0, missions_js_2.startMission)(message.data.difficulty, message.data.party);
                result ? db.addEntry(message.data.name, message.data.currencyBalance, message.data.mission, message.data.difficulty, "Victory") :
                    db.addEntry(message.data.name, message.data.currencyBalance, message.data.mission, message.data.difficulty, "Defeat");
                let responce = JSON.stringify({
                    type: 'mission result responce',
                    data: result ? "Victory" : "Defeat"
                });
                ws.send(responce);
                break;
        }
    });
});
