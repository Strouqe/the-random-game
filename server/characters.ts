import { generateName } from "./names.js";

export class Character {
  constructor(
    public id: number,
    public name: string,
    public price: number,
    public income: number,
    public image: string,
    public fatigue: number,
    public characteristics: Characteristics,
    public level: number
  ) {}
}
export interface Characteristics {
  intellect: number;
  strength: number;
  dexterity: number;
}

enum Specialization {
  intellect = "intellect",
  Dexterity = 'dexterity',
  Strength ='strength' 
}
function getSpecialization(enumeration){
 const values = Object.keys(enumeration);
 const key = values[Math.floor(Math.random() * values.length)];
 return enumeration[key];
}

function generateCharacteristic(level) {
  let rangeMin = 10 * level// добавь мин ренж тут какой тебе ужен
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

export default function createCharacters(): Character[] {
  let characters = [];
  for (let i = 0; i < 6; i++) {
    let level = (i % 3) + 1;
    let id = Math.floor(Math.random() * 1000000);
    let name = generateName();
    let specialization = getSpecialization(Specialization)
    let characteristics = generateCharacteristics(level, specialization);
    characters.push(
      new Character(
        id,
        name,
        100 * level,
        10 * level,
        `https://robohash.org/${name}.png`,
        0,
        characteristics,
        level
      )
    );
  }
  return characters;
}
