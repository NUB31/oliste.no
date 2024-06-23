import type { Rect } from '../Rect';

export interface ITexture {
	draw(context: CanvasRenderingContext2D, rect: Rect): void;
}
