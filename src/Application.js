class Application {
	constructor(params) {
		this.canvas = new Canvas({
			el: "canvas",
			width: 500,
			height: 500,
			backgound: "#d2d2d2",
		});

		this.mouse = new Mouse(this.canvas.el);
		this.camera = new Camera();

		this.pTimestamp = 0;

		this.container = [];
		this.tickHandlers = [];

		this.resize();
		window.addEventListener("resize", () => this.resize());

		requestAnimationFrame((x) => this.tick(x));
	}

	tick(timestamp) {
		requestAnimationFrame((x) => this.tick(x));

		if (this.mouse.over && this.mouse.delta) {
			const x = (app.mouse.x - app.camera.offsetX) / app.camera.scale;
			const y = (app.mouse.y - app.camera.offsetY) / app.camera.scale;

			this.camera.scale += this.mouse.delta * this.camera.scaleStep;

			app.camera.offsetX = -x * app.camera.scale + app.mouse.x;
			app.camera.offsetY = -y * app.camera.scale + app.mouse.y;
		}

		const diff = timestamp - this.pTimestamp;
		const secondPart = diff / 1000;
		const fps = 1000 / diff;

		this.pTimestamp = timestamp;

		for (const tickHandler of this.tickHandlers) {
			tickHandler({
				timestamp,
				diff,
				secondPart,
				fps,
			});
		}

		for (const item of this.container) {
			item.tick({
				timestamp,
				diff,
				secondPart,
				fps,
			});
		}

		this.canvas.clear();

		this.canvas.drawGrid({
			offsetX: this.camera.offsetX % (75 * this.camera.scale),
			offsetY: this.camera.offsetY % (75 * this.camera.scale),
			cellSize: 75 * this.camera.scale,
			lineWidth: 0.5,
			strokeStyle: "green",
		});

		this.canvas.save();
		this.canvas.translate(this.camera.offsetX, this.camera.offsetY);
		this.canvas.scale(this.camera.scale);

		for (const item of this.container) {
			item.draw(this.canvas);
		}

		this.canvas.restore();

		this.mouse.tick();
	}

	resize() {
		this.canvas.el.width = window.innerWidth;
		this.canvas.el.height = window.innerHeight;
	}
}
