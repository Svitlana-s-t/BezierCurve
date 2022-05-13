class Point extends Observer {
	#x;
	#y;

	constructor(x, y) {
		super();

		this.#x = x;
		this.#y = y;
	}

	get x() {
		return this.#x;
	}

	set x(x) {
		this.#x = x;
		this.dispatch();
	}

	get y() {
		return this.#y;
	}

	set y(y) {
		this.#y = y;
		this.dispatch();
	}
}
