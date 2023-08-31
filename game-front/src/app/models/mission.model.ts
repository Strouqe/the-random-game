import { Characteristics } from "./character.model";

export class Mission {
  constructor(
    public id: number,
    public name: string,
    public difficulty: number,
    public reward: number,
    public requirements: Characteristics,
    public partySize: number,
    public specialization: number
  ){}
}


export interface MissionResults {
  result: boolean,
  points: number
}
