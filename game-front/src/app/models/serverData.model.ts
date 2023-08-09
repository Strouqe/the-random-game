import { Character } from "./character.model";
import { Mission } from "./mission.model";
import { User } from "./user.model";

export class ServerData {
  constructor(
    public missions: Mission[],
    public currentConnectedUsers: User[],
    public characters: Character[],
  ){}
}

export class ServerDataResponse {
  constructor(
    public serverData: ServerData,
  ){}
}
