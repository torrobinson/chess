import { Piece } from "./piece";
import { Pawn } from "./pieces/pawn";
import { Rook } from "./pieces/rook";
import { Point } from "./point";
import { PlayerType } from "../enum/playerType";

export class Game {
	public pieces: Piece[] = [];

	constructor() {
		this.reset();
	}

	public reset(): void {
		this.resetPieces();
	}

	public getPieceAt(x: number, y: number): Piece | null {
		return this.pieces.filter(p => p.position.x === x && p.position.y === y)[0] ?? null;
	}

	private resetPieces(): void {
		this.pieces = [new Rook(PlayerType.White, new Point(3, 3))];

		// // create pawns for both players
		// for (let i = 0; i < 8; i++) {
		// 	this.pieces.push(new Pawn(PlayerType.White, new Point(i, 1)));
		// 	this.pieces.push(new Pawn(PlayerType.Black, new Point(i, 6)));
		// }

		// // create other pieces for both players
		// const initialPositions: Point[][] = [
		// 	// White pieces
		// 	[new Point(0, 0), new Point(1, 0), new Point(2, 0), new Point(3, 0), new Point(4, 0), new Point(5, 0), new Point(6, 0), new Point(7, 0)],
		// 	// Black pieces
		// 	[new Point(0, 7), new Point(1, 7), new Point(2, 7), new Point(3, 7), new Point(4, 7), new Point(5, 7), new Point(6, 7), new Point(7, 7)]
		// ];

		// const pieces: typeof Piece[] = [Rook, Knight, Bishop, Queen, King, Bishop, Knight, Rook];

		// for (let i = 0; i < 2; i++) {
		// 	const player = i === 0 ? PlayerType.White : PlayerType.Black;
		// 	for (let j = 0; j < 8; j++) {
		// 		const pieceType = pieces[j];
		// 		const position = initialPositions[i][j];
		// 		this.pieces.push(new pieceType(player, position));
		// 	}
		// }
	}
}