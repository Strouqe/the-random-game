import { Characteristics } from "./character.model";

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
