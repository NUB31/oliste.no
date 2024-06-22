import { Vector2D } from '$lib/game-engine/Vector2D';
import { Node2D } from '$lib/game-engine/nodes/Node2D';
import type { Board } from './Board';

export class Food extends Node2D {
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

		console.log(this.position);
	}

	protected override draw(context: CanvasRenderingContext2D): void {
		context.fillStyle = 'red';
		context.fillRect(this.position.x, this.position.y, this.width, this.height);
	}
}
