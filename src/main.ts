import { HtmlUtilities } from "./utility/html-utilities";

function generateBoard() {
	// Clear the board holder of its board
	boardHolder.innerHTML = '';

	// Create a new board
	let board = HtmlUtilities.elementFromString('<div class="board"></div>');

	// For each row
	for (let y = 1; y <= height; y++) {
		let newRow = HtmlUtilities.elementFromString('<div class="row"></div>');

		// For each column
		for (let x = 1; x <= width; x++) {
			newRow.appendChild(
				HtmlUtilities.elementFromString('<div class="cell"></div>')
			);
		}

		board.appendChild(newRow);
	}

	// Add the new board
	boardHolder.appendChild(board);
}


const height = 8;
const width = 8;
let boardHolder;

document.addEventListener("DOMContentLoaded", () => {
	// Find the board holder
	boardHolder = document.querySelector('.board-holder');

	// Generate the board
	generateBoard();
});