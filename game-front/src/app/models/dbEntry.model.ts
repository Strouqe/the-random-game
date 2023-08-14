export class DbEntry {
  constructor(
    public id: number,
    public name: string,
    public balance: number,
    public mission: string,
    public difficulty: number,
    public victory: boolean,
  ){}
}
