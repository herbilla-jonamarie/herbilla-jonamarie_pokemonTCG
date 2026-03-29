"use client";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedCard, setCurrentPage,
  toggleFavorite, toggleCollection,
} from "../features/pokemon/pokemonSlice";
import { useGetCardsQuery } from "../features/pokemon/pokemonAPI";
import styles from "./CardGrid.module.css";

export const TYPE_META = {
  Fire:      { color:"#FF6B35", gradient:"linear-gradient(135deg,#ff6b35,#ff0000)", bg:"rgba(255,107,53,0.13)"  },
  Water:     { color:"#4FC3F7", gradient:"linear-gradient(135deg,#1e90ff,#00bcd4)", bg:"rgba(79,195,247,0.13)"  },
  Grass:     { color:"#66BB6A", gradient:"linear-gradient(135deg,#56ab2f,#a8e063)", bg:"rgba(102,187,106,0.13)" },
  Lightning: { color:"#FFD600", gradient:"linear-gradient(135deg,#f7971e,#ffd200)", bg:"rgba(255,214,0,0.13)"   },
  Psychic:   { color:"#CE93D8", gradient:"linear-gradient(135deg,#8e2de2,#f64f59)", bg:"rgba(206,147,216,0.13)" },
  Fighting:  { color:"#FF8A65", gradient:"linear-gradient(135deg,#c94b4b,#4b134f)", bg:"rgba(255,138,101,0.13)" },
  Darkness:  { color:"#7986CB", gradient:"linear-gradient(135deg,#1a1a2e,#16213e)", bg:"rgba(121,134,203,0.13)" },
  Metal:     { color:"#90A4AE", gradient:"linear-gradient(135deg,#bdc3c7,#2c3e50)", bg:"rgba(144,164,174,0.13)" },
  Dragon:    { color:"#9575CD", gradient:"linear-gradient(135deg,#4776e6,#8e54e9)", bg:"rgba(149,117,205,0.13)" },
  Colorless: { color:"#BDBDBD", gradient:"linear-gradient(135deg,#606c88,#3f4c6b)", bg:"rgba(189,189,189,0.13)" },
  Fairy:     { color:"#F48FB1", gradient:"linear-gradient(135deg,#f953c6,#b91d73)", bg:"rgba(244,143,177,0.13)" },
};

const SUPERTYPES = ["Pokémon", "Trainer", "Energy"];
const RARITIES   = ["Common","Uncommon","Rare","Rare Holo","Rare Ultra","Amazing Rare","Promo"];
const HP_RANGES  = [
  { label:"Any HP",         min:0,   max:9999 },
  { label:"Low  ≤ 60",      min:0,   max:60   },
  { label:"Mid  61 – 120",  min:61,  max:120  },
  { label:"High 121 – 200", min:121, max:200  },
  { label:"Tank  200 +",    min:201, max:9999 },
];

// ─── Reusable dropdown ────────────────────────────────────────────
function FilterDropdown({ label, value, options, onChange, accentColor }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const active = value !== "" && value !== options[0];

  return (
    <div className={styles.dropWrap} ref={ref}>
      <button
        className={`${styles.dropTrigger} ${active ? styles.dropTriggerActive : ""}`}
        style={active && accentColor ? {
          borderColor: `${accentColor}55`,
          color: accentColor,
          background: `${accentColor}0f`,
        } : {}}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={styles.dropLabel}>{label}</span>
        <span className={styles.dropValue}>{value || options[0]}</span>
        <span className={`${styles.caret} ${open ? styles.caretOpen : ""}`}>▾</span>
      </button>

      {open && (
        <div className={styles.dropPanel}>
          {options.map((opt) => (
            <button
              key={opt}
              className={`${styles.dropItem} ${value === opt || (!value && opt === options[0]) ? styles.dropItemActive : ""}`}
              onClick={() => { onChange(opt === options[0] ? "" : opt); setOpen(false); }}
            >
              {opt}
              {(value === opt || (!value && opt === options[0])) && (
                <span className={styles.dropCheck}>✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Flip card ────────────────────────────────────────────────────
function FlipCard({ card, onOpen }) {
  const dispatch = useDispatch();
  const { favorites, collection } = useSelector((s) => s.pokemon);
  const [flipped, setFlipped] = useState(false);

  const mainType = card.types?.[0] || "Colorless";
  const meta     = TYPE_META[mainType] || TYPE_META.Colorless;
  const isFav    = favorites.some((f) => f.id === card.id);
  const inColl   = collection.some((c) => c.id === card.id);
  const hp       = parseInt(card.hp) || 0;

  return (
    <div
      className={`${styles.flipScene} ${flipped ? styles.flipped : ""}`}
      onClick={() => setFlipped((v) => !v)}
    >
      {/* FRONT */}
      <div className={styles.face} style={{ "--c": meta.color, "--g": meta.gradient }}>
        <div className={styles.frontGlow} />
        <img src={card.images?.small} alt={card.name} className={styles.cardImg} loading="lazy" />
        <span className={styles.typePip} style={{ background: meta.color }}>{mainType}</span>
        <div className={styles.tapHint}>Tap to flip</div>
        <button
          className={`${styles.favBtn} ${isFav ? styles.favActive : ""}`}
          onClick={(e) => { e.stopPropagation(); dispatch(toggleFavorite(card)); }}
        >{isFav ? "♥" : "♡"}</button>
      </div>

      {/* BACK */}
      <div className={styles.faceBack} style={{ "--c": meta.color, "--bg": meta.bg }}>
        <div className={styles.backGlow} />

        <div className={styles.backHeader}>
          <img src={card.images?.small} alt={card.name} className={styles.backThumb} />
          <div className={styles.backMeta}>
            <h3 className={styles.backName} style={{ color: meta.color }}>{card.name}</h3>
            <p className={styles.backSub}>
              {card.supertype}{card.subtypes?.length ? ` · ${card.subtypes.join(", ")}` : ""}
            </p>
            {card.rarity && <p className={styles.backRarity}>{card.rarity}</p>}
          </div>
        </div>

        {hp > 0 && (
          <div className={styles.hpRow}>
            <span className={styles.hpLabel}>HP</span>
            <div className={styles.hpTrack}>
              <div className={styles.hpFill}
                style={{ width:`${Math.min(hp/340*100,100)}%`, background: meta.color }} />
            </div>
            <span className={styles.hpNum}>{card.hp}</span>
          </div>
        )}

        {card.attacks?.slice(0,2).map((atk,i) => (
          <div key={i} className={styles.atkRow}>
            <span className={styles.atkName}>{atk.name}</span>
            <span className={styles.atkDmg} style={{ color: meta.color }}>{atk.damage || "—"}</span>
          </div>
        ))}

        {card.weaknesses?.length > 0 && (
          <div className={styles.weakRow}>
            <span className={styles.weakLabel}>Weak</span>
            {card.weaknesses.map((w,i) => (
              <span key={i} className={styles.weakBadge}>{w.type} {w.value}</span>
            ))}
          </div>
        )}

        <div className={styles.setLine}>
          <span>{card.set?.name}</span>
          <span>#{card.number}</span>
        </div>

        <div className={styles.backActions}>
          <button
            className={`${styles.collBtn} ${inColl ? styles.collActive : ""}`}
            onClick={(e) => { e.stopPropagation(); dispatch(toggleCollection(card)); }}
          >{inColl ? "✦ Collected" : "✦ Collect"}</button>
          <button
            className={styles.detailBtn}
            style={{ "--c": meta.color }}
            onClick={(e) => { e.stopPropagation(); onOpen(card); }}
          >View Card ↗</button>
        </div>
      </div>
    </div>
  );
}

// ─── Shelf ────────────────────────────────────────────────────────
function CardShelf({ cards, title, emptyMsg, onOpen }) {
  if (cards.length === 0) {
    return (
      <div className={styles.shelfEmpty}>
        <p className={styles.shelfEmptyIcon}>{title === "Favorites" ? "♡" : "✦"}</p>
        <p>{emptyMsg}</p>
      </div>
    );
  }
  return (
    <div className={styles.shelfGrid}>
      {cards.map((card) => (
        <div key={card.id} className={styles.cardAnim}>
          <FlipCard card={card} onOpen={onOpen} />
        </div>
      ))}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────
export default function CardGrid() {
  const dispatch = useDispatch();
  const { searchTerm, selectedType, currentPage, viewMode, activeTab, favorites, collection } =
    useSelector((s) => s.pokemon);

  const [supertype,  setSupertype]  = useState("");
  const [rarity,     setRarity]     = useState("");
  const [hpRangeIdx, setHpRangeIdx] = useState(0);

  const { data, isLoading, isFetching, isError } = useGetCardsQuery({
    page: currentPage, pageSize: 20, search: searchTerm, type: selectedType,
  });

  const hpRange  = HP_RANGES[hpRangeIdx];
  const allCards = data?.data || [];
  const cards    = allCards.filter((c) => {
    if (supertype && c.supertype !== supertype) return false;
    if (rarity    && c.rarity   !== rarity)    return false;
    const hp = parseInt(c.hp) || 0;
    if (hpRangeIdx > 0 && (hp < hpRange.min || hp > hpRange.max)) return false;
    return true;
  });

  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / 20);
  const openCard   = (card) => dispatch(setSelectedCard(card));
  const anyFilter  = supertype || rarity || hpRangeIdx > 0;

  if (activeTab === "favorites") return (
    <div className={styles.container}>
      <div className={styles.shelfHeader}>
        <h2 className={styles.shelfTitle}>♥ My Favorites</h2>
        <span className={styles.shelfCount}>{favorites.length} cards</span>
      </div>
      <CardShelf cards={favorites} title="Favorites"
        emptyMsg="No favorites yet — flip a card and tap ♥." onOpen={openCard} />
    </div>
  );

  if (activeTab === "collection") return (
    <div className={styles.container}>
      <div className={styles.shelfHeader}>
        <h2 className={styles.shelfTitle}>✦ My Collection</h2>
        <span className={styles.shelfCount}>{collection.length} cards</span>
      </div>
      <CardShelf cards={collection} title="Collection"
        emptyMsg="Collection empty — flip a card and tap ✦ Collect." onOpen={openCard} />
    </div>
  );

  if (isLoading) return <LoadingGrid />;
  if (isError)   return <div className={styles.error}>Failed to load cards.</div>;

  return (
    <div className={styles.container}>

      {/* Compact filter row */}
      <div className={styles.filterRow}>
        <FilterDropdown
          label="Category"
          value={supertype}
          options={["All", ...SUPERTYPES]}
          onChange={setSupertype}
        />
        <FilterDropdown
          label="Rarity"
          value={rarity}
          options={["Any", ...RARITIES]}
          onChange={setRarity}
        />
        <FilterDropdown
          label="HP"
          value={HP_RANGES[hpRangeIdx].label}
          options={HP_RANGES.map((r) => r.label)}
          onChange={(val) => setHpRangeIdx(HP_RANGES.findIndex((r) => r.label === val))}
          accentColor="#4fc3f7"
        />

        <div className={styles.filterRight}>
          <span className={styles.resultMeta}>
            {isFetching ? "Loading…" : `${totalCount.toLocaleString()} cards`}
            {anyFilter && cards.length !== allCards.length &&
              <span className={styles.filteredCount}> · {cards.length} shown</span>}
          </span>
          {anyFilter && (
            <button className={styles.clearAll}
              onClick={() => { setSupertype(""); setRarity(""); setHpRangeIdx(0); }}>
              Clear ✕
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className={`${styles.grid} ${viewMode === "list" ? styles.listMode : ""}`}>
        {cards.map((card, i) => (
          <div key={card.id} className={styles.cardAnim} style={{ animationDelay:`${(i%20)*30}ms` }}>
            <FlipCard card={card} onOpen={openCard} />
          </div>
        ))}
      </div>

      {cards.length === 0 && !isLoading && (
        <p className={styles.empty}>No cards match your filters — try adjusting them.</p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button className={styles.pageBtn} disabled={currentPage === 1}
            onClick={() => dispatch(setCurrentPage(currentPage - 1))}>← Prev</button>
          <div className={styles.pageNumbers}>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let page;
              if (totalPages <= 5)                    page = i + 1;
              else if (currentPage <= 3)              page = i + 1;
              else if (currentPage >= totalPages - 2) page = totalPages - 4 + i;
              else                                    page = currentPage - 2 + i;
              return (
                <button key={page}
                  className={`${styles.pageNum} ${currentPage === page ? styles.activePage : ""}`}
                  onClick={() => dispatch(setCurrentPage(page))}>{page}</button>
              );
            })}
          </div>
          <button className={styles.pageBtn} disabled={currentPage === totalPages}
            onClick={() => dispatch(setCurrentPage(currentPage + 1))}>Next →</button>
        </div>
      )}
    </div>
  );
}

function LoadingGrid() {
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className={styles.skeleton} />
        ))}
      </div>
    </div>
  );
}