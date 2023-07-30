import { Characteristics } from "./charecters";
import { generateMissionName } from "./names";

export class Mission {
  constructor(
    public id: number,
    public name: string,
    public dificulty: number,
    public reward: number,
    public requirements: Characteristics,
    public partySize: number,
  ){}
}


function generateCharacteristics(dificulty: number): Characteristics {
  let intelect = Math.floor(Math.random() * 10 )*(dificulty / 100) + 10*(dificulty / 100)
  let strength = Math.floor(Math.random() * 10 )*(dificulty / 100) + 10*(dificulty / 100)
  let dexterity = Math.floor(Math.random() * 10 )*(dificulty / 100) + 10*(dificulty / 100)
  return {intelect, strength, dexterity}
}

export function createMissions(): Mission[] {
  let missions = []
  let characteristics 
  for (let i = 0; i < 6; i++) {
    let dificulty = (i % 3 + 1) * 100
    characteristics = generateCharacteristics(dificulty)
    missions.push(new Mission(i, generateMissionName(), dificulty, dificulty, characteristics, 4))
  }
  // console.log(missions)
  return missions
}

