import { Vector2D } from '$lib/game-engine/Vector2D';
import { Rect2D } from '$lib/game-engine/nodes/Rect2D';
import type { Board } from './Board';

export class Food extends Rect2D {
	private board: Board;

	public constructor(board: Board) {
		super(Vector2D.ZERO, board.gridAlign, board.gridAlign);
		this.board = board;
		this.randomPos();
	}

	public randomPos() {
		this.position = Vector2D.random(
			0,
			this.board.width - this.width,
			0,
			this.board.height - this.height
		).align(this.board.gridAlign);
	}

	protected override draw(context: CanvasRenderingContext2D, mousePos: Vector2D): void {
		context.fillStyle = 'red';
		context.fillRect(this.position.x, this.position.y, this.width, this.height);
	}
}
