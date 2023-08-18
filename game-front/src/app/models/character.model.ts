export class Character {
  constructor(
    public id: number,
    public name: string,
    public price: number,
    public income: number,
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
