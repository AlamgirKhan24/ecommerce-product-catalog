import { addToCart } from '../modules/cart.js';
import { isWishlisted, toggleWishlist } from '../modules/wishlist.js';
import { createEl } from '../utils/dom.js';

const products = [
  ['fp001', 'Sequoia Bass Headphone', 'Headphones', 129, null, '4.8', 'New', 'assets/images/products/product-01.svg'],
  ['fp002', 'Modular Day Backpack', 'Carry', 118, 145, '4.9', '-19%', 'assets/images/products/product-02.svg'],
  ['fp003', 'Ceramic Field Watch', 'Accessories', 154, null, '4.7', '', 'assets/images/products/product-03.svg'],
  ['fp004', 'Wireless Table Lamp', 'Home Tech', 86, 104, '4.6', 'Deal', 'assets/images/products/product-04.svg'],
  ['fp005', 'Aurora Smart Speaker', 'Audio', 98, null, '4.8', '', 'assets/images/products/product-01.svg'],
  ['fp006', 'Orbit Travel Pouch', 'Carry', 42, 58, '4.5', '-28%', 'assets/images/products/product-02.svg'],
  ['fp007', 'Mono Ceramic Band', 'Accessories', 64, null, '4.7', '', 'assets/images/products/product-03.svg'],
  ['fp008', 'Halo Desk Light', 'Home Tech', 76, 92, '4.6', 'Sale', 'assets/images/products/product-04.svg'],
];

function icon(name) {
  return createEl('i', { 'data-lucide': name, 'aria-hidden': 'true' });
}

function toProduct([id, name, category, price, oldPrice, rating, badge, image]) {
  return {
    id,
    name,
    category,
    price,
    oldPrice,
    rating,
    badge,
    images: [image],
  };
}

function renderCard(rawProduct) {
  const product = toProduct(rawProduct);

  const wishButton = createEl(
    'button',
    {
      class: 'featured-product-card__icon',
      type: 'button',
      'aria-label': `Add ${product.name} to wishlist`,
    },
    [icon('heart')]
  );

  wishButton.classList.toggle('is-active', isWishlisted(product.id));
  wishButton.addEventListener('click', () => {
    const active = toggleWishlist(product);
    wishButton.classList.toggle('is-active', active);
  });

  const cartButton = createEl(
    'button',
    { class: 'featured-product-card__cart', type: 'button' },
    'Add to Cart'
  );
  cartButton.addEventListener('click', () => addToCart(product));

  const priceChildren = [createEl('strong', {}, `$${product.price.toFixed(2)}`)];
  if (product.oldPrice) priceChildren.push(createEl('del', {}, `$${product.oldPrice.toFixed(2)}`));

  const mediaChildren = [
    wishButton,
    createEl(
      'a',
      {
        class: 'featured-product-card__quick',
        href: `product.html?id=${product.id}`,
        'aria-label': `Quick view ${product.name}`,
      },
      [icon('eye')]
    ),
    createEl('img', { src: product.images[0], alt: product.name, loading: 'lazy' }),
  ];

  if (product.badge) {
    mediaChildren.unshift(createEl('span', { class: 'featured-product-card__badge' }, product.badge));
  }

  return createEl('article', { class: 'featured-product-card' }, [
    createEl('div', { class: 'featured-product-card__media' }, mediaChildren),
    createEl('div', { class: 'featured-product-card__body' }, [
      createEl('span', {}, product.category),
      createEl('h3', {}, product.name),
      createEl(
        'div',
        { class: 'featured-product-card__rating', 'aria-label': `Rated ${product.rating} out of 5` },
        ['★★★★★ ', createEl('small', {}, product.rating)]
      ),
      createEl('div', { class: 'featured-product-card__bottom' }, [
        createEl('div', { class: 'featured-product-card__price' }, priceChildren),
        cartButton,
      ]),
    ]),
  ]);
}

function renderSection() {
  const section = createEl('section', { class: 'featured-products', 'aria-labelledby': 'featured-products-title' }, [
    createEl('div', { class: 'featured-products__head' }, [
      createEl('div', {}, [
        createEl('span', { class: 'neo-kicker' }, 'Editor Picks'),
        createEl('h2', { id: 'featured-products-title' }, 'Featured Products'),
        createEl(
          'p',
          {},
          'Selected essentials with premium materials, clean utility, and everyday performance.'
        ),
      ]),
      createEl('a', { class: 'neo-section-link', href: 'shop.html' }, [
        'Explore all',
        createEl('i', { 'data-lucide': 'arrow-up-right', 'aria-hidden': 'true' }),
      ]),
    ]),
    createEl('div', { class: 'featured-products__grid' }, products.map(renderCard)),
  ]);

  return section;
}

export function initFeaturedProducts() {
  document.querySelectorAll('.featured-product-card').forEach((card) => {
    const product = {
      id: card.dataset.id,
      name: card.dataset.name,
      category: card.dataset.category,
      price: Number(card.dataset.price),
      oldPrice: card.dataset.oldPrice ? Number(card.dataset.oldPrice) : null,
      images: [card.dataset.image],
    };

    const wishButton = card.querySelector('[data-featured-wishlist]');
    const cartButton = card.querySelector('[data-featured-cart]');

    wishButton?.classList.toggle('is-active', isWishlisted(product.id));
    wishButton?.addEventListener('click', () => {
      const active = toggleWishlist(product);
      wishButton.classList.toggle('is-active', active);
    });

    cartButton?.addEventListener('click', () => addToCart(product));
  });

  window.lucide?.createIcons();

  const mount = document.querySelector('#featured-products-mount');
  if (mount && !mount.querySelector('.featured-products')) {
    mount.appendChild(renderSection());
    window.lucide?.createIcons();
    return;
  }

  const existingFeatured = document.querySelector('.neo-featured');
  if (!existingFeatured || document.querySelector('.featured-products')) return;

  existingFeatured.insertAdjacentElement('afterend', renderSection());
  window.lucide?.createIcons();
}
