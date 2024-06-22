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
	public readonly canvas: HTMLCanvasElement;
	public readonly width: number;
	public readonly height: number;
	private debugDisplay: boolean = false;
	private lastTick: number;

	public constructor(canvas: HTMLCanvasElement, width: number, height: number) {
		this.width = width;
		this.height = height;
		this.root = new Root2D();
		this.canvas = canvas;

		this.canvas.width = this.width;
		this.canvas.height = this.height;

		const ctx = this.canvas.getContext('2d');
		if (!ctx) {
			throw new Error('Canvas 2d context is null');
		}
		this.context = ctx;
		this.eventHandler = new EventHandler(canvas);

		this.root._cascadeInitialized({
			engine: this,
			root: this.root
		});

		this.eventHandler.onKeyDown((key) => {
			if (key == 'f' && this.eventHandler.isKeyPressed('Control')) {
				this.debugDisplay = !this.debugDisplay;
			}
		});

		this.lastTick = Date.now();
		this.loop = this.loop.bind(this);
		requestAnimationFrame(this.loop);
	}

	private loop() {
		const now = Date.now();
		const delta = now - this.lastTick;
		this.lastTick = now;

		if (document.activeElement === this.canvas) {
			this.tick(delta);
		} else {
			this.drawLostFocus();
		}

		if (this.debugDisplay) {
			this.drawDebug(delta);
		}

		requestAnimationFrame(this.loop);
	}

	private tick(delta: number) {
		this.root._cascadeProcess(delta);
		this.root._cascadeDraw(this.context);
		this.eventHandler._process();
	}

	private drawLostFocus() {
		this.root._cascadeDraw(this.context);
		this.context.fillStyle = 'hsl(0,0%,0%,0.9)';
		this.context.fillRect(0, 0, this.width, this.height);

		this.context.fillStyle = 'white';
		this.context.font = "16px 'Press Start 2P'";

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

	private drawDebug(delta: number) {
		this.context.font = "8px 'Press Start 2P'";

		const debugLines: string[] = [`delta: ${delta}ms`, `fps: ${Math.round(1000 / delta)}fps`];

		let height = 0;
		let width = 0;
		debugLines.forEach((line) => {
			const measured = this.context.measureText(line);
			height += measured.fontBoundingBoxAscent + 6;
			if (measured.width > width) {
				width = measured.width;
			}
		});

		this.context.fillStyle = 'hsl(0,0%,0%,0.8)';
		this.context.fillRect(this.width - width - 45, 15, width + 30, height + 15);

		this.context.fillStyle = 'white';
		debugLines.forEach((line, i) => {
			this.context.fillText(line, this.width - width - 30, 32 + (height / debugLines.length) * i);
		});
	}

	public _dispose() {
		this.eventHandler._dispose();
		this.root._cascadeDispose();
	}
}
