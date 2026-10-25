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

	escapeHTML(value) {
		return String(value ?? "").replace(
			/[&<>"']/g,
			(character) =>
				({
					"&": "&amp;",
					"<": "&lt;",
					">": "&gt;",
					'"': "&quot;",
					"'": "&#039;",
				})[character],
		);
	},

	imageFallback(label = "Pure Pixel") {
		const initials = String(label)
			.split(/\s+/)
			.map((word) => word[0])
			.join("")
			.slice(0, 2)
			.toUpperCase();
		const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 900"><rect width="900" height="900" fill="#c7ff3d"/><circle cx="710" cy="160" r="220" fill="#ff4f9a"/><path d="M0 720 260 480l190 160 160-130 290 250v140H0Z" fill="#566dff"/><text x="70" y="170" font-family="Arial Black,Arial" font-size="92" fill="#151515">${initials}</text><text x="70" y="820" font-family="Arial Black,Arial" font-size="34" fill="#151515">PURE PIXEL</text></svg>`;
		return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
	},

	bindImageFallbacks(scope = document) {
		this.$$("img[data-fallback], img[alt]", scope).forEach((image) => {
			const fallback = this.imageFallback(image.dataset.fallback || image.alt);
			const replace = () => {
				if (image.dataset.fallbackApplied) return;
				image.dataset.fallbackApplied = "true";
				image.src = fallback;
				image.classList.add("is-fallback");
			};
			image.addEventListener("error", replace, { once: true });
			if (image.complete && image.naturalWidth === 0) replace();
		});
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
		try {
			localStorage.setItem(key, JSON.stringify(value));
			return true;
		} catch {
			return false;
		}
	},

	toast(message, tone = "success") {
		let region = this.$("#toast-region");
		if (!region) {
			region = document.createElement("div");
			region.id = "toast-region";
			region.className = "toast-region";
			region.setAttribute("aria-live", "polite");
			document.body.append(region);
		}
		const toast = document.createElement("div");
		toast.className = `toast${tone === "error" ? " toast--error" : ""}`;
		toast.setAttribute("role", "status");
		toast.textContent = message;
		region.append(toast);
		setTimeout(() => toast.remove(), 3200);
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
