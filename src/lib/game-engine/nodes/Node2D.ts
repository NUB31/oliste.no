import type { Engine2D, Initialization } from '../Engine2D';
import { Vector2D } from '../Vector2D';

export abstract class Node2D {
	protected readonly children: Node2D[] = [];
	public position: Vector2D;
	public width: number;
	public height: number;
	private initialization: Initialization | null = null;

	public constructor(position: Vector2D = Vector2D.ZERO, width: number = 0, height: number = 0) {
		this.position = position;
		this.width = width;
		this.height = height;
	}

	protected get engine(): Engine2D {
		if (this.initialization == null) {
			throw new Error(
				'Cannot access engine until node is initialized. You can use the engine safely in onInitialized() or process() as long as you have added this node as a (grand)child of the root node'
			);
		}

		return this.initialization.engine;
	}

	protected get root(): Node2D {
		if (this.initialization == null) {
			throw new Error(
				'Cannot access root until node is initialized. You can use the root safely in onInitialized() or process() as long as you have added this node as a (grand)child of the root node'
			);
		}

		return this.initialization.root;
	}

	protected onInitialized() {}
	protected process(delta: number): void {}
	protected draw(context: CanvasRenderingContext2D): void {}
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
		this.process(delta);
		this.children.forEach((c) => {
			c._cascadeProcess(delta);
		});
	}

	public _cascadeDraw(context: CanvasRenderingContext2D): void {
		context.fillStyle = 'black';
		context.shadowBlur = 0;

		this.draw(context);
		this.children.forEach((c) => {
			c._cascadeDraw(context);
		});
	}

	public _cascadeDispose() {
		this.children.forEach((c) => {
			c.dispose();
		});
		this.dispose();
	}

	public intersects(node: Node2D) {
		return (
			this.position.x < node.position.x + node.width &&
			this.position.x + this.width > node.position.x &&
			this.position.y < node.position.y + node.height &&
			this.position.y + this.height > node.position.y
		);
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
