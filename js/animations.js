const Animations = {
	observer: null,

	init() {
		this.loader();
		this.navbar();
		this.progress();
		this.backToTop();
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
