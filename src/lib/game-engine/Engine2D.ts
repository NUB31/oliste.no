import { EventHandler } from './EventHandler';
import { Label2D } from './nodes/ui/Label2D';
import { Node2D } from './nodes/Node2D';
import { Vector2D } from './Vector2D';
import { Rect } from './Rect';
import type { Cursor } from './types/engine';
import { SettingsNode } from './builtin/SettingsNode';
import { font } from './utils/font';
import { Button2D } from './nodes/ui/Button2D';

export class Engine2D {
	public readonly eventHandler: EventHandler;
	public readonly root: Node2D;
	public readonly context: CanvasRenderingContext2D;
	public readonly width: number;
	public readonly height: number;
	private readonly debugNode: Label2D;
	private readonly settingsNode: SettingsNode;
	private lastTick: number;

	public constructor(canvas: HTMLCanvasElement, width: number, height: number) {
		this.width = width;
		this.height = height;
		this.root = new Node2D();
		this.debugNode = new Label2D(new Rect(new Vector2D(this.width - 185, 10), 175, 100), '', {
			fontSize: 8,
			backgroundColor: 'hsl(0, 0%, 0%, 0.8)'
		});
		this.debugNode.shouldDraw = false;
		this.settingsNode = new SettingsNode(this.width, this.height);
		this.settingsNode.shouldDraw = false;

		canvas.width = this.width;
		canvas.height = this.height;

		const ctx = canvas.getContext('2d');
		if (!ctx) {
			throw new Error('Canvas 2d context is null');
		}
		this.context = ctx;
		this.eventHandler = new EventHandler(canvas);

		this.root.addChild(
			new Button2D(new Rect(new Vector2D(width / 2 - 75, 20), 150, 40), 'Settings', () => {
				this.settingsNode.shouldDraw = true;
				this.settingsNode.shouldProcess = true;
			})
		);
		this.root.addChild(this.settingsNode);
		this.root.addChild(this.debugNode);

		this.root._cascadeInitialized({
			engine: this,
			root: this.root
		});

		this.eventHandler.onKeyDown((key) => {
			if (key == 'f' && this.eventHandler.isKeyPressed('Control')) {
				this.debugNode.shouldDraw = !this.debugNode.shouldDraw;
				return true;
			} else {
				return false;
			}
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
					this.root._cascadeProcess(delta);
				});

				drawTime = this.measureTime(() => {
					this.context.clearRect(0, 0, this.width, this.height);
					this.root._cascadeDraw(this.context, this.eventHandler.getMousePos());
				});

				eventHandlerTime = this.measureTime(() => {
					this.eventHandler._process();
				});
			} else {
				this.drawLostFocus();
			}
		});

		if (this.debugNode.shouldDraw) {
			const debugLines: string[] = [
				`fps: ${Math.round(1000 / delta)}fps`,
				`delta: ${delta}ms`,
				`processing: ${Math.round(processTime)}ms`,
				`drawing: ${Math.round(drawTime)}ms`,
				`event handling: ${Math.round(eventHandlerTime)}ms`,
				`idle: ${Math.round(delta - totalTime)}ms`,
				`total: ${Math.round(totalTime)}ms`
			];

			this.debugNode.text = debugLines.join('\n');
		}

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
