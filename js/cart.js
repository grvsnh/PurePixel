const Cart = {
	key: "purepixel-cart",
	items: [],

	init() {
		this.items = Utils.getStorage(this.key, []);
		this.bind();
		this.render();
		this.updateBadge();
	},

	bind() {
		document.addEventListener("click", (event) => {
			const add = event.target.closest("[data-add-cart]");
			const remove = event.target.closest("[data-remove-cart]");
			const plus = event.target.closest("[data-cart-plus]");
			const minus = event.target.closest("[data-cart-minus]");
			const clear = event.target.closest("[data-clear-cart]");
			if (add) this.add(Number(add.dataset.addCart));
			if (remove) this.remove(Number(remove.dataset.removeCart));
			if (plus) this.change(Number(plus.dataset.cartPlus), 1);
			if (minus) this.change(Number(minus.dataset.cartMinus), -1);
			if (clear) this.clear();
		});
	},

	add(id) {
		const item = this.items.find((entry) => entry.id === id);
		if (item) item.quantity += 1;
		else this.items.push({ id, quantity: 1 });
		this.save();
	},

	remove(id) {
		this.items = this.items.filter((entry) => entry.id !== id);
		this.save();
	},

	change(id, amount) {
		const item = this.items.find((entry) => entry.id === id);
		if (!item) return;
		item.quantity += amount;
		if (item.quantity <= 0) this.remove(id);
		else this.save();
	},

	clear() {
		this.items = [];
		this.save();
	},

	products() {
		return this.items
			.map((item) => ({
				...ProductStore.getById(item.id),
				quantity: item.quantity,
			}))
			.filter((item) => item.id);
	},

	subtotal() {
		return this.products().reduce(
			(sum, product) => sum + product.price * product.quantity,
			0,
		);
	},

	total() {
		return this.subtotal() + (this.subtotal() ? 120 : 0);
	},

	save() {
		Utils.setStorage(this.key, this.items);
		this.render();
		this.updateBadge();
	},

	updateBadge() {
		const count = this.items.reduce((sum, item) => sum + item.quantity, 0);
		Utils.$$("[data-cart-count]").forEach((badge) => {
			badge.textContent = count;
			badge.hidden = count === 0;
		});
	},

	renderSummary(target) {
		const subtotal = this.subtotal();
		const shipping = subtotal ? 120 : 0;
		target.innerHTML = `
			<div class="summary-row"><span>Subtotal</span><strong>${Utils.formatPrice(subtotal)}</strong></div>
			<div class="summary-row"><span>Shipping</span><strong>${shipping ? Utils.formatPrice(shipping) : "Free"}</strong></div>
			<div class="summary-row"><span>Total</span><strong>${Utils.formatPrice(subtotal + shipping)}</strong></div>
		`;
	},

	render() {
		const list = Utils.$("#cart-list");
		const summary = Utils.$("#cart-summary");
		const checkout = Utils.$("#checkout-summary");
		const products = this.products();

		if (list) {
			list.innerHTML = products.length
				? products
						.map(
							(product) => `
					<article class="line-item">
						<img src="${product.image}" alt="${product.name}" loading="lazy">
						<div>
							<h3>${product.name}</h3>
							<p>${product.category}</p>
							<strong>${Utils.formatPrice(product.price)}</strong>
						</div>
						<div class="line-item__qty">
							<button class="icon-btn" type="button" data-cart-minus="${product.id}" aria-label="Decrease quantity"><i data-lucide="minus"></i></button>
							<strong>${product.quantity}</strong>
							<button class="icon-btn" type="button" data-cart-plus="${product.id}" aria-label="Increase quantity"><i data-lucide="plus"></i></button>
						</div>
						<button class="icon-btn" type="button" data-remove-cart="${product.id}" aria-label="Remove item"><i data-lucide="trash-2"></i></button>
					</article>
				`,
						)
						.join("")
				: `<div class="empty-state"><h3>Your bag is empty</h3><p>Add a few glow essentials and your cart will appear here.</p><a class="btn btn--pink" href="shop.html">Shop Products</a></div>`;
		}

		if (summary) this.renderSummary(summary);
		if (checkout) this.renderSummary(checkout);
		window.lucide?.createIcons();
	},
};
