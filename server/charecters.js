"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCharacters = exports.Charecter = void 0;
class Charecter {
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
exports.Charecter = Charecter;
function createCharacters() {
    let characters = [];
    for (let i = 0; i < 6; i++) {
        let intelect = Math.floor(Math.random() * 10) + 10;
        let strength = Math.floor(Math.random() * 10) + 10;
        let dexterity = Math.floor(Math.random() * 10) + 10;
        characters.push(new Charecter(i, `Charecter ${i}`, 100, 10, "https://res.cloudinary.com/demo/image/twitter/1330457336.jpg", 0, { intelect, strength, dexterity }));
    }
    return characters;
}
exports.createCharacters = createCharacters;
