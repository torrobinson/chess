import { Renderer } from "./renderer";
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
import { PlayerType } from "../enum/playerType";

export class HtmlRenderer implements Renderer {

	public game: Game;

	// Elements
	boardHolder: HTMLElement | null;

	// Constants
	readonly height = 8;
	readonly width = 8;

	// State
	currentlySelectedPiece: Piece | null = null;

	constructor(game: Game) {
		this.game = game;
	}

	renderBoard(): void {

		this.boardHolder = document.querySelector('.board-holder');
		if (this.boardHolder === null) {
			throw 'board holder not found';
		}

		// Create a new board
		let board: HTMLElement = HtmlUtilities.elementFromString('<div class="board"></div>');

		// For each row
		for (let y = 0; y < this.height; y++) {
			let boardY = 7 - y; // Subtract from 7 because our origin is bottom-left for White
			let newRow: HTMLElement = HtmlUtilities.elementFromString(`<div y="${boardY}" class="row"></div>`);

			// For each column
			for (let x = 0; x < this.width; x++) {
				let newCell: HTMLElement = HtmlUtilities.elementFromString(`<div x="${x}" y="${boardY}" class="cell"></div>`);
				let piece: Piece | null = this.game.getPieceAt(x, boardY);
				if (piece !== null) {
					let pieceTempString: string = "?";

					if (piece instanceof Pawn) pieceTempString = '<i class="fa-solid fa-chess-pawn"></i>';
					else if (piece instanceof Rook) pieceTempString = '<i class="fa-solid fa-chess-rook"></i>';
					else if (piece instanceof Bishop) pieceTempString = '<i class="fa-solid fa-chess-bishop"></i>';
					else if (piece instanceof Knight) pieceTempString = '<i class="fa-solid fa-chess-knight"></i>';
					else if (piece instanceof Queen) pieceTempString = '<i class="fa-solid fa-chess-queen"></i>';
					else if (piece instanceof King) pieceTempString = '<i class="fa-solid fa-chess-king"></i>';
					else pieceTempString = '?';

					let playerClassName: string = piece.owner === PlayerType.White ? 'white' : 'black';

					newCell.appendChild(
						HtmlUtilities.elementFromString(`<span class="${playerClassName} piece">${pieceTempString}</span>`)
					);
				}

				// Add cell to row
				newRow.appendChild(newCell);
			}
			// Add row to board
			board.appendChild(newRow);
		}

		// Add board to DOM
		this.boardHolder.innerHTML = '';
		this.boardHolder.appendChild(board);


		// Setup board input events
		board.querySelectorAll('.cell').forEach(cellElement => {

			// On cell clicks
			cellElement.addEventListener('click', () => {
				let x: number = parseInt(cellElement.getAttribute('x') || '-1');
				let y: number = parseInt(cellElement.getAttribute('y') || '-1');
				let pieceClicked: Piece | null = this.game.getPieceAt(x, y);

				// If a piece is selected
				if (this.currentlySelectedPiece !== null) {

					// If they click the same cell they did last time, unselect it
					if (this.currentlySelectedPiece === pieceClicked) {
						// Unselect it
						this.currentlySelectedPiece = null;
					}

					else if (
						// They clicked on a piece and then an empty square
						pieceClicked === null
						// OR they clicked on a piece and then an opposing piece
						|| (pieceClicked !== null && pieceClicked.owner !== this.currentlySelectedPiece.owner)
					) {
						try {
							// Try move it
							this.currentlySelectedPiece.moveTo(x, y);

							// Unselect it
							this.currentlySelectedPiece = null;

							this.renderBoard();
						}
						catch (ex) {

							// Unselect it
							this.currentlySelectedPiece = null;
							this.renderBoard();
							console.error(ex);
						}
					}

					// If there was a piece selected, highlight where you can move
					// This will either show or hide the highlights
					this.highlightMovesFor(pieceClicked);


				}
				// Nothing is currently selected
				else {
					// Select it
					this.currentlySelectedPiece = pieceClicked;
				}

				// Finally, render the board again always after a click
				this.highlightMovesFor(this.currentlySelectedPiece);
			});
		});
	}

	highlightMovesFor(piece: Piece | null): void {
		const moveableClassName = 'moveable';

		// Clear possible moves from cells
		document.querySelectorAll('.cell').forEach((cell: Element) => {
			cell.classList.remove(moveableClassName);
		});

		if (piece !== null) {
			// Get the moveable positions for this piece
			let moveable: Point[] = piece.getMoveablePositions();

			// For each position
			moveable.forEach((point: Point) => {
				// Get cell at this location
				let cell: HTMLElement | null = document.querySelector(`.cell[x="${point.x}"][y="${point.y}"]`);

				// Add an indicator
				if (cell !== null) {
					cell.classList.add(moveableClassName);
				}
			});
		}
	}

}