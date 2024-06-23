import type { Rect } from '../Rect';
import type { ITexture } from './ITexture';

export class ImageTexture implements ITexture {
	private image: CanvasImageSource;
	private rect: Rect;

	public constructor(image: CanvasImageSource, rect: Rect) {
		this.image = image;
		this.rect = rect;
	}

	public draw(context: CanvasRenderingContext2D): void {
		context.drawImage(
			this.image,
			this.rect.position.x,
			this.rect.position.y,
			this.rect.width,
			this.rect.height
		);
	}
}
