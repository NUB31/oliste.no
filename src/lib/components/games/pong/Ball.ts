import { Vector2 } from '$lib/game-engine/Vector2';
import type { Paddle } from './Paddle';
import type { Board } from './Board';
import { SpriteNode } from '$lib/game-engine/nodes/SpriteNode';
import { Rect } from '$lib/game-engine/Rect';
import { ColorTexture } from '$lib/game-engine/textures/ColorTexture';

export class Ball extends SpriteNode {
	private direction: Vector2;
	private paddles: Paddle[];
	private board: Board;

	public constructor(board: Board, paddles: Paddle[]) {
		super(new Rect(Vector2.ZERO, 20, 20), new ColorTexture('white', 10));
		this.direction = Vector2.ZERO;
		this.paddles = paddles;
		this.board = board;
		this.reset();
	}

	public reset() {
		this.direction = new Vector2(1, 0).normalize();
		this.rect.position = new Vector2(this.board.rect.width / 2, this.board.rect.height / 2);
	}

	protected override process(delta: number): void {
		if (!this.board.started) {
			return;
		}

		if (
			this.rect.position.x <= this.board.rect.position.x ||
			this.rect.position.x + this.rect.width >= this.board.rect.position.x + this.board.rect.width
		) {
			this.board.stop();
			return;
		}

		if (this.rect.position.y <= this.board.rect.position.y) {
			this.rect.position.y = this.board.rect.position.y;
			this.direction.y = -this.direction.y;
		}

		if (
			this.rect.position.y + this.rect.height >=
			this.board.rect.position.y + this.board.rect.height
		) {
			this.rect.position.y = this.board.rect.position.y + this.board.rect.height - this.rect.height;
			this.direction.y = -this.direction.y;
		}

		this.paddles.forEach((paddle) => {
			if (paddle.rect.intersects(this.rect)) {
				this.direction.x = -this.direction.x;

				const middlePoint = this.rect.position.y + this.rect.height / 2;
				const paddleMiddle = paddle.rect.position.y + paddle.rect.height / 2;
				const impactFactor = (middlePoint - paddleMiddle) / (paddle.rect.height / 2);

				this.direction.y += impactFactor;
				this.direction = this.direction.normalize();

				if (this.direction.x > 0) {
					this.rect.position.x = paddle.rect.position.x + paddle.rect.width;
				} else {
					this.rect.position.x = paddle.rect.position.x - this.rect.width;
				}

				this.board.addPoint();
			}
		});

		this.rect.position.add(this.direction, delta);
	}
}
