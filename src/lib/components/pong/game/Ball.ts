import { Vector2D } from '$lib/game-engine/Vector2D';
import { Node2D } from '$lib/game-engine/nodes/Node2D';
import type { Paddle } from './Paddle';
import type { Board } from './Board';

export class Ball extends Node2D {
	private direction: Vector2D;
	private paddles: Paddle[];
	private board: Board;

	public constructor(board: Board, paddles: Paddle[]) {
		super(Vector2D.ZERO, 20, 20);
		this.direction = Vector2D.ZERO;
		this.paddles = paddles;
		this.board = board;
		this.reset();
	}

	public reset() {
		this.direction = new Vector2D(1, 0).normalize();
		this.position = new Vector2D(this.board.width / 2, this.board.height / 2);
	}

	protected override process(delta: number): void {
		if (!this.board.started) {
			return;
		}

		if (
			this.position.x <= this.board.position.x ||
			this.position.x + this.width >= this.board.position.x + this.board.width
		) {
			this.board.stop();
			return;
		}

		if (this.position.y <= this.board.position.y) {
			this.position.y = this.board.position.y;
			this.direction.y = -this.direction.y;
		}

		if (this.position.y + this.height >= this.board.position.y + this.board.height) {
			this.position.y = this.board.position.y + this.board.height - this.height;
			this.direction.y = -this.direction.y;
		}

		this.paddles.forEach((paddle) => {
			if (paddle.intersects(this)) {
				this.direction.x = -this.direction.x;

				const middlePoint = this.position.y + this.height / 2;
				const paddleMiddle = paddle.position.y + paddle.height / 2;
				const impactFactor = (middlePoint - paddleMiddle) / (paddle.height / 2);

				this.direction.y += impactFactor;
				this.direction = this.direction.normalize();

				if (this.direction.x > 0) {
					this.position.x = paddle.position.x + paddle.width;
				} else {
					this.position.x = paddle.position.x - this.width;
				}

				this.board.addPoint();
			}
		});

		this.position.add(this.direction, delta);
	}

	protected override draw(context: CanvasRenderingContext2D): void {
		const radius = this.width / 2;
		context.fillStyle = 'hsl(220, 20%, 70%)';
		context.beginPath();
		context.arc(this.position.x + radius, this.position.y + radius, radius, 0, Math.PI * 2);
		context.fill();
	}
}
