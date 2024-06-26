import { EventHandler } from './EventHandler';
import { Node } from './nodes/Node';
import type { Cursor } from './types/engine';
import { cssVar } from './utils/color';
import { RootNode } from './nodes/builtin/RootNode';
import { measureTime } from './utils/timer';
import { Debug } from './Debug';

export class Engine {
	public readonly eventHandler: EventHandler;
	public readonly context: CanvasRenderingContext2D;
	public readonly width: number;
	public readonly height: number;
	public readonly debug = new Debug();
	public readonly processBlockers: Set<string> = new Set<string>();

	private lastTick: number;
	private readonly internalRoot: RootNode;

	get root(): Node {
		return this.internalRoot.mainNode;
	}

	public constructor(canvas: HTMLCanvasElement, width: number, height: number) {
		this.loop = this.loop.bind(this);

		this.width = width;
		this.height = height;

		this.eventHandler = new EventHandler(canvas);
		this.context = this.initCanvas(canvas, width, height);

		this.internalRoot = new RootNode(width, height);
		this.internalRoot._cascadeInitialized({
			engine: this,
			root: this.internalRoot
		});

		this.lastTick = Date.now();
		this.loop();
	}

	private initCanvas(
		canvas: HTMLCanvasElement,
		width: number,
		height: number
	): CanvasRenderingContext2D {
		canvas.width = width;
		canvas.height = height;

		const ctx = canvas.getContext('2d');
		if (!ctx) {
			throw new Error('Canvas 2d context is null');
		}

		return ctx;
	}

	private loop() {
		const now = Date.now();
		const delta = now - this.lastTick;
		this.lastTick = now;

		let processTime = 0;
		let drawTime = 0;
		let eventHandlerTime = 0;

		const totalTime = measureTime(() => {
			processTime = measureTime(() => {
				this.internalRoot._cascadeProcess(delta);
			});

			drawTime = measureTime(() => {
				this.context.reset();
				this.context.fillStyle = cssVar('--light-300');
				this.context.fillRect(0, 0, this.width, this.height);

				this.internalRoot._cascadeDraw(this.context, this.eventHandler.getMousePos());
			});

			eventHandlerTime = measureTime(() => {
				this.eventHandler._process();
			});
		});

		this.debug.delta = delta;
		this.debug.drawTime = drawTime;
		this.debug.eventHandlerTime = eventHandlerTime;
		this.debug.processTime = processTime;
		this.debug.totalTime = totalTime;

		requestAnimationFrame(this.loop);
	}

	public setCursor(cursor: Cursor) {
		this.context.canvas.style.cursor = cursor;
	}

	public resetCursor() {
		this.context.canvas.style.cursor = 'auto';
	}

	public _dispose() {
		this.eventHandler._dispose();
		this.internalRoot._cascadeDispose();
	}
}
