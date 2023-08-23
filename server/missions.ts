import { Characteristics } from "./characters.js";
import { generateMissionName } from "./names.js";

export class Mission {
  constructor(
    public id: number,
    public name: string,
    public difficulty: number,
    public reward: number,
    public requirements: Characteristics,
    public partySize: number
  ) {}
}

// function generateCharacteristics(difficulty: number): Characteristics {
//   let intelect =
//     Math.floor(Math.random() * 10) * (difficulty / 100) +
//     10 * (difficulty / 100);
//   let strength =
//     Math.floor(Math.random() * 10) * (difficulty / 100) +
//     10 * (difficulty / 100);
//   let dexterity =
//     Math.floor(Math.random() * 10) * (difficulty / 100) +
//     10 * (difficulty / 100);
//   return { intelect, strength, dexterity };
// }

function generateMissionCharacteristics(difficulty: number){
  let intelect = 0
  let strength = 0
  let dexterity = 0
  for (let i = 0; i < 4; i++) {
    intelect += Math.floor(Math.random() * 10) * (difficulty / 100) +
    10 * (difficulty / 100);
    strength += Math.floor(Math.random() * 10) * (difficulty / 100) +
    10 * (difficulty / 100);
    dexterity += Math.floor(Math.random() * 10) * (difficulty / 100) +
    10 * (difficulty / 100);
  }
  return { intelect, strength, dexterity };
}

export default function createMissions(): Mission[] {
  let missions = [];
  let characteristics;
  for (let i = 0; i < 6; i++) {
    let difficulty = ((i % 3) + 1) * 100;
    characteristics = generateMissionCharacteristics(difficulty);
    missions.push(
      new Mission(
        i,
        generateMissionName(),
        difficulty,
        difficulty,
        characteristics,
        4
      )
    );
  }
  return missions;
}

export function startMission(difficulty, party) {
  const req = generateMissionCharacteristics(difficulty);


  // for (const character in party) {
  //   if (
  //     party[character].characteristics.strength < req.strength &&
  //     party[character].characteristics.dexterity < req.dexterity &&
  //     party[character].characteristics.intelect < req.intelect
  //   ) {
  //     return false;
  //   }
  // }
  // return true;
  // sum all the stats of the party
  let partyStats = {
    intelect: 0,
    strength: 0,
    dexterity: 0,
  };
  for (const character in party) {
    partyStats.intelect += party[character].characteristics.intelect;
    partyStats.strength += party[character].characteristics.strength;
    partyStats.dexterity += party[character].characteristics.dexterity;
  }
  // compare the sum of the stats to the requirements
  if (
    partyStats.intelect < req.intelect ||
    partyStats.strength < req.strength ||
    partyStats.dexterity < req.dexterity
  ) {
    return false;
  }
  return true;
}
