import { Game } from "../class/game";
import { Piece } from "../class/piece";

export interface Renderer {
	game: Game;
	renderBoard(): void;
	highlightMovesFor(piece: Piece): void;
}