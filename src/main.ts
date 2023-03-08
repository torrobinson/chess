import { Game } from "./class/game";
import { HtmlRenderer } from "./renderer/htmlRenderer";
import { Renderer } from "./renderer/renderer";

// Create a new game
let game: Game = new Game();

// Choose a renderer
let renderer: Renderer = new HtmlRenderer(game);

// When the document is loaded
document.addEventListener("DOMContentLoaded", () => {
	// Render the board
	renderer.renderBoard();

	// Show possible moves for first piece
	renderer.highlightMovesFor(game.pieces[0]);
});