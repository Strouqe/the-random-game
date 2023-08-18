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

function generateCharacteristics(difficulty: number): Characteristics {
  let intelect =
    Math.floor(Math.random() * 10) * (difficulty / 100) +
    10 * (difficulty / 100);
  let strength =
    Math.floor(Math.random() * 10) * (difficulty / 100) +
    10 * (difficulty / 100);
  let dexterity =
    Math.floor(Math.random() * 10) * (difficulty / 100) +
    10 * (difficulty / 100);
  return { intelect, strength, dexterity };
}

export default function createMissions(): Mission[] {
  let missions = [];
  let characteristics;
  for (let i = 0; i < 6; i++) {
    let difficulty = ((i % 3) + 1) * 100;
    characteristics = generateCharacteristics(difficulty);
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
  const req = generateCharacteristics(difficulty);
  for (const character in party) {
    if (
      party[character].characteristics.strength < req.strength &&
      party[character].characteristics.dexterity < req.dexterity &&
      party[character].characteristics.intelect < req.intelect
    ) {
      return false;
    }
  }
  return true;
}
