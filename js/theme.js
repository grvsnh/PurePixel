const Theme = Object.freeze({
	key: "purepixel-theme",

	init() {
		const saved = Utils.getStorage(this.key, "light");
		this.apply(saved);
		this.bind();
	},

	bind() {
		Utils.$$("#theme-toggle").forEach((button) => {
			button.addEventListener("click", () => {
				const next =
					document.documentElement.dataset.theme === "dark"
						? "light"
						: "dark";
				this.apply(next);
				Utils.setStorage(this.key, next);
			});
		});
	},

	apply(theme) {
		document.documentElement.dataset.theme =
			theme === "dark" ? "dark" : "light";
		Utils.$$("#theme-toggle").forEach((button) => {
			button.setAttribute(
				"aria-label",
				`Switch to ${theme === "dark" ? "light" : "dark"} theme`,
			);
		});
	},
});
