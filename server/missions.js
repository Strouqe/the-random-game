"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMissions = exports.Mission = void 0;
class Mission {
    constructor(id, name, dificulty, reward, requirements) {
        this.id = id;
        this.name = name;
        this.dificulty = dificulty;
        this.reward = reward;
        this.requirements = requirements;
    }
}
exports.Mission = Mission;
function generateCharacteristics(dificulty) {
    let intelect = Math.floor(Math.random() * 10) * (dificulty / 100) + 10 * (dificulty / 100);
    let strength = Math.floor(Math.random() * 10) * (dificulty / 100) + 10 * (dificulty / 100);
    let dexterity = Math.floor(Math.random() * 10) * (dificulty / 100) + 10 * (dificulty / 100);
    return { intelect, strength, dexterity };
}
function createMissions() {
    let missions = [];
    let characteristics;
    for (let i = 0; i < 6; i++) {
        let dificulty = (i % 3 + 1) * 100;
        characteristics = generateCharacteristics(dificulty);
        missions.push(new Mission(i, `Mission ${i}`, dificulty, dificulty, characteristics));
    }
    console.log(missions);
    return missions;
}
exports.createMissions = createMissions;
