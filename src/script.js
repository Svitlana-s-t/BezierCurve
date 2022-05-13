const app = new Application({
	el: "canvas",
	width: 500,
	height: 500,
	backgound: "#d2d2d2",
});

const bezier = new Bezier({
	step: 0.001,
	// showCtrlLines: false,
	// showCtrlPoints: false,
	nodes: [new Point(100, 100), new Point(200, 200), new Point(300, 300)],
	colors: ["red", "green", "blue", "pink"],
	animation: false,
});

app.container.push(bezier);

let pointUnderMouse = null;
app.tickHandlers.push(() => {
	if (app.mouse.over && app.mouse.click && bezier.showCtrlPoints) {
		pointUnderMouse = bezier.getPointUnder(
			(app.mouse.x - app.camera.offsetX) / app.camera.scale,
			(app.mouse.y - app.camera.offsetY) / app.camera.scale
		);
	}

	if (!pointUnderMouse && app.mouse.left) {
		app.camera.offsetX += app.mouse.dx;
		app.camera.offsetY += app.mouse.dy;
	}

	if (!app.mouse.left) {
		pointUnderMouse = null;
	}

	if (app.mouse.over && pointUnderMouse) {
		pointUnderMouse.x = (app.mouse.x - app.camera.offsetX) / app.camera.scale;
		pointUnderMouse.y = (app.mouse.y - app.camera.offsetY) / app.camera.scale;
	}
});

app.tickHandlers.push(() => {
	const modal = document.querySelector("#modal");

	const table = document.createElement("table");
	for (const node of bezier.nodes) {
		const tr = document.createElement("tr");
		table.append(tr);

		tr.innerHTML = `
			<td>${node.x}</td>
			<td>${node.y}</td>
		`;
	}

	modal.innerHTML = "";
	modal.append(table);
});
