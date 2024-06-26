import { Vector2 } from './Vector2';

export class Rect {
	public position: Vector2;
	public width: number;
	public height: number;

	public static ZERO(width: number = 0, height: number = 0) {
		return new Rect(Vector2.ZERO, width, height);
	}

	public constructor(position: Vector2 = Vector2.ZERO, width: number = 0, height: number = 0) {
		this.position = position;
		this.width = width;
		this.height = height;
	}

	public copy(): Rect {
		return new Rect(this.position.copy(), this.width, this.height);
	}

	public wrapsPosition(position: Vector2): boolean {
		return (
			position.x >= this.position.x &&
			position.x <= this.position.x + this.width &&
			position.y >= this.position.y &&
			position.y <= this.position.y + this.height
		);
	}

	public intersects(rect: Rect, tolerance: number = 0.0001): boolean {
		return (
			this.position.x < rect.position.x + rect.width + tolerance &&
			this.position.x + this.width > rect.position.x - tolerance &&
			this.position.y < rect.position.y + rect.height + tolerance &&
			this.position.y + this.height > rect.position.y - tolerance
		);
	}
}
