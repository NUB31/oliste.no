import { Vector2D } from '$lib/game-engine/Vector2D';
import { Rect2D } from '$lib/game-engine/nodes/Rect2D';
import type { Board } from './Board';

export class Paddle extends Rect2D {
	public readonly upKey: string;
	public readonly downKey: string;
	private color: string;
	private board: Board;

	public constructor(board: Board, upKey: string, downKey: string, color: string) {
		super(Vector2D.ZERO, 20, 100);
		this.upKey = upKey;
		this.downKey = downKey;
		this.board = board;
		this.color = color;
	}

	public reset(x: number) {
		this.position = new Vector2D(x, this.board.height / 2 - this.height / 2);
	}

	protected override process(delta: number) {
		if (this.engine.eventHandler.isKeyPressed(this.upKey)) {
			if (this.position.y >= 0) {
				this.position.add(new Vector2D(0, -1), delta);
			}
		}
		if (this.engine.eventHandler.isKeyPressed(this.downKey)) {
			if (this.position.y + this.height <= this.board.height) {
				this.position.add(new Vector2D(0, 1), delta);
			}
		}
	}

	protected override draw(context: CanvasRenderingContext2D, mousePos: Vector2D): void {
		const cornerRadius = 4;

		context.fillStyle = this.color;

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
