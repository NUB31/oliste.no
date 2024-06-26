import { Rect } from '$lib/game-engine/Rect';
import { Vector2 } from '$lib/game-engine/Vector2';
import { SpriteNode } from '$lib/game-engine/nodes/SpriteNode';
import { ColorTexture } from '$lib/game-engine/textures/ColorTexture';
import type { Board } from './Board';

export class Paddle extends SpriteNode {
	public readonly upKey: string;
	public readonly downKey: string;
	private board: Board;

	public constructor(board: Board, upKey: string, downKey: string, color: string) {
		super(new Rect(Vector2.ZERO, 20, 100), new ColorTexture(color, 10));
		this.upKey = upKey;
		this.downKey = downKey;
		this.board = board;
	}

	public reset(x: number) {
		this.rect.position = new Vector2(x, this.board.rect.height / 2 - this.rect.height / 2);
	}

	protected override process(delta: number) {
		if (this.engine.eventHandler.isKeyPressed(this.upKey)) {
			if (this.rect.position.y >= 0) {
				this.rect.position.add(new Vector2(0, -1), delta);
			}
		}
		if (this.engine.eventHandler.isKeyPressed(this.downKey)) {
			if (this.rect.position.y + this.rect.height <= this.board.rect.height) {
				this.rect.position.add(new Vector2(0, 1), delta);
			}
		}
	}
}
