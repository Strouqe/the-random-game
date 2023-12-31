import { Injectable } from "@angular/core";
import { Subscription } from "rxjs";
import { Character } from "../models/character.model";
import { Mission, MissionResults } from "../models/mission.model";
import { User } from "../models/user.model";
import { UserService } from "./user.service";
import { WebsocketService } from "./websocket.service";

@Injectable({
	providedIn: "root",
})
export class MissionsService {
	userSubscription: Subscription;
	promiseResolve: any;
	promiseReject: any;

	private user: User;

	constructor(private userService: UserService, private wsService: WebsocketService) {
		this.userSubscription = this.userService.userChanged.subscribe((user: User) => {
			this.user = user;
		});
	}

	async getResult(mission: Mission, party: Character[]): Promise<MissionResults> {
		let points = 0;
		let message = {
			type: "mission result",
			data: {
				name: this.user.name,
				party: party,
				difficulty: mission.difficulty,
				specialization: mission.specialization,
				requirements: mission.requirements,
			},
		};
		this.wsService.sendToServer(message);
		let result = await new Promise((resolve, reject) => {
			this.promiseResolve = resolve;
			this.promiseReject = reject;
		}).then((result) => {
			if (result == "Victory") {
				if (party.length != mission.partySize) {
					points += (mission.partySize - party.length) * (mission.reward / 2);
				}
				this.charecterStatPenalty(party, mission);
				points += mission.reward;
				this.user.characters = [...this.user.characters, ...party];
				this.user.missionsCompleated.push(mission);
				this.user.currencyBalance += mission.reward;
				this.user.points += points;
				this.userService.userChanged.next(this.user);
				this.userService.trigerUpdateState();
				return true;
			} else {
				this.charecterStatPenalty(party, mission);
				this.user.characters = [...this.user.characters, ...party];
				this.user.missionsCompleated.push(mission);
				this.userService.userChanged.next(this.user);
				this.userService.updateIncome();
				return false;
			}
		});
		return { result, points };
	}

	finalPointCount(): void {
		console.log("final point count before", this.user.points);
		this.user.points += this.user.currencyBalance / 4;
		this.user.points -= this.user.timePlayed;
		this.userService.userChanged.next(this.user);
		this.userService.trigerUpdateState();
		console.log("final point count after", this.user.points);
	}

	private charecterStatPenalty(party: Character[], mission: Mission): void {
		party.forEach((character: Character) => {
			let statPenalty = 0;
			if (character.price - mission.difficulty > 0) {
				statPenalty = ((character.level * 100 - mission.difficulty) / 100) * 2;
			}
			character.price = character.price - character.level * 10;
			character.characteristics.strength = character.characteristics.strength - (2 + statPenalty) > 0 ? character.characteristics.strength - (2 + statPenalty) : 0;
			character.characteristics.dexterity = character.characteristics.dexterity - (2 + statPenalty) > 0 ? character.characteristics.dexterity - (2 + statPenalty) : 0;
			character.characteristics.intellect = character.characteristics.intellect - (2 + statPenalty) > 0 ? character.characteristics.intellect - (2 + statPenalty) : 0;
		});
	}
}
