const Utils = Object.freeze({
	$: (selector, scope = document) => scope.querySelector(selector),
	$$: (selector, scope = document) => [...scope.querySelectorAll(selector)],

	debounce(callback, delay = 250) {
		let timer;
		return (...args) => {
			clearTimeout(timer);
			timer = setTimeout(() => callback(...args), delay);
		};
	},

	formatPrice(value) {
		return new Intl.NumberFormat("en-IN", {
			style: "currency",
			currency: "INR",
			maximumFractionDigits: 0,
		}).format(value);
	},

	getStorage(key, fallback = []) {
		try {
			const value = localStorage.getItem(key);
			return value ? JSON.parse(value) : fallback;
		} catch {
			return fallback;
		}
	},

	setStorage(key, value) {
		localStorage.setItem(key, JSON.stringify(value));
	},

	lockScroll() {
		document.body.classList.add("menu-open");
	},

	unlockScroll() {
		document.body.classList.remove("menu-open");
	},

	getParam(name) {
		return new URLSearchParams(window.location.search).get(name);
	},
});
