import { Vector2D } from '$lib/game-engine/Vector2D';
import { Node2D } from '$lib/game-engine/nodes/Node2D';
import type { Board } from './Board';

export class Paddle extends Node2D {
	public readonly upKey: string;
	public readonly downKey: string;
	private board: Board;

	public constructor(board: Board, upKey: string, downKey: string) {
		super(Vector2D.ZERO, 20, 100);
		this.upKey = upKey;
		this.downKey = downKey;
		this.board = board;
	}

	public reset(x: number) {
		this.position = new Vector2D(x, this.board.height / 2 - this.height / 2);
	}

	protected override process(delta: number) {
		this.engine.eventHandler.preventDefault(this.upKey);
		this.engine.eventHandler.preventDefault(this.downKey);

		if (this.engine.eventHandler.isPressed(this.upKey)) {
			if (this.position.y >= 0) {
				this.position.add(new Vector2D(0, -1), delta);
			}
		}
		if (this.engine.eventHandler.isPressed(this.downKey)) {
			if (this.position.y + this.height <= this.board.height) {
				this.position.add(new Vector2D(0, 1), delta);
			}
		}
	}

	protected override draw(context: CanvasRenderingContext2D): void {
		const cornerRadius = 4;

		context.fillStyle = 'hsl(220, 20%, 70%)';

		context.beginPath();
		context.moveTo(this.position.x + cornerRadius, this.position.y);
		context.lineTo(this.position.x + this.width - cornerRadius, this.position.y);
		context.quadraticCurveTo(
			this.position.x + this.width,
			this.position.y,
			this.position.x + this.width,
			this.position.y + cornerRadius
		);
		context.lineTo(this.position.x + this.width, this.position.y + this.height - cornerRadius);
		context.quadraticCurveTo(
			this.position.x + this.width,
			this.position.y + this.height,
			this.position.x + this.width - cornerRadius,
			this.position.y + this.height
		);
		context.lineTo(this.position.x + cornerRadius, this.position.y + this.height);
		context.quadraticCurveTo(
			this.position.x,
			this.position.y + this.height,
			this.position.x,
			this.position.y + this.height - cornerRadius
		);
		context.lineTo(this.position.x, this.position.y + cornerRadius);
		context.quadraticCurveTo(
			this.position.x,
			this.position.y,
			this.position.x + cornerRadius,
			this.position.y
		);
		context.closePath();
		context.fill();
	}
}
