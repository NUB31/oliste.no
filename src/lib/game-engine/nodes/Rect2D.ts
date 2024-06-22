import { Vector2D } from '../Vector2D';
import { Node2D } from './Node2D';

export class Rect2D extends Node2D {
	public width: number;
	public height: number;

	public constructor(position: Vector2D = Vector2D.ZERO, width: number, height: number) {
		super(position);
		this.width = width;
		this.height = height;
	}

	public wrapsPosition(position: Vector2D): boolean {
		return (
			position.x >= this.position.x &&
			position.x <= this.position.x + this.width &&
			position.y >= this.position.y &&
			position.y <= this.position.y + this.height
		);
	}

	public intersects(node: Rect2D, tolerance: number = 0.0001): boolean {
		return (
			this.position.x < node.position.x + node.width + tolerance &&
			this.position.x + this.width > node.position.x - tolerance &&
			this.position.y < node.position.y + node.height + tolerance &&
			this.position.y + this.height > node.position.y - tolerance
		);
	}
}
