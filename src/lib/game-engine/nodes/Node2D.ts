import type { Engine2D } from '../Engine2D';
import type { Initialization } from '../types/engine';
import { Rect } from '../Rect';
import { Vector2D } from '../Vector2D';

export class Node2D {
	protected readonly children: Node2D[] = [];
	private initialization: Initialization | null = null;
	public rect: Rect;
	public shouldDraw: boolean = true;
	public shouldProcess: boolean = true;

	public constructor(rect: Rect = new Rect()) {
		this.rect = rect;
	}

	private createUninitializedMessage(propertyAccess: string) {
		return `Cannot access {${propertyAccess}} until node is initialized. You can use the {${propertyAccess}} safely in onInitialized() or process() as long as you have added this node as a (grand)child of the root node`;
	}

	protected get engine(): Engine2D {
		if (this.initialization == null) {
			throw new Error(this.createUninitializedMessage('engine'));
		}

		return this.initialization.engine;
	}

	protected get root(): Node2D {
		if (this.initialization == null) {
			throw new Error(this.createUninitializedMessage('root'));
		}

		return this.initialization.root;
	}

	protected onInitialized() {}
	protected process(delta: number): void {}
	protected draw(context: CanvasRenderingContext2D, mousePos: Vector2D): void {}
	protected dispose(): void {}

	public _cascadeInitialized(initialization: Initialization) {
		console.log(`initializing node '${this.toString()}'`);
		if (!this.initialization) {
			this.initialization = initialization;
			this.onInitialized();
		}

		this.children.forEach((c) => {
			c._cascadeInitialized(initialization);
		});
	}

	public _cascadeProcess(delta: number) {
		if (this.shouldProcess) {
			this.process(delta);
			this.children.forEach((c) => {
				c._cascadeProcess(delta);
			});
		}
	}

	public _cascadeDraw(context: CanvasRenderingContext2D, mousePos: Vector2D): void {
		context.fillStyle = 'black';
		context.shadowBlur = 0;

		if (this.shouldDraw) {
			this.children.forEach((c) => {
				c._cascadeDraw(context, mousePos);
			});

			this.draw(context, mousePos);
		}
	}

	public _cascadeDispose() {
		this.children.forEach((c) => {
			c.dispose();
		});
		this.dispose();
	}

	public addChild(node: Node2D) {
		this.children.push(node);
		if (this.initialization) {
			node._cascadeInitialized(this.initialization);
		}
	}

	public removeChild(node: Node2D) {
		const index = this.children.indexOf(node);
		if (index > -1) {
			this.children.splice(index, 1);
		}
	}

	public toString() {
		return this.constructor.name;
	}
}
