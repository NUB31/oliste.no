import { Vector2 } from './Vector2';

export class EventHandler {
	public readonly _wasPressedKeys: Set<string> = new Set<string>();
	public readonly _currentlyPressedKeys: Set<string> = new Set<string>();
	public readonly _keyDownHandlers: ((key: string) => boolean)[] = [];
	public readonly _keyUpHandlers: ((key: string) => boolean)[] = [];
	public readonly _mouseMoveHandlers: ((mousePos: Vector2) => boolean)[] = [];
	public readonly _mouseDownHandlers: ((mousePos: Vector2) => boolean)[] = [];
	public readonly _mouseUpHandlers: ((mousePos: Vector2) => boolean)[] = [];
	public readonly _clickHandlers: ((mousePos: Vector2) => boolean)[] = [];

	public readonly mousePos: Vector2 = Vector2.ZERO;
	public mouseDown: boolean = false;

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

	public onKeyDown(handler: (key: string) => boolean): () => void {
		this._keyDownHandlers.push(handler);
		return () => this._keyDownHandlers.splice(this._keyDownHandlers.indexOf(handler));
	}

	public onKeyUp(handler: (key: string) => boolean): () => void {
		this._keyUpHandlers.push(handler);
		return () => this._keyUpHandlers.splice(this._keyUpHandlers.indexOf(handler));
	}

	public onMouseMove(handler: (mousePos: Vector2) => boolean): () => void {
		this._mouseMoveHandlers.push(handler);
		return () => this._mouseMoveHandlers.splice(this._mouseMoveHandlers.indexOf(handler));
	}

	public onMouseDown(handler: (mousePos: Vector2) => boolean): () => void {
		this._mouseDownHandlers.push(handler);
		return () => this._mouseDownHandlers.splice(this._mouseDownHandlers.indexOf(handler));
	}

	public onMouseUp(handler: (mousePos: Vector2) => boolean): () => void {
		this._mouseUpHandlers.push(handler);
		return () => this._mouseUpHandlers.splice(this._mouseUpHandlers.indexOf(handler));
	}

	public onClick(handler: (mousePos: Vector2) => boolean): () => void {
		this._clickHandlers.push(handler);
		return () => this._clickHandlers.splice(this._clickHandlers.indexOf(handler));
	}

	public wasKeyPressed(key: string): boolean {
		return this._wasPressedKeys.has(key);
	}

	public isKeyPressed(key: string): boolean {
		return this._currentlyPressedKeys.has(key);
	}

	public getMousePos(): Vector2 {
		return this.mousePos.copy();
	}

	private handleKeyDown(e: KeyboardEvent): void {
		e.preventDefault();
		this._wasPressedKeys.add(e.key);
		this._currentlyPressedKeys.add(e.key);
		for (const handler of this._keyDownHandlers) {
			const consumed = handler(e.key);
			if (consumed) break;
		}
	}

	private handleKeyUp(e: KeyboardEvent): void {
		e.preventDefault();
		this._currentlyPressedKeys.delete(e.key);
		for (const handler of this._keyUpHandlers) {
			const consumed = handler(e.key);
			if (consumed) break;
		}
	}

	private handleMouseMove(e: MouseEvent): void {
		e.preventDefault();
		const rect = this.canvas.getBoundingClientRect();
		this.mousePos.x = e.clientX - rect.left;
		this.mousePos.y = e.clientY - rect.top;
		for (const handler of this._mouseMoveHandlers) {
			const consumed = handler(this.getMousePos());
			if (consumed) break;
		}
	}

	private handleMouseDown(e: MouseEvent): void {
		e.preventDefault();
		this.mouseDown = true;
		for (const handler of this._mouseDownHandlers) {
			const consumed = handler(this.getMousePos());
			if (consumed) break;
		}
	}

	private handleMouseUp(e: MouseEvent): void {
		e.preventDefault();
		this.mouseDown = false;
		for (const handler of this._mouseUpHandlers) {
			const consumed = handler(this.getMousePos());
			if (consumed) break;
		}
	}

	private handleClick(e: MouseEvent): void {
		e.preventDefault();
		if (document.activeElement != this.canvas) {
			this.canvas.focus();
			return;
		}

		for (const handler of this._clickHandlers) {
			const consumed = handler(this.getMousePos());
			if (consumed) break;
		}
	}

	public _process(): void {
		this._wasPressedKeys.clear();
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
