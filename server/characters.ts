import { generateName } from "./names.js";

export class Character {
  constructor(
    public id: number,
    public name: string,
    public price: number,
    public income: number,
    public image: string,
    public fatigue: number,
    public characteristics: Characteristics
  ) {}
}
export interface Characteristics {
  intelect: number;
  strength: number;
  dexterity: number;
}

function generateCharacteristics(level: number): Characteristics {
  let specialization = Math.floor(Math.random() * 3) + 1;
  let intelect =
  Math.floor((Math.floor(Math.random() * 10) * level + 10 * level) *(specialization === 1 ? 1.5 : 1));
  let strength =
  Math.floor((Math.floor(Math.random() * 10) * level + 10 * level) *(specialization === 2 ? 1.5 : 1));
  let dexterity = Math.floor((Math.floor(Math.random() * 10) * level + 10 * level) *(specialization === 3 ? 1.5 : 1));
  return { intelect, strength, dexterity };
}

export default function createCharacters(): Character[] {
  let characters = [];
  for (let i = 0; i < 6; i++) {
    let level = (i % 3) + 1;
    let id = Math.floor(Math.random() * 1000000);
    let name = generateName();
    let characteristics = generateCharacteristics(level);
    characters.push(
      new Character(
        id,
        name,
        100 * level,
        10 * level,
        `https://robohash.org/${name}.png`,
        0,
        characteristics
      )
    );
  }
  return characters;
}
