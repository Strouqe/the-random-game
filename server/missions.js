"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mission = void 0;
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
    let intelect = Math.floor(Math.random() * 10) * (difficulty / 100) + 10 * (difficulty / 100);
    let strength = Math.floor(Math.random() * 10) * (difficulty / 100) + 10 * (difficulty / 100);
    let dexterity = Math.floor(Math.random() * 10) * (difficulty / 100) + 10 * (difficulty / 100);
    return { intelect, strength, dexterity };
}
function createMissions() {
    let missions = [];
    let characteristics;
    for (let i = 0; i < 6; i++) {
        let difficulty = (i % 3 + 1) * 100;
        characteristics = generateCharacteristics(difficulty);
        missions.push(new Mission(i, (0, names_js_1.generateMissionName)(), difficulty, difficulty, characteristics, 4));
    }
    // console.log(missions)
    return missions;
}
exports.default = createMissions;
