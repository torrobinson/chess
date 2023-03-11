import { HtmlUtilities } from "../utility/html-utilities";
import { Game } from "../class/game";
import { Piece } from "../class/piece";
import { Pawn } from "../class/pieces/pawn";
import { Rook } from "../class/pieces/rook";
import { Point } from "../class/point";
import { Bishop } from "../class/pieces/bishop";
import { Knight } from "../class/pieces/knight";
import { Queen } from "../class/pieces/queen";
import { King } from "../class/pieces/king";
import { PlayerType } from "../enum/player-type";
import { PieceMovedEventArgs } from "../event-args/piece-moved-event-args";
import { PieceCapturedEventArgs } from "../event-args/piece-captured-event-args";

export class HtmlRenderer {

	public game: Game;

	// Elements
	playerIndicator: HTMLElement | null;
	whiteScoreIndicator: HTMLElement | null;
	blackScoreIndicator: HTMLElement | null;

	// Constants
	readonly height = 8;
	readonly width = 8;

	// State
	currentlySelectedPiece: Piece | null = null;

	constructor(game: Game) {
		this.game = game;
	}

	updateIndicators(): void {

		let playerIndicator: HTMLElement | null = document.querySelector('.current-player-indicator');
		if (playerIndicator === null) {
			throw 'player indicator not found';
		}

		let blackScoreIndicator: HTMLElement | null = document.querySelector('.black-score');
		if (blackScoreIndicator === null) {
			throw 'black indicator not found';
		}

		let whiteScoreIndicator: HTMLElement | null = document.querySelector('.white-score');
		if (whiteScoreIndicator === null) {
			throw 'white indicator not found';
		}

		// Update current player
		let color: string = '';
		switch (this.game.getCurrentPlayer()) {
			case PlayerType.Black:
				color = 'black';
				break;
			case PlayerType.White:
				color = 'white';
				break;
		}
		playerIndicator.innerHTML = `Player: <div style="display: inline-block; border: 1px solid black; height: 20px; width: 20px; background-color: ${color};"></div>`;

		// Update scores
		whiteScoreIndicator.innerHTML = 'White: ' + this.game.capturedPieces.filter(p => p.owner === PlayerType.Black).reduce((totalMaterial, piece) => totalMaterial + piece.materialValue, 0);
		blackScoreIndicator.innerHTML = 'Black: ' + this.game.capturedPieces.filter(p => p.owner === PlayerType.White).reduce((totalMaterial, piece) => totalMaterial + piece.materialValue, 0);
	}

	initialize(): void {
		// Check for pieces holder
		let pieceHolder: HTMLElement | null = document.querySelector('.pieces');
		if (pieceHolder === null) {
			throw 'Piece holder not found';
		}

		// Create the piece elements
		this.game.pieces.forEach((piece: Piece) => {
			// Determine sprite
			let pieceIcon: string = "?";
			if (piece instanceof Pawn) pieceIcon = '<i class="fa-solid fa-chess-pawn"></i>';
			else if (piece instanceof Rook) pieceIcon = '<i class="fa-solid fa-chess-rook"></i>';
			else if (piece instanceof Bishop) pieceIcon = '<i class="fa-solid fa-chess-bishop"></i>';
			else if (piece instanceof Knight) pieceIcon = '<i class="fa-solid fa-chess-knight"></i>';
			else if (piece instanceof Queen) pieceIcon = '<i class="fa-solid fa-chess-queen"></i>';
			else if (piece instanceof King) pieceIcon = '<i class="fa-solid fa-chess-king"></i>';
			else pieceIcon = '?';

			let newPieceElement: HTMLElement = HtmlUtilities.elementFromString(`<piece x="${piece.position.x}" y="${piece.position.y}" class="${piece.owner}">${pieceIcon}</piece>`);

			pieceHolder?.appendChild(newPieceElement);
		});

		// Bind piece click events
		HtmlUtilities.liveBind('click', 'piece', (clickedPieceElement: HTMLElement, e: Event) => {
			let x: number = parseInt(clickedPieceElement.getAttribute('x') || '-1');
			let y: number = parseInt(clickedPieceElement.getAttribute('y') || '-1');
			let pieceClicked: Piece | null = this.game.getPieceAt(x, y);

			// Ignore clicks on enemy pieces
			if (pieceClicked?.owner !== this.game.getCurrentPlayer()) {
				// Do nothing!
			}
			else {

				// If a piece is selected
				if (this.currentlySelectedPiece !== null) {
					// If they click the same cell they did last time, unselect it
					if (this.currentlySelectedPiece === pieceClicked) {
						// Unselect it
						this.currentlySelectedPiece = null;
					}
				}
				this.currentlySelectedPiece = pieceClicked;
			}

			// Finally, render the board again always after a click
			this.highlightMovesFor(this.currentlySelectedPiece);
		});

		// Bind move click events
		HtmlUtilities.liveBind('click', 'move', (clickedMoveElement: HTMLElement, e: Event) => {
			let x: number = parseInt(clickedMoveElement.getAttribute('x') || '-1');
			let y: number = parseInt(clickedMoveElement.getAttribute('y') || '-1');
			let moveWouldAttack: Piece | null = this.game.getPieceAt(x, y);

			// If this would be an attack
			if (moveWouldAttack !== null) {

			}
			// If this would be just a move
			else {

			}

			// Regardless, move it
			if (this.currentlySelectedPiece !== null) {
				try {
					// Try move it
					this.currentlySelectedPiece.moveTo(x, y);

					// and then unselect it
					this.currentlySelectedPiece = null;
				}
				catch (ex) {
					// Unselect it in an error or bad move
					this.currentlySelectedPiece = null;
					this.initialize();
					console.error(ex);
				}
			}

		});


		// Bind other incoming events ///////////////////////////////////////////////////////////

		// When a piece moves, update it's position in the DOM
		this.game.onPieceMoved.on((event: PieceMovedEventArgs) => {
			// Unselect anything
			this.currentlySelectedPiece = null

			// Redraw no moves
			this.highlightMovesFor(null);

			// Given a piece, find the piece in our environment and physically move it
			let pieceElement: HTMLElement | null = document.querySelector(`piece[x="${event.movedFrom.x}"][y="${event.movedFrom.y}"]`);
			if (pieceElement !== null) {
				// Update it
				pieceElement.setAttribute('x', event.movedTo.x.toString());
				pieceElement.setAttribute('y', event.movedTo.y.toString());
			}

			this.updateIndicators();
		});

		// When a piece is captured
		this.game.onPieceCaptured.on((event: PieceCapturedEventArgs) => {
			// Update it in the dom
			let pieceElement: HTMLElement | null = document.querySelector(`piece[x="${event.capturedAt.x}"][y="${event.capturedAt.y}"].${event.capturedPiece.owner}`);
			if (pieceElement !== null) {
				pieceElement.classList.add('captured');
			}

			this.updateIndicators();
		});


		// Initial updates/renders
		this.updateIndicators();
	}

	highlightMovesFor(piece: Piece | null): void {
		// Clear all moves
		document.querySelectorAll('move').forEach((move: Element) => {
			move.parentNode?.removeChild(move);
		});

		if (piece === null || !piece.inPlay) {
			// We're highlighting moves for nothing
		}
		else {
			// We're highlighting moves for something

			// We're looking at the current player's pieces, so show the moves
			if (piece.owner === this.game.getCurrentPlayer()) {

				if (piece !== null) {
					// Get the moveable positions for this piece
					let moveable: Point[] = piece.getMoveablePositions();

					// Check for moves holder
					let moveHolder: HTMLElement = document.querySelector('.moves')!;
					if (moveHolder === null) {
						throw 'Move holder not found';
					}

					// For each position
					moveable.forEach((point: Point) => {

						// Create a move
						let newMove: HTMLElement = HtmlUtilities.elementFromString(`<move x="${point.x}" y="${point.y}" class="${point.hasPiece ? 'is-attack' : 'is-move'}"></move>`);
						moveHolder.appendChild(newMove);
					});
				}
			}
			else {
				// We're looking at the other player's pieces
			}

		}
	}

}