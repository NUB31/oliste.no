import type { Vector2D } from '../Vector2D';
import { Node2D } from './Node2D';
import { Rect } from '../Rect';
import type { ITexture } from '../textures/Texture';

export class Sprite2D extends Node2D {
	private texture: ITexture;

	public constructor(rect: Rect, texture: ITexture) {
		super(rect);
		this.texture = texture;
	}

	protected override draw(context: CanvasRenderingContext2D, mousePos: Vector2D): void {
		this.texture.draw(context, this.rect);
	}
}
