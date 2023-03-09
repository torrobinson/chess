import { Piece } from "./piece";
import { Pawn } from "./pieces/pawn";
import { Rook } from "./pieces/rook";
import { Point } from "./point";
import { PlayerType } from "../enum/playerType";
import { Bishop } from "./pieces/bishop";
import { Knight } from "./pieces/knight";
import { Queen } from "./pieces/queen";
import { King } from "./pieces/king";

export class Game {
	public pieces: Piece[] = [];

	constructor() {
		this.reset();
	}

	public reset(): void {
		this.resetPieces();
	}

	public getPieceAt(x: number, y: number): Piece | null {
		return this.pieces.filter(p => p.inPlay && p.position.x === x && p.position.y === y)[0] ?? null;
	}

	private resetPieces(): void {

		this.pieces = [
			// White pieces
			new Rook(this, PlayerType.White, new Point(0, 0)),
			new Knight(this, PlayerType.White, new Point(1, 0)),
			new Bishop(this, PlayerType.White, new Point(2, 0)),
			new Queen(this, PlayerType.White, new Point(3, 0)),
			new King(this, PlayerType.White, new Point(4, 0)),
			new Bishop(this, PlayerType.White, new Point(5, 0)),
			new Knight(this, PlayerType.White, new Point(6, 0)),
			new Rook(this, PlayerType.White, new Point(7, 0)),
			new Pawn(this, PlayerType.White, new Point(0, 1)),
			new Pawn(this, PlayerType.White, new Point(1, 1)),
			new Pawn(this, PlayerType.White, new Point(2, 1)),
			new Pawn(this, PlayerType.White, new Point(3, 1)),
			new Pawn(this, PlayerType.White, new Point(4, 1)),
			new Pawn(this, PlayerType.White, new Point(5, 1)),
			new Pawn(this, PlayerType.White, new Point(6, 1)),
			new Pawn(this, PlayerType.White, new Point(7, 1)),

			// Black pieces
			new Rook(this, PlayerType.Black, new Point(0, 7)),
			new Knight(this, PlayerType.Black, new Point(1, 7)),
			new Bishop(this, PlayerType.Black, new Point(2, 7)),
			new Queen(this, PlayerType.Black, new Point(3, 7)),
			new King(this, PlayerType.Black, new Point(4, 7)),
			new Bishop(this, PlayerType.Black, new Point(5, 7)),
			new Knight(this, PlayerType.Black, new Point(6, 7)),
			new Rook(this, PlayerType.Black, new Point(7, 7)),
			new Pawn(this, PlayerType.Black, new Point(0, 6)),
			new Pawn(this, PlayerType.Black, new Point(1, 6)),
			new Pawn(this, PlayerType.Black, new Point(2, 6)),
			new Pawn(this, PlayerType.Black, new Point(3, 6)),
			new Pawn(this, PlayerType.Black, new Point(4, 6)),
			new Pawn(this, PlayerType.Black, new Point(5, 6)),
			new Pawn(this, PlayerType.Black, new Point(6, 6)),
			new Pawn(this, PlayerType.Black, new Point(7, 6))
		];

	}
}