import { PlayerType } from "../../enum/playerType";
import { Piece } from "../piece";
import { Point } from "../point";

export class Rook extends Piece {

	// Moves in a straight line in any direction
	moveVectors: Point[] = [
		// Down
		new Point(0, 1),
		new Point(0, 2),
		new Point(0, 3),
		new Point(0, 4),
		new Point(0, 5),
		new Point(0, 6),
		new Point(0, 7),
		// Up
		new Point(0, -1),
		new Point(0, -2),
		new Point(0, -3),
		new Point(0, -4),
		new Point(0, -5),
		new Point(0, -6),
		new Point(0, -7),
		// Left
		new Point(-1, 0),
		new Point(-2, 0),
		new Point(-3, 0),
		new Point(-4, 0),
		new Point(-5, 0),
		new Point(-6, 0),
		new Point(-7, 0),
		// Right
		new Point(1, 0),
		new Point(2, 0),
		new Point(3, 0),
		new Point(4, 0),
		new Point(5, 0),
		new Point(6, 0),
		new Point(7, 0),
	];

	// Attacks where it moves
	attackVectors: Point[] = this.moveVectors;

	constructor(owner: PlayerType, position: Point) {
		super(owner, position);
	}
}