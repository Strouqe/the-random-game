"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Character = void 0;
const names_js_1 = require("./names.js");
class Character {
    constructor(id, name, price, income, // Income per unit of time, can be negative
    image, fatigue, characteristics) {
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
function createCharacters() {
    let characters = [];
    for (let i = 0; i < 6; i++) {
        //generate rendom id
        let id = Math.floor(Math.random() * 1000000);
        let name = (0, names_js_1.generateName)();
        let intelect = Math.floor(Math.random() * 10) + 20;
        let strength = Math.floor(Math.random() * 10) + 20;
        let dexterity = Math.floor(Math.random() * 10) + 20;
        characters.push(new Character(id, name, 100, 10, `https://robohash.org/${name}.png`, 0, { intelect, strength, dexterity }));
    }
    return characters;
}
exports.default = createCharacters;
