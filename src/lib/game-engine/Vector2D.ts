export class Vector2D {
	public static get ZERO(): Vector2D {
		return new Vector2D(0, 0);
	}

	public static get ONE(): Vector2D {
		return new Vector2D(1, 1);
	}

	public static random(
		minX: number = 0,
		maxX: number = 1,
		minY: number = 0,
		maxY: number = 1
	): Vector2D {
		const x = Math.random() * (maxX - minX) + minX;
		const y = Math.random() * (maxY - minY) + minY;
		return new Vector2D(x, y);
	}

	public x: number;
	public y: number;

	public constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	public copy(): Vector2D {
		return new Vector2D(this.x, this.y);
	}

	public align(alignment: number): Vector2D {
		this.x = Math.round(this.x / alignment) * alignment;
		this.y = Math.round(this.y / alignment) * alignment;
		return this;
	}

	public add(vector: Vector2D, delta: number = 1): Vector2D {
		this.x += vector.x * delta;
		this.y += vector.y * delta;
		return this;
	}

	public subtract(vector: Vector2D, delta: number = 1): Vector2D {
		this.x -= vector.x * delta;
		this.y -= vector.y * delta;
		return this;
	}

	public scale(factor: number): Vector2D {
		this.x *= factor;
		this.y *= factor;
		return this;
	}

	public divide(factor: number): Vector2D {
		this.x /= factor;
		this.y /= factor;
		return this;
	}

	public length(): number {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	public normalize(): Vector2D {
		const length = this.length();
		if (length === 0) {
			return Vector2D.ZERO;
		}
		this.x /= length;
		this.y /= length;
		return this;
	}

	public dot(vector: Vector2D): number {
		return this.x * vector.x + this.y * vector.y;
	}

	public cross(vector: Vector2D): number {
		return this.x * vector.y - this.y * vector.x;
	}

	public distance(vector: Vector2D): number {
		return Math.sqrt((this.x - vector.x) ** 2 + (this.y - vector.y) ** 2);
	}

	public angle(vector: Vector2D): number {
		const dot = this.dot(vector);
		const mag1 = this.length();
		const mag2 = vector.length();
		return Math.acos(dot / (mag1 * mag2));
	}

	public equals(vector: Vector2D): boolean {
		return this.x === vector.x && this.y === vector.y;
	}

	public toString(): string {
		return `Vector2D(${this.x}, ${this.y})`;
	}

	// Static methods for common operations
	public static add(v1: Vector2D, v2: Vector2D): Vector2D {
		return new Vector2D(v1.x + v2.x, v1.y + v2.y);
	}

	public static subtract(v1: Vector2D, v2: Vector2D): Vector2D {
		return new Vector2D(v1.x - v2.x, v1.y - v2.y);
	}

	public static scale(v: Vector2D, factor: number): Vector2D {
		return new Vector2D(v.x * factor, v.y * factor);
	}

	public static divide(v: Vector2D, factor: number): Vector2D {
		return new Vector2D(v.x / factor, v.y / factor);
	}

	public static dot(v1: Vector2D, v2: Vector2D): number {
		return v1.x * v2.x + v1.y * v2.y;
	}

	public static cross(v1: Vector2D, v2: Vector2D): number {
		return v1.x * v2.y - v1.y * v2.x;
	}

	public static distance(v1: Vector2D, v2: Vector2D): number {
		return Math.sqrt((v1.x - v2.x) ** 2 + (v1.y - v2.y) ** 2);
	}

	public static angle(v1: Vector2D, v2: Vector2D): number {
		const dot = Vector2D.dot(v1, v2);
		const mag1 = v1.length();
		const mag2 = v2.length();
		return Math.acos(dot / (mag1 * mag2));
	}
}
