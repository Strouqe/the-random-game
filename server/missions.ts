import { Characteristics } from "./characters.js";
import { generateMissionName } from "./names.js";

export class Mission {
  constructor(
    public id: number,
    public name: string,
    public difficulty: number,
    public reward: number,
    public requirements: Characteristics,
    public partySize: number,
    public specialization: number
  ) {}
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

function generateCharacteristic(difficulty) {
  let level = difficulty / 100;
  let rangeMin = 40 * level// добавь мин ренж тут какой тебе ужен
  let rangeMax = 80 * 0.8 * level; //  добавь тут макс ренж какой тебе нужен max range - 20%
  
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


// Initial logic
// function generateCharacteristics(difficulty: number): Characteristics {
//   let intellect =
//     Math.floor(Math.random() * 10) * (difficulty / 100) +
//     10 * (difficulty / 100);
//   let strength =
//     Math.floor(Math.random() * 10) * (difficulty / 100) +
//     10 * (difficulty / 100);
//   let dexterity =
//     Math.floor(Math.random() * 10) * (difficulty / 100) +
//     10 * (difficulty / 100);
//   return { intellect, strength, dexterity }
// }

// Specialization logic
// function generateCharacteristic(difficulty: number, specializationModifier: number) {
//  let level = difficulty / 100 

//  let characteristic =( Math.floor(Math.random() * 10) * (level * 4) + 10 * (level * 4)) * specializationModifier;
//  return characteristic
// }

// Specialization logic
// function generateMissionCharacteristics(difficulty: number, specialization: number){
//   let intellect = 0
//   let strength = 0
//   let dexterity = 0
  
//     intellect = generateCharacteristic(difficulty, specialization === 1 ? 1.5 : 1)
//     strength = generateCharacteristic(difficulty, specialization === 2 ? 1.5 : 1)
//     dexterity = generateCharacteristic(difficulty, specialization === 3 ? 1.5 : 1)

//   return { intellect, strength, dexterity };
// }
 
// Initial logic
// function generateCharacteristic(difficulty: number, specialization: boolean) {
//   let level = difficulty / 100 
//   if(specialization === true){
//    level + 8
//   }
//   specialization === true ? level + 100 : level
//   let characteristic = Math.floor(Math.random() * 10) * (level * 4) + 10 * (level * 4);
//   return characteristic
//  }

// Specialization logic variation
//  function generateMissionCharacteristics(difficulty: number, specialization: number){
//    let intellect = 0
//    let strength = 0
//    let dexterity = 0
//    // (specialization === 2 ? (difficulty / 25) + 1 : (difficulty / 25))
   
//      intellect = generateCharacteristic(difficulty, specialization === 1 ? true : false)
//      strength = generateCharacteristic(difficulty, specialization === 2 ? true : false)
//      dexterity = generateCharacteristic(difficulty, specialization === 3 ? true : false)
 
//    return { intellect, strength, dexterity };
//  }

// Initial logic
// function generateMissionCharacteristics(difficulty: number){
//   let intellect = 0
//   let strength = 0
//   let dexterity = 0
//   for (let i = 0; i < 4; i++) {
//     intellect += Math.floor(Math.random() * 10) * (difficulty / 100) +
//     10 * (difficulty / 100);
//     strength += Math.floor(Math.random() * 10) * (difficulty / 100) +
//     10 * (difficulty / 100);
//     dexterity += Math.floor(Math.random() * 10) * (difficulty / 100) +
//     10 * (difficulty / 100);
//   }
//   return { intellect, strength, dexterity };
// }

export default function createMissions(): Mission[] {
  let missions = [];
  let characteristics;
  for (let i = 0; i < 6; i++) {
    // let specialization = Math.floor(Math.random() * 3) + 1;
    let specialization = getSpecialization(Specialization)
    let difficulty = ((i % 3) + 1) * 100;
    characteristics = generateMissionCharacteristics(difficulty, specialization);
    missions.push(
      new Mission(
        i,
        generateMissionName(),
        difficulty,
        difficulty,
        characteristics,
        4,
        specialization
      )
    );
  }
  return missions;
}

export function startMission(difficulty, party, specialization, requirements) {
  const req = requirements
  // const req = generateMissionCharacteristics(difficulty, specialization);
  // for (const character in party) {
  //   if (
  //     party[character].characteristics.strength < req.strength &&
  //     party[character].characteristics.dexterity < req.dexterity &&
  //     party[character].characteristics.intellect < req.intellect
  //   ) {
  //     return false;
  //   }
  // }
  // return true;
  // sum all the stats of the party
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
  if (
    partyStats.intellect < req.intellect ||
    partyStats.strength < req.strength ||
    partyStats.dexterity < req.dexterity
  ) {
    return false;
  }
  return true;
}
