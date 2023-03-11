import { PlayerType } from "../enum/player-type";
import { PieceCapturedEventArgs } from "../event-args/piece-captured-event-args";
import { PieceMovedEventArgs } from "../event-args/piece-moved-event-args";
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
	materialValue: number = 0;

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
							moveablePoint.hasPiece = true;

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
					positions.push(attackPosition);
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
		// Don't allow moves if it's not our turn
		if (this.game.getCurrentPlayer() !== this.owner) return;

		let doMove: boolean = false;
		let newPosition: Point = new Point(x, y);

		let wasCapture: boolean = false;
		let captureArgs: PieceCapturedEventArgs = new PieceCapturedEventArgs();

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

					wasCapture = true;
					captureArgs.capturedAt = new Point(x, y);
					captureArgs.capturedFrom = this.position;
					captureArgs.capturedPiece = pieceAlreadyThere;
					captureArgs.capturingPiece = this;
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
			// Initialize some event args with original position
			let args: PieceMovedEventArgs = new PieceMovedEventArgs();
			args.piece = this;
			args.movedFrom = this.position;

			// Move
			this.position = newPosition;
			this.moveCount++;

			// Update event args with new position
			args.movedTo = this.position;

			// Mark as last piece moved and emit the piece moved event
			this.game.lastMovedPiece = this;
			this.game.onPieceMoved.emit(args);

			// Emit capture event if a capture took place
			if (wasCapture) {
				this.game.onPieceCaptured.emit(captureArgs);
			}
		}
	}
}