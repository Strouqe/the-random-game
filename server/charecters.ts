export class Charecter {
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



export function createCharacters(): Charecter[] {
  let characters = []
  for (let i = 0; i < 6; i++) {
    let intelect = Math.floor(Math.random() * 10) + 10
    let strength = Math.floor(Math.random() * 10) + 10
    let dexterity = Math.floor(Math.random() * 10) + 10
    characters.push(new Charecter(i, `Charecter ${i}`, 100, 10, "https://res.cloudinary.com/demo/image/twitter/1330457336.jpg", 0, {intelect, strength, dexterity}))
  }
  return characters
}