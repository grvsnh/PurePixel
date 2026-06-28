const Wishlist = {
	key: "purepixel-wishlist",
	items: [],

	init() {
		this.items = Utils.getStorage(this.key, []);
		this.bind();
		this.render();
		this.updateBadge();
	},

	bind() {
		document.addEventListener("click", (event) => {
			const button = event.target.closest("[data-wishlist]");
			if (!button) return;
			this.toggle(Number(button.dataset.wishlist));
			button.setAttribute(
				"aria-pressed",
				String(this.has(button.dataset.wishlist)),
			);
			window.lucide?.createIcons();
		});
	},

	has(id) {
		return this.items.includes(Number(id));
	},

	toggle(id) {
		id = Number(id);
		this.items = this.has(id)
			? this.items.filter((item) => item !== id)
			: [...this.items, id];
		this.save();
		this.render();
	},

	save() {
		Utils.setStorage(this.key, this.items);
		this.updateBadge();
	},

	updateBadge() {
		Utils.$$("[data-wishlist-count]").forEach((badge) => {
			badge.textContent = this.items.length;
			badge.hidden = this.items.length === 0;
		});
	},

	render() {
		const target = Utils.$("#wishlist-grid");
		if (!target || !ProductStore.products.length) return;
		const products = this.items
			.map((id) => ProductStore.getById(id))
			.filter(Boolean);
		target.innerHTML = products.length
			? products.map((product) => ProductStore.card(product)).join("")
			: `<div class="empty-state"><h3>Your wishlist is waiting</h3><p>Save your future shelf favorites and come back when the mood strikes.</p><a class="btn btn--pink" href="shop.html">Shop Products</a></div>`;
		Animations.refresh();
		window.lucide?.createIcons();
	},
};
