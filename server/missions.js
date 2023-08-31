"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startMission = exports.Mission = void 0;
const names_js_1 = require("./names.js");
class Mission {
    constructor(id, name, difficulty, reward, requirements, partySize, specialization) {
        this.id = id;
        this.name = name;
        this.difficulty = difficulty;
        this.reward = reward;
        this.requirements = requirements;
        this.partySize = partySize;
        this.specialization = specialization;
    }
}
exports.Mission = Mission;
// function generateCharacteristics(difficulty: number): Characteristics {
//   let intelect =
//     Math.floor(Math.random() * 10) * (difficulty / 100) +
//     10 * (difficulty / 100);
//   let strength =
//     Math.floor(Math.random() * 10) * (difficulty / 100) +
//     10 * (difficulty / 100);
//   let dexterity =
//     Math.floor(Math.random() * 10) * (difficulty / 100) +
//     10 * (difficulty / 100);
//   return { intelect, strength, dexterity }
// }
function generateCharacteristic(difficulty, specializationModifier) {
    let level = difficulty / 100;
    let characteristic = (Math.floor(Math.random() * 10) * (level * 4) + 10 * (level * 4)) * specializationModifier;
    return characteristic;
}
function generateMissionCharacteristics(difficulty, specialization) {
    let intelect = 0;
    let strength = 0;
    let dexterity = 0;
    // (specialization === 2 ? (difficulty / 25) + 1 : (difficulty / 25))
    intelect = generateCharacteristic(difficulty, specialization === 1 ? 1.5 : 1);
    strength = generateCharacteristic(difficulty, specialization === 2 ? 1.5 : 1);
    dexterity = generateCharacteristic(difficulty, specialization === 3 ? 1.5 : 1);
    return { intelect, strength, dexterity };
}
// function generateMissionCharacteristics(difficulty: number){
//   let intelect = 0
//   let strength = 0
//   let dexterity = 0
//   for (let i = 0; i < 4; i++) {
//     intelect += Math.floor(Math.random() * 10) * (difficulty / 100) +
//     10 * (difficulty / 100);
//     strength += Math.floor(Math.random() * 10) * (difficulty / 100) +
//     10 * (difficulty / 100);
//     dexterity += Math.floor(Math.random() * 10) * (difficulty / 100) +
//     10 * (difficulty / 100);
//   }
//   return { intelect, strength, dexterity };
// }
function createMissions() {
    let missions = [];
    let characteristics;
    for (let i = 0; i < 6; i++) {
        let specialization = Math.floor(Math.random() * 3) + 1;
        let difficulty = ((i % 3) + 1) * 100;
        characteristics = generateMissionCharacteristics(difficulty, specialization);
        missions.push(new Mission(i, (0, names_js_1.generateMissionName)(), difficulty, difficulty, characteristics, 4, specialization));
    }
    return missions;
}
exports.default = createMissions;
function startMission(difficulty, party, specialization, requirements) {
    const req = requirements;
    // const req = generateMissionCharacteristics(difficulty, specialization);
    // for (const character in party) {
    //   if (
    //     party[character].characteristics.strength < req.strength &&
    //     party[character].characteristics.dexterity < req.dexterity &&
    //     party[character].characteristics.intelect < req.intelect
    //   ) {
    //     return false;
    //   }
    // }
    // return true;
    // sum all the stats of the party
    let partyStats = {
        intelect: 0,
        strength: 0,
        dexterity: 0,
    };
    for (const character in party) {
        partyStats.intelect += party[character].characteristics.intelect;
        partyStats.strength += party[character].characteristics.strength;
        partyStats.dexterity += party[character].characteristics.dexterity;
    }
    // compare the sum of the stats to the requirements
    if (partyStats.intelect < req.intelect ||
        partyStats.strength < req.strength ||
        partyStats.dexterity < req.dexterity) {
        return false;
    }
    return true;
}
exports.startMission = startMission;
