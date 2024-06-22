import { Vector2D } from './Vector2D';

export class EventHandler {
	private wasPressedKeys: Set<string> = new Set<string>();
	private currentlyPressedKeys: Set<string> = new Set<string>();
	private keyDownHandlers: ((key: string) => void)[] = [];
	private keyUpHandlers: ((key: string) => void)[] = [];
	private mouseMoveHandlers: ((mousePos: Vector2D) => void)[] = [];
	private mouseDownHandlers: ((mousePos: Vector2D) => void)[] = [];
	private mouseUpHandlers: ((mousePos: Vector2D) => void)[] = [];
	private clickHandlers: ((mousePos: Vector2D) => void)[] = [];
	private mouseDown: boolean = false;
	private mousePos: Vector2D = Vector2D.ZERO;
	private canvas: HTMLElement;

	public constructor(canvas: HTMLElement) {
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleKeyUp = this.handleKeyUp.bind(this);
		this.handleMouseMove = this.handleMouseMove.bind(this);
		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleMouseUp = this.handleMouseUp.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this._process = this._process.bind(this);

		this.canvas = canvas;
		this.canvas.addEventListener('keydown', this.handleKeyDown);
		this.canvas.addEventListener('keyup', this.handleKeyUp);
		this.canvas.addEventListener('mousemove', this.handleMouseMove);
		this.canvas.addEventListener('mousedown', this.handleMouseDown);
		this.canvas.addEventListener('mouseup', this.handleMouseUp);
		this.canvas.addEventListener('click', this.handleClick);
		if (this.canvas.tabIndex < 0) {
			this.canvas.tabIndex = 0;
		}
	}

	public onKeyDown(handler: (key: string) => void): () => void {
		this.keyDownHandlers.push(handler);
		return () => this.keyDownHandlers.splice(this.keyDownHandlers.indexOf(handler));
	}

	public onKeyUp(handler: (key: string) => void): () => void {
		this.keyUpHandlers.push(handler);
		return () => this.keyUpHandlers.splice(this.keyUpHandlers.indexOf(handler));
	}

	public onMouseMove(handler: (mousePos: Vector2D) => void): () => void {
		this.mouseMoveHandlers.push(handler);
		return () => this.mouseMoveHandlers.splice(this.mouseMoveHandlers.indexOf(handler));
	}

	public onMouseDown(handler: (mousePos: Vector2D) => void): () => void {
		this.mouseDownHandlers.push(handler);
		return () => this.mouseDownHandlers.splice(this.mouseDownHandlers.indexOf(handler));
	}

	public onMouseUp(handler: (mousePos: Vector2D) => void): () => void {
		this.mouseUpHandlers.push(handler);
		return () => this.mouseUpHandlers.splice(this.mouseUpHandlers.indexOf(handler));
	}

	public onClick(handler: (mousePos: Vector2D) => void): () => void {
		this.clickHandlers.push(handler);
		return () => this.clickHandlers.splice(this.clickHandlers.indexOf(handler));
	}

	public wasKeyPressed(key: string): boolean {
		return this.wasPressedKeys.has(key);
	}

	public isKeyPressed(key: string): boolean {
		return this.currentlyPressedKeys.has(key);
	}

	public isMouseDown(): boolean {
		return this.mouseDown;
	}

	public getMousePos(): Vector2D {
		return this.mousePos.copy();
	}

	private handleKeyDown(e: KeyboardEvent): void {
		e.preventDefault();
		this.wasPressedKeys.add(e.key);
		this.currentlyPressedKeys.add(e.key);
		this.keyDownHandlers.forEach((handler) => handler(e.key));
	}

	private handleKeyUp(e: KeyboardEvent): void {
		e.preventDefault();
		this.currentlyPressedKeys.delete(e.key);
		this.keyUpHandlers.forEach((handler) => handler(e.key));
	}

	private handleMouseMove(e: MouseEvent): void {
		e.preventDefault();
		const rect = this.canvas.getBoundingClientRect();
		this.mousePos.x = e.clientX - rect.left;
		this.mousePos.y = e.clientY - rect.top;
		this.mouseMoveHandlers.forEach((handler) => handler(this.getMousePos()));
	}

	private handleMouseDown(e: MouseEvent): void {
		e.preventDefault();
		this.mouseDown = true;
		this.mouseDownHandlers.forEach((handler) => handler(this.getMousePos()));
	}

	private handleMouseUp(e: MouseEvent): void {
		e.preventDefault();
		this.mouseDown = false;
		this.mouseUpHandlers.forEach((handler) => handler(this.getMousePos()));
	}

	private handleClick(e: MouseEvent): void {
		e.preventDefault();
		if (document.activeElement != this.canvas) {
			this.canvas.focus();
			return;
		}

		this.clickHandlers.forEach((handler) => handler(this.getMousePos()));
	}

	public _process(): void {
		this.wasPressedKeys.clear();
	}

	public _dispose(): void {
		this.canvas.removeEventListener('keydown', this.handleKeyDown);
		this.canvas.removeEventListener('keyup', this.handleKeyUp);
		this.canvas.removeEventListener('mousemove', this.handleMouseMove);
		this.canvas.removeEventListener('mousedown', this.handleMouseDown);
		this.canvas.removeEventListener('mouseup', this.handleMouseUp);
		this.canvas.removeEventListener('click', this.handleClick);
	}
}
