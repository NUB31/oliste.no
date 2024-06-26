import type { Engine } from '../Engine';
import type { Initialization } from '../types/engine';
import { Rect } from '../Rect';
import { Vector2 } from '../Vector2';

export class Node {
	protected readonly children: Node[] = [];
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

	protected get engine(): Engine {
		if (this.initialization == null) {
			throw new Error(this.createUninitializedMessage('engine'));
		}

		return this.initialization.engine;
	}

	protected get root(): Node {
		if (this.initialization == null) {
			throw new Error(this.createUninitializedMessage('root'));
		}

		return this.initialization.root;
	}

	protected onInitialized() {}
	protected process(delta: number): void {}
	protected draw(context: CanvasRenderingContext2D, mousePos: Vector2): void {}
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

	public _cascadeDraw(context: CanvasRenderingContext2D, mousePos: Vector2): void {
		if (this.shouldDraw) {
			this.children.forEach((c) => {
				c._cascadeDraw(context, mousePos);
			});

			context.save();
			this.draw(context, mousePos);
			context.restore();
		}
	}

	public _cascadeDispose() {
		this.children.forEach((c) => {
			c.dispose();
		});
		this.dispose();
	}

	public addChild(node: Node) {
		this.children.push(node);
		if (this.initialization) {
			node._cascadeInitialized(this.initialization);
		}
	}

	public removeChild(node: Node) {
		const index = this.children.indexOf(node);
		if (index > -1) {
			this.children.splice(index, 1);
		}
	}

	public toString() {
		return this.constructor.name;
	}
}
