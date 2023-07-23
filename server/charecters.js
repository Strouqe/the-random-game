"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCharacters = exports.Character = void 0;
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
        let intelect = Math.floor(Math.random() * 10) + 20;
        let strength = Math.floor(Math.random() * 10) + 20;
        let dexterity = Math.floor(Math.random() * 10) + 20;
        characters.push(new Character(i, `character ${i}`, 100, 10, "https://res.cloudinary.com/demo/image/twitter/1330457336.jpg", 0, { intelect, strength, dexterity }));
    }
    return characters;
}
exports.createCharacters = createCharacters;
