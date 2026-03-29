"use client";
import { useDispatch, useSelector } from "react-redux";
import { setViewMode, setActiveTab } from "../features/pokemon/pokemonSlice";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const dispatch = useDispatch();
  const { viewMode, favorites, collection, activeTab } = useSelector((s) => s.pokemon);

  return (
    <nav className={styles.navbar}>
      {/* Logo */}
      <div className={styles.logo}>
        <span className={styles.bolt}>⚡</span>
        <span className={styles.brand}>
          Poké<span className={styles.arena}>Arena</span>
          <span className={styles.tcgBadge}>TCG</span>
        </span>
      </div>

      {/* Center nav tabs */}
      <div className={styles.navTabs}>
        {[
          { id: "browse",     label: "Browse" },
          { id: "favorites",  label: `♥ Favorites (${favorites.length})` },
          { id: "collection", label: `✦ Collection (${collection.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`${styles.navTab} ${activeTab === tab.id ? styles.navTabActive : ""}`}
            onClick={() => dispatch(setActiveTab(tab.id))}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Right: view toggle */}
      <div className={styles.viewToggle}>
        <button
          className={`${styles.viewBtn} ${viewMode === "grid" ? styles.active : ""}`}
          onClick={() => dispatch(setViewMode("grid"))}
          title="Grid"
        >⊞</button>
        <button
          className={`${styles.viewBtn} ${viewMode === "list" ? styles.active : ""}`}
          onClick={() => dispatch(setViewMode("list"))}
          title="List"
        >☰</button>
      </div>
    </nav>
  );
}