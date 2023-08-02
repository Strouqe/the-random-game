import { generateName } from "./names.js"




export class Character {
  constructor(
    public id: number,
    public name: string,
    public price: number,
    public income: number, // Income per unit of time, can be negative
    public image: string,
    public fatigue: number,
    public characteristics: Characteristics
  ){}
}
export interface Characteristics {
  intelect: number,
  strength: number,
  dexterity: number,
}


export default function createCharacters(): Character[] {
  let characters = []
  for (let i = 0; i < 6; i++) {
    //generate rendom id
    let id = Math.floor(Math.random() * 1000000)
    let name = generateName()
    let intelect = Math.floor(Math.random() * 10) + 20
    let strength = Math.floor(Math.random() * 10) + 20
    let dexterity = Math.floor(Math.random() * 10) + 20
    characters.push(new Character(id, name, 100, 10, `https://robohash.org/${name}.png`, 0, {intelect, strength, dexterity}))
  }
  return characters
}