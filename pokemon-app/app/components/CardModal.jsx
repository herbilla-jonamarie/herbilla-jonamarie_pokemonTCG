"use client";
import { useDispatch, useSelector } from "react-redux";
import { clearSelectedCard, toggleFavorite, toggleCollection } from "../features/pokemon/pokemonSlice";
import styles from "./CardModal.module.css";

const TYPE_COLOR = {
  Fire: "#FF6B35", Water: "#4FC3F7", Grass: "#66BB6A", Lightning: "#FFD600",
  Psychic: "#CE93D8", Fighting: "#FF8A65", Darkness: "#7986CB", Metal: "#90A4AE",
  Dragon: "#9575CD", Colorless: "#BDBDBD", Fairy: "#F48FB1",
};

export default function CardModal() {
  const dispatch = useDispatch();
  const { selectedCard, favorites, collection } = useSelector((s) => s.pokemon);
  if (!selectedCard) return null;

  const card      = selectedCard;
  const mainType  = card.types?.[0] || "Colorless";
  const typeColor = TYPE_COLOR[mainType] || "#ffd600";
  const isFav     = favorites.some((f) => f.id === card.id);
  const inColl    = collection.some((c) => c.id === card.id);

  return (
    <div className={styles.overlay} onClick={() => dispatch(clearSelectedCard())}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

        <button className={styles.closeBtn} onClick={() => dispatch(clearSelectedCard())}>✕</button>

        <div className={styles.content}>

          {/* Left: Image */}
          <div className={styles.imageSection}>
            <div className={styles.cardFrame} style={{ "--tc": typeColor }}>
              <div className={styles.cardHalo} />
              {card.images?.large && (
                <img src={card.images.large} alt={card.name} className={styles.cardImage} />
              )}
            </div>

            <div className={styles.actionRow}>
              <button
                className={`${styles.actionBtn} ${isFav ? styles.actionFav : ""}`}
                onClick={() => dispatch(toggleFavorite(card))}
              >{isFav ? "♥ Saved" : "♡ Favorite"}</button>

              <button
                className={`${styles.actionBtn} ${inColl ? styles.actionColl : ""}`}
                onClick={() => dispatch(toggleCollection(card))}
              >{inColl ? "✦ Collected" : "✦ Collect"}</button>
            </div>
          </div>

          {/* Right: Details */}
          <div className={styles.details}>

            <div className={styles.types}>
              {card.types?.map((t) => (
                <span key={t} className={styles.typeBadge}
                  style={{
                    background: `${TYPE_COLOR[t] || "#ffd600"}1a`,
                    borderColor: `${TYPE_COLOR[t] || "#ffd600"}66`,
                    color: TYPE_COLOR[t] || "#ffd600",
                  }}>
                  {t}
                </span>
              ))}
              {card.supertype && (
                <span className={styles.supertypeBadge}>{card.supertype}</span>
              )}
            </div>

            <h2 className={styles.name} style={{ color: typeColor }}>{card.name}</h2>
            {card.subtypes?.length > 0 && (
              <p className={styles.subtitle}>{card.subtypes.join(" · ")}</p>
            )}

            {card.hp && (
              <div className={styles.hpBlock}>
                <div className={styles.hpTop}>
                  <span className={styles.hpLabel}>HP</span>
                  <span className={styles.hpValue} style={{ color: typeColor }}>{card.hp}</span>
                </div>
                <div className={styles.hpTrack}>
                  <div className={styles.hpFill}
                    style={{ width: `${Math.min(parseInt(card.hp) / 340 * 100, 100)}%`, background: typeColor }} />
                </div>
              </div>
            )}

            {card.attacks?.length > 0 && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Attacks</h3>
                {card.attacks.map((atk, i) => (
                  <div key={i} className={styles.attack}>
                    <div className={styles.atkHeader}>
                      <span className={styles.atkName}>{atk.name}</span>
                      <span className={styles.atkDamage} style={{ color: typeColor }}>{atk.damage || "—"}</span>
                    </div>
                    {atk.text && <p className={styles.atkText}>{atk.text}</p>}
                  </div>
                ))}
              </div>
            )}

            {card.abilities?.length > 0 && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Abilities</h3>
                {card.abilities.map((ab, i) => (
                  <div key={i} className={styles.attack}>
                    <div className={styles.atkHeader}>
                      <span className={styles.atkName}>{ab.name}</span>
                      <span className={styles.atkDamage} style={{ color: "#CE93D8" }}>{ab.type}</span>
                    </div>
                    {ab.text && <p className={styles.atkText}>{ab.text}</p>}
                  </div>
                ))}
              </div>
            )}

            <div className={styles.statsRow}>
              {card.weaknesses?.length > 0 && (
                <div className={styles.statBox}>
                  <span className={styles.statLabel}>Weakness</span>
                  {card.weaknesses.map((w, i) => (
                    <span key={i} className={styles.statValue}>{w.type} {w.value}</span>
                  ))}
                </div>
              )}
              {card.resistances?.length > 0 && (
                <div className={styles.statBox}>
                  <span className={styles.statLabel}>Resistance</span>
                  {card.resistances.map((r, i) => (
                    <span key={i} className={styles.statValue}>{r.type} {r.value}</span>
                  ))}
                </div>
              )}
              {card.retreatCost?.length > 0 && (
                <div className={styles.statBox}>
                  <span className={styles.statLabel}>Retreat</span>
                  <span className={styles.statValue}>{card.retreatCost.length} ◆</span>
                </div>
              )}
            </div>

            <div className={styles.setInfo}>
              {card.set?.images?.symbol && (
                <img src={card.set.images.symbol} alt="" className={styles.setSymbol} />
              )}
              <span className={styles.setName}>{card.set?.name}</span>
              <span className={styles.setNum}>#{card.number} / {card.set?.printedTotal || card.set?.total}</span>
              {card.rarity && <span className={styles.rarity}>{card.rarity}</span>}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}