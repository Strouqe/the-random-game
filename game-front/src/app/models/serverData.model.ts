import { Charecter } from "./charecter.model";
import { Mission } from "./mission.model";

export class ServerData {
  constructor(
    public missions: Mission[],
    public charecters: Charecter[],
  ){}
}
