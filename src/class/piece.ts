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
	attacksWhereItMoves: boolean = true;
	moveCount: number = 0;

	constructor(game: Game, owner: PlayerType, position: Point) {
		this.game = game;
		this.owner = owner;
		this.position = position;
	}

	public getMoveablePositions(): Point[] {


		// Reusable function
		let getMovesAndAttacksFromVectorSet = (vectorSet: Point[][]): Point[] => {
			let returnPositions: Point[] = [];
			vectorSet.forEach((vectorSet: Point[]) => {

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
							returnPositions.push(moveablePoint);
						}
					}
				});

			});

			return returnPositions;
		};

		// Get moves
		let positions: Point[] = getMovesAndAttacksFromVectorSet(this.moveVectors);

		// Special logic: pieces that can't move where they attack and vice versa will have their 
		//	attackable moveable positions removed from the list,
		//	and then their ACTUAL attackable ones added
		if (this.attacksWhereItMoves === false) {
			// See if where it'd move would be an "attack"
			let movesThatWouldBeIntoAnEnemyPiece: Point[] = positions.filter((p: Point) => {
				let pieceAtMovePosiion: Piece | null = this.game.getPieceAt(p.x, p.y);

				if (pieceAtMovePosiion === null) return false

				return pieceAtMovePosiion.owner !== this.owner;

			});

			// Remove them from standard moves
			movesThatWouldBeIntoAnEnemyPiece.forEach((p: Point) => {
				let index: number = positions.indexOf(p);
				if (index > -1) positions.splice(index, 1);
			});

			// Now check for actual attack moves
			let attackMoves: Point[] = getMovesAndAttacksFromVectorSet(this.attackVectors);
			attackMoves.forEach((attackPosition: Point) => {
				let potentialAttackPiece: Piece | null = this.game.getPieceAt(attackPosition.x, attackPosition.y);
				if (potentialAttackPiece !== null && potentialAttackPiece.owner !== this.owner) {
					positions = positions.concat(attackMoves);
				}
			});
		}

		// Special logic: unmoved (0-moveCount) pawns can double jump
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