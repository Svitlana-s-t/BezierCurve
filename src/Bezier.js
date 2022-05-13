class Bezier {
	#curve = [];
	#newState = false;

	constructor(params) {
		this.nodes = [];

		this.#curve = [];
		this.#newState = false;

		this.step = params.step;
		this.showCtrlPoints = params.showCtrlPoints ?? true;
		this.showCtrlLines = params.showCtrlLines ?? true;
		this.part = 0;

		this.animation = params.animation ?? false;
		this.part = 1;
		this.speed = 1 / 2;

		this.colors = params.colors ?? ["red"];

		this.add(...params.nodes);
	}

	add(...nodes) {
		for (const node of nodes) {
			if (!this.nodes.includes(node)) {
				this.nodes.push(node);

				node.subscribe(() => (this.#newState = true));

				this.#newState = true;
			}
		}
	}

	remove() {}

	get curve() {
		return JSON.parse(JSON.stringify(this.#curve));
	}

	static getCurve(nodes, step) {
		const result = [];
		const n = nodes.length - 1;

		for (let t = 0; t <= 1; t = Math.min(1, t + step)) {
			const point = {
				x: 0,
				y: 0,
			};

			for (let k = 0; k <= n; k++) {
				const b = C(n, k) * t ** k * (1 - t) ** (n - k);
				const node = nodes[k];

				point.x += node.x * b;
				point.y += node.y * b;
			}

			result.push(point);

			if (t === 1) {
				break;
			}
		}

		return result;
	}

	// static getCurve(originalNodes, step) {
	// 	const result = [];

	// 	for (let part = 0; part <= 1; part = Math.min(1, part + step)) {
	// 		let nodes = originalNodes;

	// 		while (nodes.length > 1) {
	// 			const newNodes = [];

	// 			for (let i = 0; i < nodes.length - 1; i++) {
	// 				newNodes.push(
	// 					getPointBetween(
	// 						nodes[i].x,
	// 						nodes[i].y,
	// 						nodes[i + 1].x,
	// 						nodes[i + 1].y,
	// 						part
	// 					)
	// 				);
	// 			}

	// 			nodes = newNodes;
	// 		}

	// 		result.push(nodes[0]);

	// 		if (part === 1) {
	// 			break;
	// 		}
	// 	}

	// 	return result;
	// }

	tick({ secondPart }) {
		if (this.#newState) {
			this.#curve = Bezier.getCurve(this.nodes, this.step);
		}

		if (this.animation) {
			if (this.speed > 0) {
				this.part = Math.min(1, this.part + secondPart * this.speed);

				if (this.part === 1) {
					this.speed *= -1;
				}
			} else {
				this.part = Math.max(0, this.part + secondPart * this.speed);

				if (this.part === 0) {
					this.speed *= -1;
				}
			}
		}
	}

	draw(canvas) {
		// if (this.showCtrlPoints) {
		// 	for (const node of this.nodes) {
		// 		canvas.drawCircle({
		// 			x: node.x,
		// 			y: node.y,
		// 			r: 5,
		// 			fillStyle: "red",
		// 		});
		// 	}
		// }

		// if (this.showCtrlLines) {
		// for (let i = 0; i < this.nodes.length - 1; i++) {
		// 	canvas.drawLine({
		// 		x1: this.nodes[i].x,
		// 		y1: this.nodes[i].y,
		// 		x2: this.nodes[i + 1].x,
		// 		y2: this.nodes[i + 1].y,
		// 		strokeStyle: "red",
		// 		lineWidth: 1.5,
		// 	});
		// }
		// }

		const curveLength = getCurveLength(
			this.#curve.slice(0, this.#curve.length)
		);

		const curveLengthPart = getCurveLength(
			this.#curve.slice(0, this.part * this.#curve.length)
		);

		const { context } = canvas;

		let nodes = this.nodes;
		for (let i = 0; i < this.nodes.length; i++) {
			const color = this.colors[i % this.colors.length];

			for (const node of nodes) {
				canvas.drawCircle({
					x: node.x,
					y: node.y,
					r: 5,
					fillStyle: color,
				});
			}

			if (nodes.length > 1) {
				for (let i = 0; i < nodes.length - 1; i++) {
					canvas.drawLine({
						x1: nodes[i].x,
						y1: nodes[i].y,
						x2: nodes[i + 1].x,
						y2: nodes[i + 1].y,
						strokeStyle: color,
						lineWidth: 1.5,
					});
				}

				const newNodes = [];

				for (let i = 0; i < nodes.length - 1; i++) {
					newNodes.push(
						getPointBetween(
							nodes[i].x,
							nodes[i].y,
							nodes[i + 1].x,
							nodes[i + 1].y,
							this.part
						)
					);
				}

				nodes = newNodes;
			}

			if (!this.animation) {
				break;
			}
		}

		context.beginPath();
		context.moveTo(this.#curve[0].x, this.#curve[0].y);

		for (let i = 1; i < this.#curve.length; i++) {
			context.lineTo(this.#curve[i].x, this.#curve[i].y);
		}

		context.strokeStyle = "black";
		context.lineWidth = 2;
		context.setLineDash([curveLengthPart, curveLength]);
		context.stroke();
	}

	getPointUnder(x, y) {
		for (const node of this.nodes) {
			const dist = getDist(x, y, node.x, node.y);

			if (dist <= 5) {
				return node;
			}
		}
	}
}
