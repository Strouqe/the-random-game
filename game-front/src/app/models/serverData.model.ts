import { Character } from "./character.model";
import { Mission } from "./mission.model";

export class ServerData {
  constructor(
    public missions: Mission[],
    public characters: Character[],
    public currentConnectedUsers: string[],
  ){}
}
