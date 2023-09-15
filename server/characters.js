"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Character = void 0;
const names_js_1 = require("./names.js");
class Character {
    constructor(id, name, price, income, image, fatigue, characteristics, level) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.income = income;
        this.image = image;
        this.fatigue = fatigue;
        this.characteristics = characteristics;
        this.level = level;
    }
}
exports.Character = Character;
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
function generateCharacteristic(level) {
    let rangeMin = 10 * level; // добавь мин ренж тут какой тебе ужен
    let rangeMax = 20 * 0.8 * level; //  добавь тут макс ренж какой тебе нужен max range - 20%
    const first = Math.floor(Math.random() * (rangeMax - rangeMin + 1)) + rangeMin;
    const second = Math.floor(Math.random() * (rangeMax - rangeMin + 1)) + rangeMin;
    const specializationMinRange = Math.max(first, second);
    const specializationMaxRange = rangeMax * 1.2;
    const specializationValue = Math.floor(Math.random() * (specializationMaxRange - specializationMinRange + 1)) + specializationMinRange;
    return { first, second, specializationValue };
}
function generateCharacteristics(level, specialization) {
    let intellect = 0;
    let strength = 0;
    let dexterity = 0;
    const result = generateCharacteristic(level);
    switch (specialization) {
        case 'intellect':
            intellect = result.specializationValue;
            strength = result.first;
            dexterity = result.second;
            break;
        case 'strength':
            strength = result.specializationValue;
            intellect = result.first;
            dexterity = result.second;
            break;
        case 'dexterity':
            dexterity = result.specializationValue;
            strength = result.first;
            intellect = result.second;
            break;
        default: break;
    }
    return { intellect, strength, dexterity };
}
function createCharacters() {
    let characters = [];
    for (let i = 0; i < 6; i++) {
        let level = (i % 3) + 1;
        let id = Math.floor(Math.random() * 1000000);
        let name = (0, names_js_1.generateName)();
        let specialization = getSpecialization(Specialization);
        let characteristics = generateCharacteristics(level, specialization);
        characters.push(new Character(id, name, 100 * level, 10 * level, `https://robohash.org/${name}.png`, 0, characteristics, level));
    }
    return characters;
}
exports.default = createCharacters;
