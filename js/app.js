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
		Utils.$$("[data-year]").forEach((node) => {
			node.textContent = new Date().getFullYear();
		});
		window.lucide?.createIcons();
	},

	menu() {
		const menu = Utils.$("#mobile-menu");
		const overlay = Utils.$("#menu-overlay");
		const open = Utils.$("#menu-toggle");
		const close = Utils.$("#menu-close");
		const hide = () => {
			menu?.classList.remove("is-open");
			overlay?.classList.remove("is-visible");
			Utils.unlockScroll();
		};
		const show = () => {
			menu?.classList.add("is-open");
			overlay?.classList.add("is-visible");
			Utils.lockScroll();
		};
		open?.addEventListener("click", show);
		close?.addEventListener("click", hide);
		overlay?.addEventListener("click", hide);
		Utils.$$(".mobile-panel a").forEach((link) =>
			link.addEventListener("click", hide),
		);
	},

	newsletter() {
		Utils.$$("#newsletter-form").forEach((form) => {
			form.addEventListener("submit", (event) => {
				event.preventDefault();
				const button = form.querySelector("button");
				const label = button.textContent;
				button.textContent = "Subscribed";
				button.disabled = true;
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
		form.addEventListener("submit", (event) => {
			event.preventDefault();
			form.innerHTML = `
				<div class="empty-state">
					<h3>Order placed</h3>
					<p>Your Pure Pixel routine is confirmed. This demo clears the cart to complete the checkout flow.</p>
					<a class="btn btn--pink" href="shop.html">Keep Shopping</a>
				</div>
			`;
			Cart.clear();
		});
	},
};
