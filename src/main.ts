import { Game } from "./class/game";
import { HtmlRenderer } from "./renderer/html-renderer";

// Create a new game
let game: Game = new Game();

// Choose a renderer
let renderer: HtmlRenderer = new HtmlRenderer(game);

// When the document is loaded
document.addEventListener("DOMContentLoaded", () => {
	// Render the board
	renderer.initialize();
});