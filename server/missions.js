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
var Specialization;
(function (Specialization) {
    Specialization["intellect"] = "intellect";
    Specialization["Dexterity"] = "dexterity";
    Specialization["Strength"] = "strength";
})(Specialization || (Specialization = {}));
function getSpecialization(enumeration) {
    const values = Object.keys(enumeration);
    const key = values[Math.floor(Math.random() * values.length)];
    return enumeration[key];
}
function generateCharacteristic(difficulty) {
    let level = difficulty / 100;
    let rangeMin = 40 * level;
    let rangeMax = 80 * 0.8 * level;
    const first = Math.floor(Math.random() * (rangeMax - rangeMin + 1)) + rangeMin;
    const second = Math.floor(Math.random() * (rangeMax - rangeMin + 1)) + rangeMin;
    const specializationMinRange = Math.max(first, second);
    const specializationMaxRange = rangeMax * 1.2;
    const specializationValue = Math.floor(Math.random() * (specializationMaxRange - specializationMinRange + 1)) + specializationMinRange;
    return { first, second, specializationValue };
}
function generateMissionCharacteristics(difficulty, specialization) {
    let intellect = 0;
    let strength = 0;
    let dexterity = 0;
    const result = generateCharacteristic(difficulty);
    switch (specialization) {
        case "intellect":
            intellect = result.specializationValue;
            strength = result.first;
            dexterity = result.second;
            break;
        case "strength":
            strength = result.specializationValue;
            intellect = result.first;
            dexterity = result.second;
            break;
        case "dexterity":
            dexterity = result.specializationValue;
            strength = result.first;
            intellect = result.second;
            break;
        default:
            break;
    }
    return { intellect, strength, dexterity };
}
function createMissions() {
    let missions = [];
    let characteristics;
    for (let i = 0; i < 6; i++) {
        // let specialization = Math.floor(Math.random() * 3) + 1;
        let specialization = getSpecialization(Specialization);
        let difficulty = ((i % 3) + 1) * 100;
        characteristics = generateMissionCharacteristics(difficulty, specialization);
        missions.push(new Mission(i, (0, names_js_1.generateMissionName)(), difficulty, difficulty, characteristics, 4, specialization));
    }
    return missions;
}
exports.default = createMissions;
function startMission(difficulty, party, specialization, requirements) {
    const req = requirements;
    let partyStats = {
        intellect: 0,
        strength: 0,
        dexterity: 0,
    };
    for (const character in party) {
        partyStats.intellect += party[character].characteristics.intellect;
        partyStats.strength += party[character].characteristics.strength;
        partyStats.dexterity += party[character].characteristics.dexterity;
    }
    // compare the sum of the stats to the requirements
    if (partyStats.intellect < req.intellect || partyStats.strength < req.strength || partyStats.dexterity < req.dexterity) {
        return false;
    }
    return true;
}
exports.startMission = startMission;
