document.addEventListener("DOMContentLoaded", async () => {
	Theme.init();
	Wishlist.init();
	Animations.init();
	await ProductStore.init();
	Cart.init();
	Wishlist.render();
	App.init();
});

const App = {
	init() {
		this.menu();
		this.newsletter();
		this.checkout();
		this.activeNav();
		Utils.$$("[data-year]").forEach((node) => {
			node.textContent = new Date().getFullYear();
		});
		Utils.bindImageFallbacks();
		this.icons();
	},

	icons() {
		Utils.$$("[data-lucide]").forEach((icon) =>
			icon.setAttribute("aria-hidden", "true"),
		);
		if (window.lucide) {
			window.lucide.createIcons();
			return;
		}
		const fallbackIcons = {
			heart: "♡",
			"shopping-bag": "▱",
			"sun-moon": "◐",
			menu: "☰",
			x: "×",
			"arrow-up": "↑",
			minus: "−",
			plus: "+",
			"trash-2": "⌫",
		};
		Utils.$$("[data-lucide]").forEach((icon) => {
			const name = icon.dataset.lucide;
			icon.textContent = fallbackIcons[name] || "•";
			icon.classList.add("icon-fallback");
		});
	},

	menu() {
		const menu = Utils.$("#mobile-menu");
		const overlay = Utils.$("#menu-overlay");
		const open = Utils.$("#menu-toggle");
		const close = Utils.$("#menu-close");
		const hide = () => {
			menu?.classList.remove("is-open");
			overlay?.classList.remove("is-visible");
			open?.setAttribute("aria-expanded", "false");
			menu?.setAttribute("aria-hidden", "true");
			if (menu) menu.inert = true;
			Utils.unlockScroll();
		};
		const show = () => {
			menu?.classList.add("is-open");
			overlay?.classList.add("is-visible");
			open?.setAttribute("aria-expanded", "true");
			menu?.setAttribute("aria-hidden", "false");
			if (menu) menu.inert = false;
			Utils.lockScroll();
		};
		hide();
		open?.addEventListener("click", show);
		close?.addEventListener("click", hide);
		overlay?.addEventListener("click", hide);
		Utils.$$(".mobile-panel a").forEach((link) =>
			link.addEventListener("click", hide),
		);
		document.addEventListener("keydown", (event) => {
			if (event.key === "Escape") hide();
		});
	},

	newsletter() {
		Utils.$$("#newsletter-form").forEach((form) => {
			form.addEventListener("submit", (event) => {
				event.preventDefault();
				const button = form.querySelector("button");
				const label = button.textContent;
				button.textContent = "Subscribed";
				button.disabled = true;
				Utils.toast("You are on the list. Welcome to the glow club.");
				setTimeout(() => {
					button.textContent = label;
					button.disabled = false;
					form.reset();
				}, 1800);
			});
		});
	},

	checkout() {
		const form = Utils.$("#checkout-form");
		if (!form) return;
		if (!Cart.products().length) {
			form.innerHTML = `
				<div class="empty-state">
					<h3>Your checkout is waiting.</h3>
					<p>Add something to your bag before entering delivery details. Your future self will thank you.</p>
					<a class="btn btn--pink" href="shop.html">Browse the shelf</a>
				</div>
			`;
			return;
		}
		form.addEventListener("submit", (event) => {
			event.preventDefault();
			form.innerHTML = `
				<div class="empty-state">
					<h3>Order placed</h3>
					<p>Your Pure Pixel routine is confirmed. This demo clears the cart to complete the checkout flow.</p>
					<a class="btn btn--pink" href="shop.html">Keep Shopping</a>
				</div>
			`;
			Cart.clear(true);
			Utils.toast("Order placed. Your glow is in motion.");
		});
	},

	activeNav() {
		const page = window.location.pathname.split("/").pop() || "index.html";
		Utils.$$(".navbar__links a, .mobile-panel__links a").forEach((link) => {
			const href = link.getAttribute("href")?.split("?")[0];
			const active = href === page || (page === "" && href === "index.html");
			link.classList.toggle("is-active", active);
			if (active) link.setAttribute("aria-current", "page");
		});
	},
};
