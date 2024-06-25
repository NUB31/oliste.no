import { EventHandler } from './EventHandler';
import { Node2D } from './nodes/Node2D';
import { Vector2D } from './Vector2D';
import { Rect } from './Rect';
import type { Cursor } from './types/engine';
import { font } from './utils/font';
import { EngineUINode } from './builtin/EngineUINode';
import { cssVar } from './utils/color';

class DebugInfo {
	public delta: number = 0;
	public processTime: number = 0;
	public drawTime: number = 0;
	public eventHandlerTime: number = 0;
	public totalTime: number = 0;
}

export class Engine2D {
	public readonly root: Node2D;
	private readonly engineUINode: Node2D;
	public readonly eventHandler: EventHandler;
	public readonly context: CanvasRenderingContext2D;
	public readonly width: number;
	public readonly height: number;
	public readonly debugInfo = new DebugInfo();
	public shouldProcess: boolean = true;

	private lastTick: number;

	public constructor(canvas: HTMLCanvasElement, width: number, height: number) {
		this.width = width;
		this.height = height;
		canvas.width = this.width;
		canvas.height = this.height;

		this.root = new Node2D(new Rect(Vector2D.ZERO, width, height));
		this.engineUINode = new EngineUINode(new Rect(Vector2D.ZERO, width, height));

		const ctx = canvas.getContext('2d');
		if (!ctx) {
			throw new Error('Canvas 2d context is null');
		}
		this.context = ctx;
		this.eventHandler = new EventHandler(canvas);

		this.root._cascadeInitialized({
			engine: this,
			root: this.root
		});

		this.engineUINode._cascadeInitialized({
			engine: this,
			root: this.root
		});

		this.lastTick = Date.now();
		this.loop = this.loop.bind(this);
		requestAnimationFrame(this.loop);
	}

	private measureTime(cb: () => void): number {
		const start = Date.now();
		cb();
		return Date.now() - start;
	}

	private loop() {
		const now = Date.now();
		const delta = now - this.lastTick;
		this.lastTick = now;

		let processTime = 0;
		let drawTime = 0;
		let eventHandlerTime = 0;

		const totalTime = this.measureTime(() => {
			if (document.activeElement === this.context.canvas) {
				processTime = this.measureTime(() => {
					if (this.shouldProcess) {
						this.root._cascadeProcess(delta);
					}
					this.engineUINode._cascadeProcess(delta);
				});

				drawTime = this.measureTime(() => {
					this.context.reset();
					this.context.fillStyle = cssVar('--light-300');
					this.context.fillRect(0, 0, this.width, this.height);

					this.root._cascadeDraw(this.context, this.eventHandler.getMousePos());
					this.engineUINode._cascadeDraw(this.context, this.eventHandler.getMousePos());
				});

				eventHandlerTime = this.measureTime(() => {
					this.eventHandler._process();
				});
			} else {
				this.drawLostFocus();
			}
		});

		this.debugInfo.delta = delta;
		this.debugInfo.drawTime = drawTime;
		this.debugInfo.eventHandlerTime = eventHandlerTime;
		this.debugInfo.processTime = processTime;
		this.debugInfo.totalTime = totalTime;

		requestAnimationFrame(this.loop);
	}

	private drawLostFocus() {
		this.root._cascadeDraw(this.context, this.eventHandler.getMousePos());
		this.context.fillStyle = 'hsl(0,0%,0%,0.9)';
		this.context.fillRect(0, 0, this.width, this.height);

		this.context.fillStyle = 'white';
		this.context.font = font(16);

		const missingFocusTitle = 'Game window not in focus';
		const measuredTitle = this.context.measureText(missingFocusTitle);
		this.context.fillText(
			missingFocusTitle,
			this.width / 2 - measuredTitle.width / 2,
			this.height / 4
		);

		const missingFocusBody = 'Click the game screen to capture input';
		const measuredBody = this.context.measureText(missingFocusBody);
		this.context.fillText(
			missingFocusBody,
			this.width / 2 - measuredBody.width / 2,
			this.height / 4 + measuredBody.fontBoundingBoxAscent + 5
		);
	}

	public _dispose() {
		this.eventHandler._dispose();
		this.root._cascadeDispose();
	}

	public setCursor(cursor: Cursor) {
		this.context.canvas.style.cursor = cursor;
	}

	public resetCursor() {
		this.context.canvas.style.cursor = 'auto';
	}
}
