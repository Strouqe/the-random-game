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
