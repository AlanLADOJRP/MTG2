import React, { useState, useEffect } from "react";

type Product = {
  name: string;
  price: number;
  image?: string;
};

type ProductsData = {
  [category: string]: Product[];
};

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
  "Play Boosters": [
    { name: "Murders at Karlov Manor Play", price: 100, image: "/images/murders_at_karlov_manor_play.png" },
  ],
  "Collector Boosters": [
    { name: "Murder at Karlov Manor Collector", price: 160, image: "/images/murder_at_karlov_manor_collector.png" },
    { name: "Ravnica Remastered Collector", price: 420, image: "/images/ravnica_remastered_collector.png" },
    { name: "Commander Masters Collector", price: 250, image: "/images/commander_masters_collector.png" },
  ],
  "Commander Decks": [
    { name: "Final Fantasy — Counter Blitz", price: 30, image: "/images/counter_blitz.png" },
    { name: "Final Fantasy — Limit Break", price: 40, image: "/images/limit_break.png" },
    { name: "Final Fantasy — Scions & Spellcraft", price: 30, image: "/images/scions_spellcraft.png" },
  ],
  "Prerelease": [
    { name: "Lord of the Rings Prerelease", price: 50, image: "/images/lord_of_the_rings_prerelease.png" },
  ],
  "Secret Lair": [
    { name: "Non Foil - Outlaw Anthology Vol. 2: Sinister Scoundrels", price: 25, image: "/images/secret_lair_showcase_awbo_step_and_compleat.png" },
    { name: "Non Foil - Prints of Darkness", price: 30, image: "/images/secret_lair_showcase_awbo_step_and_compleat.png" },
    { name: "Non Foil - Princess Bride", price: 170, image: "/images/secret_lair_showcase_awbo_step_and_compleat.png" },
    { name: "Non Foil - Life Breaks Free", price: 130, image: "/images/secret_lair_showcase_awbo_step_and_compleat.png" },
    { name: "Non Foil - Optimus Prime vs Megatron", price: 50, image: "/images/secret_lair_showcase_awbo_step_and_compleat.png" },

    { name: "Showcase AWBO Step and Compleat", price: 35, image: "/images/secret_lair_showcase_awbo_step_and_compleat.png" },
    { name: "Traditional Foil - Doctor Who: Regeneration", price: 170, image: "/images/secret_lair_the_scorpion_god_traditional_foil.png" },
    { name: "Traditional Foil - Just Add Milk: Tomb Raider", price: 140, image: "/images/secret_lair_the_scorpion_god_traditional_foil.png" },
    { name: "Traditional Foil - Just Add Milk: Second Helpings", price: 35, image: "/images/secret_lair_the_scorpion_god_traditional_foil.png" },
    { name: "Traditional Foil - The Scorpion God", price: 4, image: "/images/secret_lair_the_scorpion_god_traditional_foil.png" },
    { name: "Traditional Foil - Not a Wolf", price: 40, image: "/images/not_a_wolf_traditional_foil.png" },
    { name: "Rainbow Foil - SLxFallout Vault Boy", price: 40, image: "/images/secret_lair_slxfallout_vault_boy_rainbow_foil.png" },
    { name: "Rainbow Foil - SLxD&D Exhibition o Adventure", price: 40, image: "/images/secret_lair_slxd_d_exhibition_o_adventure_rainbow.png" },
    { name: "Rainbow Foil - Bloomburrow", price: 40, image: "/images/showcase_bloomburrow_rainbow_foil.png" },
    { name: "Rainbow Foil - Phoebe Wahl", price: 20, image: "/images/phoebe_wahl_rainbow_foil.png" },
    { name: "Rainbow Foil - Braindead: Staples", price: 30, image: "/images/secret_lair_x_braindead_staples.png" },
    { name: "Rainbow Foil - Artist Series: Rovina Cal", price: 50, image: "/images/artist_series_rovena_cal_rainbow_foil.png" },
    { name: "Rainbow Foil - Prismatic Nightmares", price: 40, image: "/images/not_a_wolf_traditional_foil.png" },
  ],
  "Secret Lair Decks": [
    { name: "Angels: They're Just Like Us but Cooler and with Wings Deck", price: 400, image: "/images/angels_deck.png" },
    { name: "From Cute to Brute Deck", price: 180, image: "/images/secret_lair_cute_to_brute_commander.png" },
  ],
  "Others": [
    { name: "Dominaria United Jumpstart Boosters (3x)", price: 5, image: "/images/dominaria_united_jumpstart_boosters_3x.png" },
    { name: "Murder at Karlov Manor Bundle", price: 25, image: "/images/murder_at_karlov_manor_bundle.png" },
    { name: "Pioneer Challenger Decks", price: 100, image: "/images/pioneer_challenger_decks.png" },
    { name: "Crimson Vow Gift Bundle", price: 40, image: "/images/crimson_vow_gift_bundle.png" },
    { name: "Commander Collection: Green - Premium", price: 50, image: "/images/Commander_Collection_Green_Premium.png" },
  ],
  "Special": [
    { name: "30th Anniversary", price: 1000, image: "/images/30th_anniversary.png" },
  ],
};

// --- PRODUCT INDICES FOR URL ENCODING ---
const productIndex: { [name: string]: number } = {};
const productNames: string[] = [];
let idx = 0;
Object.values(productsData).flat().forEach((p) => {
  productIndex[p.name] = idx;
  productNames.push(p.name);
  idx++;
});

// --- ENCODE / DECODE FUNCTIONS ---
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

// --- HELPERS ---
const fmt = (n: number) => n.toFixed(2);
const effectiveDiscountForCategory = (
  category: string,
  globalPct: number,
  secretLairPct: number
) => (category === "Secret Lair" ? secretLairPct : globalPct);

// --- APP COMPONENT ---
const App = () => {
  const getInitialQuantities = () => {
    const initial: { [key: string]: number } = {};
    Object.values(productsData).flat().forEach(({ name }) => (initial[name] = 0));
    return initial;
  };

  const [quantities, setQuantities] = useState<{ [key: string]: number }>(getInitialQuantities());
  const [copySuccess, setCopySuccess] = useState<string>("");

  // Discounts
  const [discountGlobal, setDiscountGlobal] = useState<number>(0);
  const [discountSecretLair, setDiscountSecretLair] = useState<number>(0);

  const [collapsed, setCollapsed] = useState<{ [cat: string]: boolean }>(() => {
    const initial: { [cat: string]: boolean } = {};
    Object.keys(productsData).forEach((cat) => (initial[cat] = false));
    return initial;
  });

  // --- LOAD CART & DISCOUNTS FROM URL ---
  useEffect(() => {
    document.body.style.backgroundColor = "#121212";
    document.body.style.margin = "0";
    document.body.style.height = "100%";
    document.documentElement.style.height = "100%";
    document.body.style.color = "#eee";
    document.body.style.fontFamily = "Arial, sans-serif";

    const params = new URLSearchParams(window.location.search);
    const encoded = params.get("cart");
    const dGlobal = params.get("discount");
    const dSL = params.get("secretLairDiscount");

    if (dGlobal !== null && !Number.isNaN(parseInt(dGlobal))) {
      setDiscountGlobal(Math.max(0, Math.min(90, parseInt(dGlobal))));
    }
    if (dSL !== null && !Number.isNaN(parseInt(dSL))) {
      setDiscountSecretLair(Math.max(0, Math.min(90, parseInt(dSL))));
    }

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

  const clearCategory = (category: string) => {
    setQuantities((prev) => {
      const newQuantities = { ...prev };
      productsData[category].forEach((item) => (newQuantities[item.name] = 0));
      return newQuantities;
    });
    setCopySuccess(`Category "${category}" cleared!`);
    setTimeout(() => setCopySuccess(""), 4000);
  };

  const toggleCollapse = (category: string) => {
    setCollapsed((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const generateOutput = () => {
    let totalQty = 0;
    let totalOrigPrice = 0;
    let totalDiscPrice = 0;
    const lines: string[] = [];

    Object.entries(productsData).forEach(([cat, items]) => {
      const discPct = effectiveDiscountForCategory(cat, discountGlobal, discountSecretLair);
      items.forEach(({ name, price }) => {
        const qty = quantities[name] || 0;
        if (qty > 0) {
          const discounted = price * (1 - discPct / 100);
          const lineOrig = qty * price;
          const lineDisc = qty * discounted;
          totalQty += qty;
          totalOrigPrice += lineOrig;
          totalDiscPrice += lineDisc;
          lines.push(
            `${qty}x ${name} — Orig: $${fmt(price)} | ${discPct}% Off: $${fmt(discounted)} each | $${fmt(lineDisc)} total (was $${fmt(lineOrig)})`
          );
        }
      });
    });

    lines.push(
      `\nTotal Quantity: ${totalQty}\nTotal Price: $${fmt(totalDiscPrice)} (was $${fmt(totalOrigPrice)})`
    );
    return lines.join("\n");
  };

  const generateQuantityOutput = () => {
    const lines: string[] = [];
    Object.entries(productsData).forEach(([_, items]) => {
      items.forEach(({ name }) => {
        const qty = quantities[name] || 0;
        if (qty > 0) lines.push(`${qty}x ${name}`);
      });
    });
    return lines.join("\n");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateOutput()).then(
      () => setCopySuccess("Copied!"),
      () => setCopySuccess("Failed to copy")
    );
    setTimeout(() => setCopySuccess(""), 4000);
  };

  const handleCopyQuantities = () => {
    navigator.clipboard.writeText(generateQuantityOutput()).then(
      () => setCopySuccess("Quantities copied!"),
      () => setCopySuccess("Failed to copy quantities")
    );
    setTimeout(() => setCopySuccess(""), 4000);
  };

  // --- SHARE CART VIA COMPACT URL (INCLUDES DISCOUNTS) ---
  const shareCart = () => {
    const encoded = encodeCart(quantities);
    const link = `${window.location.origin}/?cart=${encoded}&discount=${discountGlobal}&secretLairDiscount=${discountSecretLair}`;
    try {
      navigator.clipboard.writeText(link);
    } catch {
      const input = document.createElement("input");
      document.body.appendChild(input);
      input.value = link;
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
    setCopySuccess("Cart link copied!");
    setTimeout(() => setCopySuccess(""), 4000);
  };

  return (
    <div style={{ minHeight: "100vh", padding: 20, maxWidth: 700, margin: "auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: 20 }}>Product Selection</h1>

      {/* DISCOUNT CONTROLS */}
      <div style={{ background: "#1b1b1b", borderRadius: 8, padding: 12, marginBottom: 16 }}>
        <div style={{ textAlign: "center", marginBottom: 10 }}>
          <label style={{ fontWeight: "bold" }}>Global Discount: {discountGlobal}%</label>
          <input
            type="range"
            min={0}
            max={90}
            value={discountGlobal}
            onChange={(e) => setDiscountGlobal(parseInt(e.target.value))}
            style={{ width: "100%", marginTop: 8 }}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 8, justifyContent: "center" }}>
            <input
              type="number"
              min={0}
              max={90}
              value={discountGlobal}
              onChange={(e) =>
                setDiscountGlobal(Math.max(0, Math.min(90, parseInt(e.target.value || "0"))))
              }
              style={{
                width: 80,
                borderRadius: 6,
                border: "none",
                padding: "6px 10px",
                backgroundColor: "#333",
                color: "#eee",
                textAlign: "center",
              }}
            />
            <button
              onClick={() => setDiscountGlobal(0)}
              style={{
                backgroundColor: "#777",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "6px 12px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Reset Global
            </button>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <label style={{ fontWeight: "bold" }}>Secret Lair Discount (overrides global): {discountSecretLair}%</label>
          <input
            type="range"
            min={0}
            max={90}
            value={discountSecretLair}
            onChange={(e) => setDiscountSecretLair(parseInt(e.target.value))}
            style={{ width: "100%", marginTop: 8 }}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 8, justifyContent: "center" }}>
            <input
              type="number"
              min={0}
              max={90}
              value={discountSecretLair}
              onChange={(e) =>
                setDiscountSecretLair(Math.max(0, Math.min(90, parseInt(e.target.value || "0"))))
              }
              style={{
                width: 80,
                borderRadius: 6,
                border: "none",
                padding: "6px 10px",
                backgroundColor: "#333",
                color: "#eee",
                textAlign: "center",
              }}
            />
            <button
              onClick={() => setDiscountSecretLair(0)}
              style={{
                backgroundColor: "#777",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "6px 12px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Reset Secret Lair
            </button>
          </div>
        </div>
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
              transition: "all 0.3s",
            }}
            onClick={() => toggleCollapse(cat)}
          >
            <h2 style={{ margin: 0 }}>{cat}</h2>
            <span
              style={{
                fontSize: 24,
                display: "inline-block",
                transition: "transform 0.3s",
                transform: collapsed[cat] ? "rotate(90deg)" : "rotate(0deg)",
              }}
            >
              ▶️
            </span>
          </div>

          {!collapsed[cat] && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearCategory(cat);
                }}
                style={{
                  backgroundColor: "#777",
                  color: "#eee",
                  border: "none",
                  borderRadius: 6,
                  padding: "6px 12px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  marginTop: 8,
                  marginBottom: 12,
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLButtonElement).style.backgroundColor = "#555")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLButtonElement).style.backgroundColor = "#777")
                }
              >
                Clear Category
              </button>

              {items.map(({ name, price, image }) => {
                const discPct = effectiveDiscountForCategory(
                  cat,
                  discountGlobal,
                  discountSecretLair
                );
                const discountedPrice = price * (1 - discPct / 100);

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
                    {/* Name */}
                    <span style={{ flex: 1, fontWeight: "bold" }}>{name}</span>

                    {/* Image */}
                    {image ? (
                      <img
                        src={image}
                        alt={name}
                        style={{ width: 60, height: 60, objectFit: "contain", marginRight: 10 }}
                      />
                    ) : (
                      <span style={{ color: "#555", fontSize: 12, marginRight: 10 }}>No Image</span>
                    )}

                    {/* Prices */}
                    <div style={{ width: 130, textAlign: "right", marginRight: 10, flexShrink: 0 }}>
                      <div style={{ textDecoration: discPct > 0 ? "line-through" : "none", color: "#ccc" }}>
                        ${fmt(price)}
                      </div>
                      {discPct > 0 && (
                        <div style={{ color: "#39FF14", fontWeight: "bold" }}>
                          ${fmt(discountedPrice)}
                        </div>
                      )}
                    </div>

                    {/* Quantity */}
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

      <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
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
          onClick={handleCopyQuantities}
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
          Copy Quantities
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
        <button
          onClick={shareCart}
          style={{
            flex: 1,
            padding: "12px 22px",
            fontSize: 16,
            fontWeight: "bold",
            border: "none",
            borderRadius: 6,
            backgroundColor: "#ff5722",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Share Cart
        </button>
      </div>

      {copySuccess && (
        <div style={{ marginTop: 10, textAlign: "center", color: "#4caf50", fontWeight: "bold" }}>
          {copySuccess}
        </div>
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
      <textarea
        readOnly
        rows={12}
        style={{
          width: "100%",
          marginTop: 8,
          fontFamily: "monospace",
          borderRadius: 6,
          border: "none",
          padding: 12,
          backgroundColor: "#222",
          color: "#39FF14",
          resize: "none",
        }}
        value={generateQuantityOutput()}
      />
    </div>
  );
};

export default App;
