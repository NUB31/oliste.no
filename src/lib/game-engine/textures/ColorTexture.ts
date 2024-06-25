import type { Rect } from '../Rect';
import type { ITexture } from './ITexture';

export class ColorTexture implements ITexture {
	public color: string;
	public cornerRadius: number;

	public constructor(color: string, cornerRadius: number = 0) {
		this.color = color;
		this.cornerRadius = cornerRadius;
	}

	public draw(context: CanvasRenderingContext2D, rect: Rect): void {
		context.fillStyle = this.color;

		context.beginPath();
		context.moveTo(rect.position.x + this.cornerRadius, rect.position.y);
		context.lineTo(rect.position.x + rect.width - this.cornerRadius, rect.position.y);
		context.quadraticCurveTo(
			rect.position.x + rect.width,
			rect.position.y,
			rect.position.x + rect.width,
			rect.position.y + this.cornerRadius
		);
		context.lineTo(rect.position.x + rect.width, rect.position.y + rect.height - this.cornerRadius);
		context.quadraticCurveTo(
			rect.position.x + rect.width,
			rect.position.y + rect.height,
			rect.position.x + rect.width - this.cornerRadius,
			rect.position.y + rect.height
		);
		context.lineTo(rect.position.x + this.cornerRadius, rect.position.y + rect.height);
		context.quadraticCurveTo(
			rect.position.x,
			rect.position.y + rect.height,
			rect.position.x,
			rect.position.y + rect.height - this.cornerRadius
		);
		context.lineTo(rect.position.x, rect.position.y + this.cornerRadius);
		context.quadraticCurveTo(
			rect.position.x,
			rect.position.y,
			rect.position.x + this.cornerRadius,
			rect.position.y
		);
		context.closePath();
		context.fill();
	}
}
