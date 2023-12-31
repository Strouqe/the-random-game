import { Character } from "./character.model";
import { Mission } from "./mission.model";
import { User } from "./user.model";

export class ServerData {
  constructor(
    public missions: Mission[],
    public currentConnectedUsers: User[],
    public characters: Character[],
    public dbdata: any[],
  ){}
}

export class ServerDataResponse {
  constructor(
    public serverData: ServerData,
  ){}
}

export class Message {
  constructor(
    public type: string,
    public data: any,
  ){}
}
