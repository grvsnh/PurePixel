const ProductStore = {
	products: [],

	async init() {
		await this.load();
		this.renderFeatured();
		this.renderShop();
		this.renderProductDetail();
	},

	async load() {
		try {
			const response = await fetch("data/products.json");
			this.products = await response.json();
		} catch (error) {
			console.error("Products could not be loaded.", error);
			this.products = [];
		}
	},

	all() {
		return this.products;
	},

	getById(id) {
		return this.products.find((product) => product.id === Number(id));
	},

	categories() {
		return [
			"All",
			...new Set(this.products.map((product) => product.category)),
		];
	},

	filter({ query = "", category = "All", sort = "featured" } = {}) {
		const term = query.trim().toLowerCase();
		let result = this.products.filter((product) => {
			const matchesCategory =
				category === "All" || product.category === category;
			const matchesQuery =
				!term ||
				[
					product.name,
					product.category,
					product.description,
					product.skin,
				]
					.join(" ")
					.toLowerCase()
					.includes(term);
			return matchesCategory && matchesQuery;
		});

		const sorters = {
			"price-low": (a, b) => a.price - b.price,
			"price-high": (a, b) => b.price - a.price,
			rating: (a, b) => b.rating - a.rating,
			name: (a, b) => a.name.localeCompare(b.name),
		};

		return sorters[sort] ? [...result].sort(sorters[sort]) : result;
	},

	card(product) {
		const wished = Wishlist.has(product.id) ? "true" : "false";
		return `
			<article class="product-card reveal">
				<a class="product-card__media" href="product.html?id=${product.id}" aria-label="View ${product.name}">
					<img src="${product.image}" alt="${product.name}" loading="lazy">
				</a>
				<div class="product-card__top">
					<span class="pill">${product.badge}</span>
					<span aria-label="${product.rating} stars">★ ${product.rating}</span>
				</div>
				<div>
					<p>${product.category} / ${product.routine}</p>
					<h3>${product.name}</h3>
				</div>
				<p>${product.description}</p>
				<div class="product-card__actions">
					<span class="price">${Utils.formatPrice(product.price)}</span>
					<button class="icon-btn" type="button" data-wishlist="${product.id}" aria-pressed="${wished}" aria-label="Toggle wishlist">
						<i data-lucide="heart"></i>
					</button>
					<button class="btn btn--pink" type="button" data-add-cart="${product.id}">Add</button>
				</div>
			</article>
		`;
	},

	renderFeatured() {
		const target = Utils.$("#featured-products");
		if (!target) return;
		target.innerHTML = this.products
			.slice(0, 4)
			.map((product) => this.card(product))
			.join("");
	},

	renderShop() {
		const grid = Utils.$("#shop-grid");
		if (!grid) return;

		const search = Utils.$("#shop-search");
		const category = Utils.$("#shop-category");
		const sort = Utils.$("#shop-sort");
		const count = Utils.$("#shop-count");

		if (category && !category.dataset.ready) {
			category.innerHTML = this.categories()
				.map((item) => `<option value="${item}">${item}</option>`)
				.join("");
			category.dataset.ready = "true";
		}

		const render = () => {
			const products = this.filter({
				query: search?.value || "",
				category: category?.value || "All",
				sort: sort?.value || "featured",
			});
			grid.innerHTML = products.length
				? products.map((product) => this.card(product)).join("")
				: `<div class="empty-state"><h3>No products found</h3><p>Try a different search or category.</p></div>`;
			if (count)
				count.textContent = `${products.length} product${products.length === 1 ? "" : "s"}`;
			Animations.refresh();
			window.lucide?.createIcons();
		};

		[search, category, sort].forEach((control) =>
			control?.addEventListener("input", render),
		);
		render();
	},

	renderProductDetail() {
		const target = Utils.$("#product-detail");
		if (!target) return;

		const product =
			this.getById(Utils.getParam("id") || 2) || this.products[0];
		document.title = `${product.name} | Pure Pixel`;
		target.innerHTML = `
			<div class="media-frame reveal">
				<img src="${product.image}" alt="${product.name}">
			</div>
			<div class="product-detail__content reveal">
				<span class="eyebrow">${product.badge} / ${product.category}</span>
				<h1>${product.name}</h1>
				<p>${product.description}</p>
				<div class="product-detail__meta">
					<span class="pill">★ ${product.rating}</span>
					<span class="pill">${product.routine}</span>
					<span class="pill">${product.skin}</span>
				</div>
				<div class="product-detail__buy">
					<span class="price">${Utils.formatPrice(product.price)}</span>
					<button class="btn btn--pink" type="button" data-add-cart="${product.id}">Add To Bag</button>
					<button class="btn" type="button" data-wishlist="${product.id}">Wishlist</button>
				</div>
			</div>
		`;
	},
};
