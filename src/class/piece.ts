import { PlayerType } from "../enum/playerType";
import { Game } from "./game";
import { Pawn } from "./pieces/pawn";
import { Point } from "./point";

export abstract class Piece {
	game: Game;
	owner: PlayerType;
	position: Point;
	inPlay: boolean = true;
	moveVectors: Point[][];
	attackVectors: Point[][];
	moveCount: number = 0;

	constructor(game: Game, owner: PlayerType, position: Point) {
		this.game = game;
		this.owner = owner;
		this.position = position;
	}

	public getMoveablePositions(): Point[] {

		let positions: Point[] = [];

		this.moveVectors.forEach((vectorSet: Point[]) => {

			let hasStopped: boolean = false;
			let previousWasCapture: boolean = false;

			vectorSet.forEach((vector: Point) => {

				if (!previousWasCapture) {
					let moveablePoint: Point = this.position.add(vector)

					// Check if we're colliding with a piece
					let pieceAlreadyAtLocation: Piece | null = this.game.getPieceAt(moveablePoint.x, moveablePoint.y);
					if (pieceAlreadyAtLocation !== null) {
						// If it's our own piece, we can't do anything
						if (pieceAlreadyAtLocation.owner === this.owner) {
							hasStopped = true;
						}
						// If we don't own it, we can attack it
						else {
							previousWasCapture = true;
						}
					}

					if (!hasStopped) {
						positions.push(moveablePoint);
					}
				}
			});

		});

		// Special logic

		// Unmoved pawns can double jump
		if (this instanceof Pawn && this.moveCount === 0) {
			positions.push(
				this.position.add(
					new Point(0, this.owner === PlayerType.White ? 2 : -2)
				)
			);
		}

		return positions.filter(p => p.isInBounds);
	}

	public moveTo(x: number, y: number): void {

		let doMove: boolean = false;

		let newPosition: Point = new Point(x, y);

		// If we're able to move there
		let moveAblePositions: Point[] = this.getMoveablePositions();
		if (moveAblePositions.some(mp => mp.x === newPosition.x && mp.y === newPosition.y)) {
			// Capture if possible
			let pieceAlreadyThere: Piece | null = this.game.getPieceAt(newPosition.x, newPosition.y);
			if (pieceAlreadyThere === null) {
				// Nothing is there

				doMove = true;
			}
			else {
				// Something is there

				// Can we capture it?
				if (pieceAlreadyThere.owner !== this.owner) {
					// Capture it
					pieceAlreadyThere.inPlay = false;

					doMove = true;
				}
				else {
					// Once of our pieces is already there
					throw `Piece cannot move there`;
				}
			}

		}
		else {
			throw `Piece cannot move there`;
		}

		if (doMove) {
			this.position = newPosition;
			this.moveCount++;
		}
	}
}