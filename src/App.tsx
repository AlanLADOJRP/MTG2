import React, { useState, useEffect } from "react";

type Product = {
  name: string;
  price: number;
  image?: string;
};

type ProductsData = {
  [category: string]: Product[];
};

// --- PRODUCTS ---
const productsData: ProductsData = {
  "Draft Boosters": [
    { name: "Ravnica Remastered Draft", price: 130, image: "/images/ravnica_remastered_draft.png" },
    { name: "Dominaria United Draft", price: 60, image: "/images/dominaria_united_draft.png" },
    { name: "Midnight Hunt Draft", price: 60, image: "/images/midnight_hunt_draft.png" },
  ],
  "Set Boosters": [
    { name: "March Of The Machine Set", price: 100, image: "/images/march_of_the_machine_set.png" },
    { name: "Mystery Booster Convention", price: 150, image: "/images/mystery_booster_convention.png" },
  ],
};

// --- PRODUCT INDEXING ---
const productIndex: { [name: string]: number } = {};
const productNames: string[] = [];
let idx = 0;
Object.values(productsData).flat().forEach((p) => {
  productIndex[p.name] = idx;
  productNames.push(p.name);
  idx++;
});

// --- ENCODE/DECODE CART ---
const encodeCart = (quantities: { [name: string]: number }) => {
  const entries = Object.entries(quantities).filter(([_, qty]) => qty > 0);
  const pairs = entries.map(([name, qty]) => `${productIndex[name]}:${qty}`);
  return btoa(pairs.join(","));
};

const decodeCart = (encoded: string) => {
  const decoded = atob(encoded);
  const quantities: { [name: string]: number } = {};
  decoded.split(",").forEach((pair) => {
    const [indexStr, qtyStr] = pair.split(":");
    const index = parseInt(indexStr);
    const qty = parseInt(qtyStr);
    const name = productNames[index];
    if (name) quantities[name] = qty;
  });
  return quantities;
};

// --- APP COMPONENT ---
const App = () => {
  const getInitialQuantities = () => {
    const initial: { [key: string]: number } = {};
    Object.values(productsData).flat().forEach(({ name }) => (initial[name] = 0));
    return initial;
  };

  const [quantities, setQuantities] = useState<{ [key: string]: number }>(getInitialQuantities());
  const [copySuccess, setCopySuccess] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const [collapsed, setCollapsed] = useState<{ [cat: string]: boolean }>(() => {
    const initial: { [cat: string]: boolean } = {};
    Object.keys(productsData).forEach((cat) => (initial[cat] = false));
    return initial;
  });

  useEffect(() => {
    document.body.style.backgroundColor = "#121212";
    document.body.style.margin = "0";
    document.body.style.color = "#eee";
    document.body.style.fontFamily = "Arial, sans-serif";

    const params = new URLSearchParams(window.location.search);
    const encoded = params.get("cart");
    if (encoded) {
      try {
        const loadedQuantities = decodeCart(encoded);
        setQuantities((prev) => ({ ...prev, ...loadedQuantities }));
        setCopySuccess("Cart loaded from link!");
        setTimeout(() => setCopySuccess(""), 4000);
      } catch {
        setCopySuccess("Failed to load cart from link");
        setTimeout(() => setCopySuccess(""), 4000);
      }
    }
  }, []);

  const handleQuantityChange = (name: string, value: number) => {
    if (value < 0) value = 0;
    if (value > 100) value = 100;
    setQuantities((prev) => ({ ...prev, [name]: value }));
  };

  const clearQuantities = () => {
    setQuantities(getInitialQuantities());
    setCopySuccess("Quantities cleared!");
    setTimeout(() => setCopySuccess(""), 4000);
  };

  const toggleCollapse = (category: string) => {
    setCollapsed((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const generateOutput = () => {
    let totalQty = 0;
    let totalPrice = 0;
    const lines: string[] = [];

    Object.entries(productsData).forEach(([cat, items]) => {
      items.forEach(({ name, price }) => {
        const qty = quantities[name] || 0;
        if (qty > 0) {
          const discounted = price * (1 - discount / 100);
          const lineTotal = qty * discounted;
          totalQty += qty;
          totalPrice += lineTotal;
          lines.push(
            `${qty}x ${name} - Orig: $${price.toFixed(2)} | ${discount}% Off: $${discounted.toFixed(2)} each | $${lineTotal.toFixed(2)} total`
          );
        }
      });
    });

    lines.push(`\nTotal Quantity: ${totalQty}\nTotal Price (with ${discount}% off): $${totalPrice.toFixed(2)}`);
    return lines.join("\n");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateOutput()).then(
      () => setCopySuccess("Copied!"),
      () => setCopySuccess("Failed to copy")
    );
    setTimeout(() => setCopySuccess(""), 4000);
  };

  return (
    <div style={{ minHeight: "100vh", padding: 20, maxWidth: 700, margin: "auto" }}>
      <h1 style={{ textAlign: "center" }}>Product Selection</h1>

      {/* DISCOUNT CONTROL */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <label style={{ fontWeight: "bold" }}>Discount: {discount}%</label>
        <input
          type="range"
          min="0"
          max="90"
          value={discount}
          onChange={(e) => setDiscount(parseInt(e.target.value))}
          style={{ width: "80%", marginTop: 10 }}
        />
        <button
          onClick={() => setDiscount(0)}
          style={{
            backgroundColor: "#777",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "6px 12px",
            marginLeft: 10,
            cursor: "pointer",
          }}
        >
          Reset
        </button>
      </div>

      {Object.entries(productsData).map(([cat, items]) => (
        <div key={cat} style={{ marginBottom: 30 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid #555",
              paddingBottom: 6,
              cursor: "pointer",
            }}
            onClick={() => toggleCollapse(cat)}
          >
            <h2 style={{ margin: 0 }}>{cat}</h2>
            <span
              style={{
                fontSize: 24,
                transform: collapsed[cat] ? "rotate(90deg)" : "rotate(0deg)",
                transition: "transform 0.3s",
              }}
            >
              ▶️
            </span>
          </div>

          {!collapsed[cat] && (
            <>
              {items.map(({ name, price, image }) => {
                const discountedPrice = price * (1 - discount / 100);
                return (
                  <div
                    key={name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 12,
                      padding: 10,
                      backgroundColor: "#1e1e1e",
                      borderRadius: 6,
                    }}
                  >
                    <span style={{ flex: 1, fontWeight: "bold" }}>{name}</span>
                    {image && (
                      <img
                        src={image}
                        alt={name}
                        style={{
                          width: 60,
                          height: 60,
                          objectFit: "contain",
                          marginRight: 10,
                        }}
                      />
                    )}
                    <div style={{ textAlign: "right", marginRight: 10 }}>
                      <div style={{ textDecoration: discount ? "line-through" : "none", color: "#ccc" }}>
                        ${price.toFixed(2)}
                      </div>
                      {discount > 0 && (
                        <div style={{ color: "#39FF14", fontWeight: "bold" }}>
                          ${discountedPrice.toFixed(2)}
                        </div>
                      )}
                    </div>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={quantities[name] === 0 ? "" : quantities[name]}
                      onChange={(e) => handleQuantityChange(name, parseInt(e.target.value) || 0)}
                      style={{
                        width: 60,
                        borderRadius: 4,
                        border: "none",
                        padding: "6px 10px",
                        fontSize: 14,
                        textAlign: "center",
                        backgroundColor: "#333",
                        color: "#eee",
                      }}
                    />
                  </div>
                );
              })}
            </>
          )}
        </div>
      ))}

      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        <button
          onClick={handleCopy}
          style={{
            flex: 1,
            padding: "12px 22px",
            fontSize: 16,
            fontWeight: "bold",
            border: "none",
            borderRadius: 6,
            backgroundColor: "#2979ff",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Copy Summary
        </button>
        <button
          onClick={clearQuantities}
          style={{
            flex: 1,
            padding: "12px 22px",
            fontSize: 16,
            fontWeight: "bold",
            border: "none",
            borderRadius: 6,
            backgroundColor: "#777",
            color: "#eee",
            cursor: "pointer",
          }}
        >
          Clear All
        </button>
      </div>

      {copySuccess && (
        <div style={{ marginTop: 10, textAlign: "center", color: "#4caf50", fontWeight: "bold" }}>{copySuccess}</div>
      )}

      <textarea
        readOnly
        rows={12}
        style={{
          width: "100%",
          marginTop: 12,
          fontFamily: "monospace",
          borderRadius: 6,
          border: "none",
          padding: 12,
          backgroundColor: "#222",
          color: "#ddd",
          resize: "none",
        }}
        value={generateOutput()}
      />
    </div>
  );
};

export default App;
