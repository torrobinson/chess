import { PlayerType } from "../../enum/player-type";
import { Game } from "../game";
import { Piece } from "../piece";
import { Point } from "../point";

export class Knight extends Piece {

	moveVectors: Point[][] = [
		[new Point(-2, 1)],
		[new Point(-2, -1)],
		[new Point(2, 1)],
		[new Point(2, -1)],
		[new Point(1, -2)],
		[new Point(-1, -2)],
		[new Point(1, 2)],
		[new Point(-1, 2)],
	];

	// Attacks where it moves
	attackVectors: Point[][] = this.moveVectors;

	constructor(game: Game, owner: PlayerType, position: Point) {
		super(game, owner, position);

		this.materialValue = 3;
	}
}