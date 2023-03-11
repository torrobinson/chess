import { Piece } from "../class/piece";
import { Point } from "../class/point";

export class PieceCapturedEventArgs {
	capturedPiece: Piece;
	capturingPiece: Piece;
	capturedFrom: Point;
	capturedAt: Point;
}