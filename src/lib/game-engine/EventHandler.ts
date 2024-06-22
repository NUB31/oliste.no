export class EventHandler {
	private wasPressedKeys = new Set<string>();
	private currentlyPressedKeys = new Set<string>();
	private preventDefaultKeys = new Set<string>();
	private keyHandlers: ((e: KeyboardEvent) => void)[] = [];

	public constructor() {
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleKeyUp = this.handleKeyUp.bind(this);
		this.tick = this.tick.bind(this);

		window.addEventListener('keydown', this.handleKeyDown);
		window.addEventListener('keyup', this.handleKeyUp);
	}

	public onKeydown(handler: (e: KeyboardEvent) => void): void {
		this.keyHandlers.push(handler);
	}

	public wasPressed(key: string): boolean {
		return this.wasPressedKeys.has(key);
	}

	public isPressed(key: string): boolean {
		return this.currentlyPressedKeys.has(key);
	}

	public preventDefault(key: string): void {
		this.preventDefaultKeys.add(key);
	}

	private handleKeyDown(e: KeyboardEvent): void {
		if (this.preventDefaultKeys.has(e.key)) {
			e.preventDefault();
		}

		this.wasPressedKeys.add(e.key);
		this.currentlyPressedKeys.add(e.key);
	}

	private handleKeyUp(e: KeyboardEvent): void {
		if (this.preventDefaultKeys.has(e.key)) {
			e.preventDefault();
		}

		this.keyHandlers.forEach((handler) => handler(e));
		this.currentlyPressedKeys.delete(e.key);
	}

	public tick(): void {
		this.wasPressedKeys.clear();
	}

	public _dispose(): void {
		window.removeEventListener('keydown', this.handleKeyDown);
		window.removeEventListener('keyup', this.handleKeyUp);
	}
}
