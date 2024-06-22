import { Node2D } from './Node2D';

export class Root2D extends Node2D {
	public override _cascadeDraw(context: CanvasRenderingContext2D): void {
		context.clearRect(0, 0, this.engine.width, this.engine.height);
		super._cascadeDraw(context);
	}
}
