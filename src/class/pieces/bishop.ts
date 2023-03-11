import { PlayerType } from "../../enum/player-type";
import { Game } from "../game";
import { Piece } from "../piece";
import { Point } from "../point";

export class Bishop extends Piece {

	// Moves in a diagonal line in every direction
	moveVectors: Point[][] = [
		[
			// Up Right
			new Point(1, -1),
			new Point(2, -2),
			new Point(3, -3),
			new Point(4, -4),
			new Point(5, -5),
			new Point(6, -6),
			new Point(7, -7),
		],
		[
			// Down Right
			new Point(-1, 1),
			new Point(-2, 2),
			new Point(-3, 3),
			new Point(-4, 4),
			new Point(-5, 5),
			new Point(-6, 6),
			new Point(-7, 7),
		],
		[
			// Up Left
			new Point(-1, -1),
			new Point(-2, -2),
			new Point(-3, -3),
			new Point(-4, -4),
			new Point(-5, -5),
			new Point(-6, -6),
			new Point(-7, -7),
		],
		[
			// Down Left
			new Point(1, 1),
			new Point(2, 2),
			new Point(3, 3),
			new Point(4, 4),
			new Point(5, 5),
			new Point(6, 6),
			new Point(7, 7),
		],
	];

	// Attacks where it moves
	attackVectors: Point[][] = this.moveVectors;

	constructor(game: Game, owner: PlayerType, position: Point) {
		super(game, owner, position);

		this.materialValue = 3;
	}
}