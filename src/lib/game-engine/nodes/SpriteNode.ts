import type { Vector2 } from '../Vector2';
import { Node } from './Node';
import { Rect } from '../Rect';
import type { ITexture } from '../textures/ITexture';

export class SpriteNode extends Node {
	private texture: ITexture;

	public constructor(rect: Rect, texture: ITexture) {
		super(rect);
		this.texture = texture;
	}

	protected override draw(context: CanvasRenderingContext2D, mousePos: Vector2): void {
		this.texture.draw(context, this.rect);
	}
}
