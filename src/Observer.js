class Observer {
	constructor() {
		this.handlers = [];
	}

	dispatch() {
		for (const handler of this.handlers) {
			handler();
		}
	}

	subscribe(handler) {
		this.handlers.push(handler);

		return () => {
			if (this.handlers.includes(handler)) {
				const index = this.handlers.indexOf(handler);
				this.handlers.splice(index, 1);
			}
		};
	}
}
