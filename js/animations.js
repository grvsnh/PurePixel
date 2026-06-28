const Animations = {
	observer: null,

	init() {
		this.loader();
		this.navbar();
		this.progress();
		this.backToTop();
		this.cursor();
		this.refresh();
	},

	loader() {
		const loader = Utils.$("#loader");
		if (!loader) return;

		const hide = () => {
			setTimeout(() => loader.classList.add("is-hidden"), 250);
		};

		if (document.readyState === "complete") {
			hide();
			return;
		}

		window.addEventListener("load", hide, { once: true });
		setTimeout(hide, 1800);
	},

	navbar() {
		const navbar = Utils.$("#navbar");
		if (!navbar) return;
		const update = () =>
			navbar.classList.toggle("is-scrolled", window.scrollY > 12);
		update();
		window.addEventListener("scroll", update, { passive: true });
	},

	progress() {
		const bar = Utils.$("#scroll-progress");
		if (!bar) return;
		window.addEventListener(
			"scroll",
			() => {
				const height =
					document.documentElement.scrollHeight - window.innerHeight;
				bar.style.width = `${height ? (window.scrollY / height) * 100 : 0}%`;
			},
			{ passive: true },
		);
	},

	backToTop() {
		const button = Utils.$("#back-to-top");
		if (!button) return;
		button.addEventListener("click", () =>
			window.scrollTo({ top: 0, behavior: "smooth" }),
		);
		window.addEventListener(
			"scroll",
			() => {
				button.classList.toggle("is-visible", window.scrollY > 700);
			},
			{ passive: true },
		);
	},

	cursor() {
		if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
			return;
		}

		const dot = document.createElement("span");
		const ring = document.createElement("span");
		dot.className = "cursor-dot";
		ring.className = "cursor-ring";
		document.body.append(dot, ring);

		const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
		const ringPosition = { x: pointer.x, y: pointer.y };
		let visible = false;

		const setActive = (active) => {
			dot.classList.toggle("is-active", active);
			ring.classList.toggle("is-active", active);
		};

		const show = () => {
			if (visible) return;
			visible = true;
			dot.classList.add("is-visible");
			ring.classList.add("is-visible");
		};

		const hide = () => {
			visible = false;
			dot.classList.remove("is-visible");
			ring.classList.remove("is-visible");
		};

		window.addEventListener(
			"pointermove",
			(event) => {
				pointer.x = event.clientX;
				pointer.y = event.clientY;
				show();
				const target = event.target.closest?.("a, button, input, select, textarea, .product-card, .media-frame");
				setActive(Boolean(target));
			},
			{ passive: true },
		);
		window.addEventListener("pointerleave", hide);
		window.addEventListener("blur", hide);

		const render = () => {
			ringPosition.x += (pointer.x - ringPosition.x) * 0.18;
			ringPosition.y += (pointer.y - ringPosition.y) * 0.18;
			dot.style.transform = `translate3d(${pointer.x - 5.5}px, ${pointer.y - 5.5}px, 0)`;
			ring.style.transform = `translate3d(${ringPosition.x - ring.offsetWidth / 2}px, ${ringPosition.y - ring.offsetHeight / 2}px, 0)`;
			requestAnimationFrame(render);
		};

		render();
	},

	refresh() {
		this.observer?.disconnect();
		this.observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add("is-visible");
						this.observer.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.14 },
		);
		Utils.$$(".reveal").forEach((element) =>
			this.observer.observe(element),
		);
	},
};
