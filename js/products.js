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
			if (!response.ok) throw new Error(`Product request failed: ${response.status}`);
			this.products = await response.json();
		} catch (error) {
			console.error("Products could not be loaded.", error);
			this.products = this.fallbackProducts();
		}
	},

	fallbackProducts() {
		return [
			{
				id: 1,
				name: "Cloud Touch Cleanser",
				category: "Cleanser",
				price: 799,
				rating: 4.9,
				badge: "New",
				image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=80",
				description: "A cushion-soft daily cleanser that removes makeup and city residue without stripping the skin barrier.",
				routine: "AM + PM",
				skin: "All skin",
			},
			{
				id: 2,
				name: "Glass Glow Serum",
				category: "Serum",
				price: 1299,
				rating: 4.8,
				badge: "Best Seller",
				image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80",
				description: "A brightening serum with niacinamide, peptides, and pearlescent hydration for fresh, even radiance.",
				routine: "AM",
				skin: "Dullness",
			},
			{
				id: 3,
				name: "Velvet Barrier Cream",
				category: "Moisturizer",
				price: 999,
				rating: 4.7,
				badge: "Trending",
				image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=80",
				description: "A plush moisturizer that seals water in with ceramides, squalane, and a soft-touch finish.",
				routine: "AM + PM",
				skin: "Dry skin",
			},
			{
				id: 4,
				name: "SPF Daily Shield",
				category: "Sunscreen",
				price: 899,
				rating: 4.8,
				badge: "SPF 50",
				image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=900&q=80",
				description: "A broad-spectrum SPF 50 fluid with an invisible finish that layers cleanly under makeup.",
				routine: "AM",
				skin: "All skin",
			},
		];
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
		const products = this.products.slice(0, 4);
		target.innerHTML = products.length
			? products.map((product) => this.card(product)).join("")
			: `<div class="empty-state reveal"><h3>The shelf is loading</h3><p>Refresh the page or open the site from the local server so product data can load.</p><a class="btn btn--pink" href="shop.html">Visit Shop</a></div>`;
		requestAnimationFrame(() => {
			Animations?.refresh();
			window.lucide?.createIcons();
		});
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
