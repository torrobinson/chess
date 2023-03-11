import { Piece } from "../class/piece";
import { Point } from "../class/point";

export class PieceMovedEventArgs {
	piece: Piece;
	movedFrom: Point;
	movedTo: Point;
}