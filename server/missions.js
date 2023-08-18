"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startMission = exports.Mission = void 0;
const names_js_1 = require("./names.js");
class Mission {
    constructor(id, name, difficulty, reward, requirements, partySize) {
        this.id = id;
        this.name = name;
        this.difficulty = difficulty;
        this.reward = reward;
        this.requirements = requirements;
        this.partySize = partySize;
    }
}
exports.Mission = Mission;
function generateCharacteristics(difficulty) {
    let intelect = Math.floor(Math.random() * 10) * (difficulty / 100) +
        10 * (difficulty / 100);
    let strength = Math.floor(Math.random() * 10) * (difficulty / 100) +
        10 * (difficulty / 100);
    let dexterity = Math.floor(Math.random() * 10) * (difficulty / 100) +
        10 * (difficulty / 100);
    return { intelect, strength, dexterity };
}
function createMissions() {
    let missions = [];
    let characteristics;
    for (let i = 0; i < 6; i++) {
        let difficulty = ((i % 3) + 1) * 100;
        characteristics = generateCharacteristics(difficulty);
        missions.push(new Mission(i, (0, names_js_1.generateMissionName)(), difficulty, difficulty, characteristics, 4));
    }
    return missions;
}
exports.default = createMissions;
function startMission(difficulty, party) {
    const req = generateCharacteristics(difficulty);
    for (const character in party) {
        if (party[character].characteristics.strength < req.strength &&
            party[character].characteristics.dexterity < req.dexterity &&
            party[character].characteristics.intelect < req.intelect) {
            return false;
        }
    }
    return true;
}
exports.startMission = startMission;
