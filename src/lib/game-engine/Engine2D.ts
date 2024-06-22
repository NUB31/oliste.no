import { Root2D } from './nodes/Root2D';
import { EventHandler } from './EventHandler';

export type Initialization = {
	engine: Engine2D;
	root: Root2D;
};

export class Engine2D {
	public readonly eventHandler: EventHandler;
	public readonly root: Root2D;
	public readonly context: CanvasRenderingContext2D;
	public readonly width: number;
	public readonly height: number;
	private lastTick: number;
	private btf: boolean;

	public constructor(
		canvas: HTMLCanvasElement,
		width: number,
		height: number,
		btf: boolean = true
	) {
		this.lastTick = Date.now();
		this.btf = btf;
		this.root = new Root2D();
		this.root._cascadeInitialized({
			engine: this,
			root: this.root
		});

		this.width = width;
		this.height = height;
		canvas.width = this.width;
		canvas.height = this.height;

		const ctx = canvas.getContext('2d');
		if (!ctx) {
			throw new Error('Canvas 2d context is null');
		}
		this.context = ctx;

		this.eventHandler = new EventHandler();

		this.loop = this.loop.bind(this);
		requestAnimationFrame(this.loop);
	}

	private loop() {
		requestAnimationFrame(this.loop);
		const now = Date.now();
		const delta = now - this.lastTick;
		this.lastTick = now;

		this.root._cascadeProcess(delta);
		this.root._cascadeDraw(this.context, this.btf);
		this.eventHandler.tick();
	}

	public dispose() {
		this.eventHandler._dispose();
		this.root._cascadeDispose();
	}
}
