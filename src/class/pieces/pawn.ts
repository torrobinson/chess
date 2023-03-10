import { PlayerType } from "../../enum/playerType";
import { Game } from "../game";
import { Piece } from "../piece";
import { Point } from "../point";

export class Pawn extends Piece {


	constructor(game: Game, owner: PlayerType, position: Point) {
		super(game, owner, position);

		// Pawns don't attack where they move, and vice versa
		this.attacksWhereItMoves = false;

		// Since pawns can only move in 1 direction, base it off of player type
		// Black moves down, white moves up
		let verticalVector: number = owner === PlayerType.White ? 1 : -1;

		// Moving forwards
		this.moveVectors = [
			[new Point(0, verticalVector)]
		];

		// Attacking diagonally once forward
		this.attackVectors = [
			[new Point(-1, verticalVector)],
			[new Point(1, verticalVector)],
		];
	}
}