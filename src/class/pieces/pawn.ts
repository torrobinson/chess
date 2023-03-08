import { PlayerType } from "../../enum/playerType";
import { Piece } from "../piece";
import { Point } from "../point";

export class Pawn extends Piece {

	constructor(owner: PlayerType, position: Point) {
		super(owner, position);

		// Since pawns can only move in 1 direction, base it off of player type
		// Black moves down, white moves up
		let verticalVector: number = owner === PlayerType.White ? -1 : 1;

		// Moving forwards
		this.moveVectors = [new Point(0, verticalVector)];

		// Attacking diagonally once forward
		this.attackVectors = [
			new Point(-1, verticalVector),
			new Point(1, verticalVector),
		];
	}
}