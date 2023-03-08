import { PlayerType } from "../enum/playerType";
import { Point } from "./point";

export abstract class Piece {
	owner: PlayerType;
	position: Point;
	moveVectors: Point[];
	attackVectors: Point[];

	constructor(owner: PlayerType, position: Point) {
		this.owner = owner;
		this.position = position;
	}
}