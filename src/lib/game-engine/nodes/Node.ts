import type { Engine } from '../Engine';
import type { Initialization } from '../types/engine';
import { Rect } from '../Rect';
import { Vector2 } from '../Vector2';

export class Node {
	public readonly children: { node: Node; layer: number }[] = [];
	public rect: Rect;
	public shouldDraw: boolean = true;
	public shouldProcess: boolean = true;
	private initialization: Initialization | null = null;

	public constructor(rect: Rect = new Rect()) {
		this.rect = rect;
	}

	private createUninitializedMessage(propertyAccess: string): string {
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

	protected onInitialized(): void {}
	protected process(delta: number): void {}
	protected draw(context: CanvasRenderingContext2D, mousePos: Vector2): void {}
	protected dispose(): void {}

	public _cascadeInitialized(initialization: Initialization): void {
		if (!this.initialization) {
			console.log(`initializing node '${this.toString()}'`);
			this.initialization = initialization;
			this.onInitialized();
		}

		this.children.forEach((c) => {
			c.node._cascadeInitialized(initialization);
		});
	}

	public _cascadeProcess(delta: number): void {
		if (this.shouldProcess) {
			this.process(delta);
			this.children
				.toSorted((a, b) => a.layer - b.layer)
				.forEach((c) => {
					c.node._cascadeProcess(delta);
				});
		}
	}

	public _cascadeDraw(context: CanvasRenderingContext2D, mousePos: Vector2): void {
		if (this.shouldDraw) {
			this.children
				.toSorted((a, b) => a.layer - b.layer)
				.forEach((c) => {
					c.node._cascadeDraw(context, mousePos);
				});

			context.save();
			this.draw(context, mousePos);
			context.restore();
		}
	}

	public _cascadeDispose(): void {
		this.children.forEach((c) => {
			c.node._cascadeDispose();
		});
		console.log(`disposing node '${this.toString()}'`);
		this.dispose();
		this.initialization = null;
	}

	public addChild(node: Node, layer: number = 1): void {
		this.children.push({ node: node, layer: layer });
		if (this.initialization) {
			node._cascadeInitialized(this.initialization);
		}
	}

	public removeChild(node: Node): void {
		const index = this.children.findIndex((x) => x.node == node);
		if (index > -1) {
			this.children.splice(index, 1);
		}
		node._cascadeDispose();
	}

	public hasChild(node: Node): boolean {
		return this.children.findIndex((x) => x.node == node) != -1;
	}

	public toString(): string {
		return this.constructor.name;
	}
}
