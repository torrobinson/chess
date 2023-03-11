import { PlayerType } from "../../enum/player-type";
import { Game } from "../game";
import { Piece } from "../piece";
import { Point } from "../point";

export class King extends Piece {

	moveVectors: Point[][] = [
		[new Point(-1, -1)], // diagonal: up-left
		[new Point(-1, 0)], // orthogonal: up
		[new Point(-1, 1)], // diagonal: up-right
		[new Point(0, -1)], // orthogonal: left
		[new Point(0, 1)], // orthogonal: right
		[new Point(1, -1)], // diagonal: down-left
		[new Point(1, 0)], // orthogonal: down
		[new Point(1, 1)], // diagonal: down-right
	];

	// Attacks where it moves
	attackVectors: Point[][] = this.moveVectors;

	constructor(game: Game, owner: PlayerType, position: Point) {
		super(game, owner, position);
	}
}