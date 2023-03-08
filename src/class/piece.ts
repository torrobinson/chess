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

	public getMoveablePositions(): Point[] {
		// TODO: also get attack vectors added
		return this.moveVectors
			.map(mv => this.position.add(mv))
			.filter(p => p.isInBounds);
	}
}