class Mouse {
	constructor(el) {
		this.x = 0;
		this.y = 0;

		this.pX = 0;
		this.pY = 0;

		this.dx = 0;
		this.dy = 0;

		this.cDelta = 0;
		this.pDelta = 0;
		this.delta = 0;

		this.left = false;
		this.pLeft = false;

		this.over = false;
		this.el = el;
		this.click = false;

		this.el.addEventListener("mouseenter", (e) => this.mouseenterHandler(e));
		this.el.addEventListener("mouseout", (e) => this.mouseoutHandler(e));
		this.el.addEventListener("mousemove", (e) => this.mousemoveHandler(e));

		this.el.addEventListener("mousedown", (e) => this.mousedownHandler(e));
		this.el.addEventListener("mouseup", (e) => this.mouseupHandler(e));
		this.el.addEventListener("wheel", (e) => this.wheelHandler(e));
	}

	tick() {
		this.click = !this.pLeft && this.left;
		this.pLeft = this.left;

		this.dx = this.x - this.pX;
		this.dy = this.y - this.pY;

		this.pX = this.x;
		this.pY = this.y;

		this.delta = this.cDelta - this.pDelta;
		this.pDelta = this.cDelta;
	}

	mouseenterHandler(event) {
		this.over = true;
	}

	mouseoutHandler(event) {
		this.over = false;
	}

	mousemoveHandler(event) {
		const rect = this.el.getBoundingClientRect();

		this.x = event.clientX - rect.left;
		this.y = event.clientY - rect.top;
	}

	mousedownHandler(event) {
		if (event.button === 0) {
			this.left = true;
		}
	}

	mouseupHandler(event) {
		if (event.button === 0) {
			this.left = false;
		}
	}

	wheelHandler(event) {
		this.cDelta += event.deltaY / 53;
	}
}
