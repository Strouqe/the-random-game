import { Charecter } from "./charecter.model";
import { Mission } from "./mission.model";

export class User {
  constructor(
    public name: string,
    public currencyBalance: number,
    public currencyIncome: number,
    public charecters: Charecter[],
    public missionsCompleated: Mission[],
  ){}
}
