import { Game } from "./class/game";
import { Piece } from "./class/piece";
import { Bishop } from "./class/pieces/bishop";
import { King } from "./class/pieces/king";
import { Knight } from "./class/pieces/knight";
import { Pawn } from "./class/pieces/pawn";
import { Queen } from "./class/pieces/queen";
import { Rook } from "./class/pieces/rook";
import { Point } from "./class/point";
import { HtmlRenderer } from "./renderer/html-renderer";

// Create a new game
let game: Game = new Game();

// Choose a renderer
let renderer: HtmlRenderer = new HtmlRenderer(game);

// When the document is loaded
document.addEventListener("DOMContentLoaded", () => {
	// Render the board
	renderer.initialize();

	let updateDebug = () => {
		let simplifiedPieceState: any[] = game.pieces.map((piece: Piece) => ({
			x: piece.position.x,
			y: piece.position.y,
			owner: piece.owner,
			type: piece instanceof Pawn ? 'pawn' : piece instanceof Bishop ? 'bishop' : piece instanceof Knight ? 'knight' : piece instanceof Rook ? 'rook' : piece instanceof King ? 'king' : piece instanceof Queen ? 'queen' : '?'
		}));

		// When anything happens, push state to text box
		let stateJson: string = JSON.stringify(simplifiedPieceState);
		(document.getElementById('state') as HTMLInputElement).value = stateJson;
	};
	updateDebug();
	// On debug changing, import state
	(document.getElementById('state') as HTMLInputElement).onkeyup = (e) => {
		let stateString: string = (document.getElementById('state') as HTMLInputElement).value;
		let simplifiedPieceState: any[] = JSON.parse(stateString);
		game.pieces = [];
		game.pieces = simplifiedPieceState.map(entry => {
			let importedPiece!: Piece;
			switch (entry.type) {
				case 'pawn':
					importedPiece = new Pawn(game, entry.owner, new Point(entry.x, entry.y));
					break;
				case 'bishop':
					importedPiece = new Bishop(game, entry.owner, new Point(entry.x, entry.y));
					break;
				case 'knight':
					importedPiece = new Knight(game, entry.owner, new Point(entry.x, entry.y));
					break;
				case 'rook':
					importedPiece = new Rook(game, entry.owner, new Point(entry.x, entry.y));
					break;
				case 'king':
					importedPiece = new King(game, entry.owner, new Point(entry.x, entry.y));
					break;
				case 'queen':
					importedPiece = new Queen(game, entry.owner, new Point(entry.x, entry.y));
					break;
			}
			return importedPiece;
		});

		renderer.initialize();
	};

	// Look for debug
	game.onPieceMoved.on((p) => {
		updateDebug();
	});
});