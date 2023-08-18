"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Character = void 0;
const names_js_1 = require("./names.js");
class Character {
    constructor(id, name, price, income, image, fatigue, characteristics) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.income = income;
        this.image = image;
        this.fatigue = fatigue;
        this.characteristics = characteristics;
    }
}
exports.Character = Character;
function generateCharacteristics(level) {
    let intelect = Math.floor(Math.random() * 10) * level + 10 * level;
    let strength = Math.floor(Math.random() * 10) * level + 10 * level;
    let dexterity = Math.floor(Math.random() * 10) * level + 10 * level;
    return { intelect, strength, dexterity };
}
function createCharacters() {
    let characters = [];
    for (let i = 0; i < 6; i++) {
        let level = (i % 3) + 1;
        let id = Math.floor(Math.random() * 1000000);
        let name = (0, names_js_1.generateName)();
        let characteristics = generateCharacteristics(level);
        characters.push(new Character(id, name, 100 * level, 10 * level, `https://robohash.org/${name}.png`, 0, characteristics));
    }
    return characters;
}
exports.default = createCharacters;
