export class DbEntry {
  constructor(
    public id: number,
    public name: string,
    public balance: number,
    public timePlayed: number,
    public points: number
  ){}
}
