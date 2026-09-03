import { useEffect, useMemo, useState } from "react";
import { Link, Route, Routes, useNavigate, useParams } from "react-router-dom";

import { getProduct, getProducts, previewOrder } from "./api";
import styles from "./styles.module.css";

// ==================================================
// HELPERS
// ==================================================

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value ?? 0);

const PLACEHOLDER_IMAGE = "https://placehold.co/700x550?text=Product";

function getVariantImage(variant, product) {
  return (
    variant?.imageUrl || product?.variants?.[0]?.imageUrl || PLACEHOLDER_IMAGE
  );
}

const COLOR_SWATCHES = {
  silver: "#d9d9d9",
  titanium: "#b7aa9a",
  gray: "#777777",
  grey: "#777777",
  orange: "#ff7518",
  blue: "#246bce",
  green: "#26834b",
  black: "#1a1a1a",
};

function swatchColor(name) {
  return COLOR_SWATCHES[name?.toLowerCase()] || "#111111";
}

// ==================================================
// CART (persisted to localStorage)
// ==================================================

const CART_KEY = "1fi-cart";

function getSavedCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch {
    // storage unavailable (private browsing, quota) — fail silently
  }
}

// ==================================================
// HEADER
// ==================================================

function Header({ cartCount, search, setSearch }) {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoMark}>1Fi</span>
          <span className={styles.logoTag}>EMI Store</span>
        </Link>

        <div className={styles.searchBox}>
          <span>🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for a phone"
            aria-label="Search products"
          />
          {search && (
            <button onClick={() => setSearch("")} aria-label="Clear search">
              ×
            </button>
          )}
        </div>

        <Link to="/cart" className={styles.cartButton}>
          Cart
          <span className={styles.cartCount}>{cartCount}</span>
        </Link>
      </div>
    </header>
  );
}

// ==================================================
// FOOTER
// ==================================================

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        1Fi Smart shopping made simple — flexible payments, transparent pricing, and effortless ownership.
                                                                                         
                                                                                         (Samit Sankhla)
      
      </div>
    </footer>
  );
}

// ==================================================
// HOME PAGE
// ==================================================

function Home({ addToCart, search }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    getProducts()
      .then((data) => {
        if (!cancelled) setProducts(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return products;

    return products.filter((product) => {
      const variantText = (product.variants || [])
        .map((v) => `${v.value} ${v.color}`)
        .join(" ");

      return `${product.name} ${product.description || ""} ${variantText}`
        .toLowerCase()
        .includes(query);
    });
  }, [products, search]);

  return (
    <main className={styles.container}>
      {!search && (
        <section className={styles.hero}>
          <div>
            <p className={styles.heroKicker}>Smartphones on EMI</p>
            <h1>Get the phone now. Spread the cost, not the stress.</h1>
            <p>
              Flexible EMI options designed to make your purchase simple, transparent, and affordable.
          
            </p>

            <div className={styles.heroStats}>
              <div>
                <span className={styles.statValue}>0% interest</span>
                <span className={styles.statLabel}>on 3–12 month plans</span>
              </div>
              <div>
                <span className={styles.statValue}>3 to 60 months</span>
                <span className={styles.statLabel}>tenure to choose from</span>
              </div>
              <div>
                <span className={styles.statValue}>Up to ₹7,500</span>
                <span className={styles.statLabel}>cashback on select plans</span>
              </div>
            </div>
          </div>

          <div className={styles.heroCard}>
            <p className={styles.heroCardLabel}>iPhone 17 Pro, 12-month plan</p>
            <p className={styles.heroCardAmount}>
              {money(11242)} <span>/ month</span>
            </p>
            <div className={styles.heroCardRow}>
              <span>Interest rate</span>
              <strong>0%</strong>
            </div>
            <div className={styles.heroCardRow}>
              <span>Cashback</span>
              <strong>{money(7500)}</strong>
            </div>
            <div className={styles.heroCardRow}>
              <span>Total tenure</span>
              <strong>12 months</strong>
            </div>
          </div>
        </section>
      )}

      {search && (
        <p className={styles.searchResult}>
          Showing results for <strong>&quot;{search}&quot;</strong>
        </p>
      )}

      {loading && <div className={styles.state}>Loading products…</div>}

      {!loading && error && <div className={styles.error}>{error}</div>}

      {!loading && !error && (
        <>
          <section className={styles.grid}>
            {filteredProducts.map((product) => {
              const variant = product.variants?.[0];
              const image = getVariantImage(variant, product);

              return (
                <article key={product._id} className={styles.productCard}>
                  <Link
                    to={`/products/${product.slug}`}
                    className={styles.cardImageLink}
                  >
                    <div className={styles.cardImage}>
                      <img
                        src={image}
                        alt={product.name}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = PLACEHOLDER_IMAGE;
                        }}
                      />
                    </div>
                  </Link>

                  <div className={styles.cardBody}>
                    <Link to={`/products/${product.slug}`}>
                      <h2>{product.name}</h2>
                    </Link>

                    <p className={styles.cardMeta}>
                      {product.variants.length} variants ·{" "}
                      {product.emiPlans.length} EMI plans
                    </p>

                    <div className={styles.cardPriceRow}>
                      <span className={styles.cardPrice}>
                        {money(product.price)}
                      </span>
                      {product.mrp > product.price && (
                        <span className={styles.cardMrp}>
                          {money(product.mrp)}
                        </span>
                      )}
                    </div>

                    <div className={styles.cardActions}>
                      <Link
                        className={styles.linkText}
                        to={`/products/${product.slug}`}
                      >
                        View EMI plans
                      </Link>

                      <button
                        className={styles.addToCart}
                        onClick={() => addToCart({ product, variant })}
                      >
                        Add to cart
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          {filteredProducts.length === 0 && (
            <div className={styles.state}>
              <h2>No products match &quot;{search}&quot;</h2>
              <p>Try a different name, storage size or colour.</p>
            </div>
          )}
        </>
      )}
    </main>
  );
}

// ==================================================
// PRODUCT PAGE
// ==================================================

function ProductPage({ addToCart }) {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError("");
    setMessage("");

    getProduct(slug)
      .then((data) => {
        if (cancelled) return;
        setProduct(data);
        setSelectedVariant(data.variants?.[0]?._id || null);
        setSelectedPlan(data.emiPlans?.[0]?._id || null);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const variant = useMemo(
    () => product?.variants?.find((v) => v._id === selectedVariant),
    [product, selectedVariant]
  );

  const image = getVariantImage(variant, product);

  async function proceed() {
    if (!product || !variant || !selectedPlan) return;

    try {
      await previewOrder({
        productSlug: product.slug,
        variantId: variant._id,
        emiPlanId: selectedPlan,
      });

      setMessage(
        `Selected ${product.name} — ${variant.value} ${variant.color}. EMI plan is ready to proceed.`
      );
    } catch (err) {
      setMessage(err.message);
    }
  }

  function handleAddToCart() {
    if (!product || !variant) return;

    addToCart({ product, variant, emiPlanId: selectedPlan });
    setMessage(`${product.name} (${variant.color}, ${variant.value}) added to cart.`);
  }

  if (loading) {
    return (
      <main className={styles.container}>
        <div className={styles.state}>Loading product…</div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className={styles.container}>
        <div className={styles.error}>{error || "Product not found"}</div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <div className={styles.breadcrumb}>
        <button onClick={() => navigate(-1)}>← Back</button>
      </div>

      <section className={styles.productLayout}>
        {/* LEFT: VISUAL + VARIANT PICKERS */}
        <div className={styles.productVisual}>
          <span className={styles.newLabel}>New</span>

          <h1>{product.name}</h1>

          <p className={styles.variantLabel}>
            {variant?.value}
            {variant?.color ? ` · ${variant.color}` : ""}
          </p>

          <div className={styles.mainImageWrapper}>
            <img
              src={image}
              alt={product.name}
              className={styles.mainProductImage}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = PLACEHOLDER_IMAGE;
              }}
            />
          </div>

          <p className={styles.available}>
            Available in {product.variants.length} variants
          </p>

          <div className={styles.variantButtons}>
            {product.variants.map((item) => (
              <button
                key={item._id}
                className={
                  item._id === selectedVariant ? styles.activeVariant : ""
                }
                onClick={() => setSelectedVariant(item._id)}
              >
                {item.value}
                {item.color ? ` · ${item.color}` : ""}
              </button>
            ))}
          </div>

          <div className={styles.colorSection}>
            <strong>Choose colour</strong>
            <div className={styles.colorOptions}>
              {product.variants.map((item) => (
                <button
                  key={item._id}
                  title={item.color}
                  className={
                    item._id === selectedVariant
                      ? styles.activeColor
                      : styles.colorOption
                  }
                  onClick={() => setSelectedVariant(item._id)}
                >
                  <span
                    className={styles.colorCircle}
                    style={{ background: swatchColor(item.color) }}
                  />
                  {item.color}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: PRICE + EMI PLANS */}
        <div className={styles.emiPanel}>
          <div className={styles.priceRow}>
            <div>
              <h2>{money(product.price)}</h2>
              {product.mrp > product.price && <del>{money(product.mrp)}</del>}
            </div>
            <span className={styles.pill}>EMI friendly</span>
          </div>

          <p className={styles.panelSubtitle}>
            EMI plans backed by mutual funds — not a loan against your credit
            score.
          </p>

          <div className={styles.planList}>
            {product.emiPlans.map((plan) => (
              <label
                key={plan._id}
                className={`${styles.plan} ${
                  plan._id === selectedPlan ? styles.selectedPlan : ""
                }`}
              >
                <input
                  type="radio"
                  name="emiPlan"
                  checked={plan._id === selectedPlan}
                  onChange={() => setSelectedPlan(plan._id)}
                />

                <span className={styles.planMain}>
                  <strong>
                    {money(plan.monthlyPayment)} × {plan.tenureMonths} months
                  </strong>
                  <span className={styles.interest}>
                    {plan.interestRate}% interest
                  </span>
                </span>

                {plan.cashback > 0 && (
                  <small>Additional cashback of {money(plan.cashback)}</small>
                )}
              </label>
            ))}
          </div>

          <div className={styles.actionButtons}>
            <button className={styles.addToCartLarge} onClick={handleAddToCart}>
              Add to cart
            </button>
            <button className={styles.proceed} onClick={proceed}>
              Proceed with plan
            </button>
          </div>

          {message && <div className={styles.success}>{message}</div>}
        </div>
      </section>
    </main>
  );
}

// ==================================================
// CART PAGE
// ==================================================

function CartPage({ cart, removeFromCart, updateQuantity }) {
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className={styles.container}>
      <div className={styles.breadcrumb}>
        <Link to="/">← Continue shopping</Link>
      </div>

      <section className={styles.cartPage}>
        <h1>Your cart</h1>

        {cart.length === 0 ? (
          <div className={styles.state}>
            <h2>Your cart is empty</h2>
            <Link to="/" className={styles.shopLink}>
              Shop products
            </Link>
          </div>
        ) : (
          <div className={styles.cartLayout}>
            <div>
              {cart.map((item) => (
                <div className={styles.cartItem} key={item.key}>
                  <img
                    src={item.imageUrl || PLACEHOLDER_IMAGE}
                    alt={item.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = PLACEHOLDER_IMAGE;
                    }}
                  />

                  <div className={styles.cartInfo}>
                    <h2>{item.name}</h2>
                    <p>
                      {item.variant}
                      {item.color ? ` · ${item.color}` : ""}
                    </p>
                    <strong>{money(item.price)}</strong>

                    <div className={styles.quantity}>
                      <button
                        onClick={() =>
                          updateQuantity(item.key, item.quantity - 1)
                        }
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.key, item.quantity + 1)
                        }
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <button
                      className={styles.removeButton}
                      onClick={() => removeFromCart(item.key)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <aside className={styles.cartSummary}>
              <h2>Order summary</h2>

              <div className={styles.summaryRow}>
                <span>Items</span>
                <strong>{itemCount}</strong>
              </div>

              <div className={styles.summaryRow}>
                <span>Total</span>
                <strong>{money(total)}</strong>
              </div>

              <button className={styles.proceed}>Proceed to checkout</button>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}

// ==================================================
// MAIN APP
// ==================================================

export default function App() {
  const [cart, setCart] = useState(getSavedCart);
  const [search, setSearch] = useState("");

  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  function addToCart({ product, variant, emiPlanId }) {
    if (!product || !variant) return;

    const key = `${product._id}-${variant._id}-${emiPlanId || "no-emi"}`;

    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.key === key);

      if (existing) {
        return currentCart.map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [
        ...currentCart,
        {
          key,
          productId: product._id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          variant: variant.value,
          color: variant.color,
          imageUrl: getVariantImage(variant, product),
          emiPlanId,
          quantity: 1,
        },
      ];
    });
  }

  function removeFromCart(key) {
    setCart((currentCart) => currentCart.filter((item) => item.key !== key));
  }

  function updateQuantity(key, quantity) {
    if (quantity <= 0) {
      removeFromCart(key);
      return;
    }

    setCart((currentCart) =>
      currentCart.map((item) =>
        item.key === key ? { ...item, quantity } : item
      )
    );
  }

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <Header cartCount={cartCount} search={search} setSearch={setSearch} />

      <Routes>
        <Route
          path="/"
          element={<Home addToCart={addToCart} search={search} />}
        />
        <Route
          path="/products/:slug"
          element={<ProductPage addToCart={addToCart} />}
        />
        <Route
          path="/cart"
          element={
            <CartPage
              cart={cart}
              removeFromCart={removeFromCart}
              updateQuantity={updateQuantity}
            />
          }
        />
        <Route
          path="*"
          element={<Home addToCart={addToCart} search={search} />}
        />
      </Routes>

      <Footer />
    </>
  );
}
