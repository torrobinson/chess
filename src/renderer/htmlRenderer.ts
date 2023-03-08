import { Renderer } from "./renderer";
import { HtmlUtilities } from "../utility/html-utilities";
import { Game } from "../class/game";
import { Piece } from "../class/piece";
import { Pawn } from "../class/pieces/pawn";
import { Rook } from "../class/pieces/rook";

export class HtmlRenderer implements Renderer {

	public game: Game;
	readonly height = 8;
	readonly width = 8;
	boardHolder: HTMLElement | null;

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
			let newRow: HTMLElement = HtmlUtilities.elementFromString('<div class="row"></div>');

			// For each column
			for (let x = 0; x < this.width; x++) {
				let newCell: HTMLElement = HtmlUtilities.elementFromString('<div class="cell"></div>');
				let piece: Piece | null = this.game.getPieceAt(x, 7 - y); // Subtract from 7 because our origin is bottom-left for White
				if (piece !== null) {
					let pieceTempString: string = "?";
					if (piece instanceof Pawn) pieceTempString = 'P';
					if (piece instanceof Rook) pieceTempString = 'R';
					newCell.appendChild(
						HtmlUtilities.elementFromString(`<span>${pieceTempString}</span>`)
					);
				}
				newRow.appendChild(newCell);
			}

			board.appendChild(newRow);
		}

		// Add the new board
		this.boardHolder.innerHTML = '';
		this.boardHolder.appendChild(board);
	}

	highlightMovesFor(piece: Piece): void {

		piece.moveVectors
		console.log(`Can move {}`);
	}

}