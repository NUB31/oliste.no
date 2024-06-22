import { Node2D } from './Node2D';

export class Root2D extends Node2D {
	protected override draw(context: CanvasRenderingContext2D): void {
		context.clearRect(0, 0, this.engine.width ?? 0, this.engine.height ?? 0);
	}
}
