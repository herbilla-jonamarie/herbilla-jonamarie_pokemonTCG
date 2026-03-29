"use client";
import { useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import CardGrid from "./components/CardGrid";
import CardModal from "./components/CardModal";
import styles from "./page.module.css";

export default function Home() {
  const { activeTab } = useSelector((s) => s.pokemon);

  return (
    <div className={styles.page}>
      <div className={styles.bgEffects} aria-hidden="true">
        <div className={styles.orb1} />
        <div className={styles.orb2} />
        <div className={styles.orb3} />
        <div className={styles.gridOverlay} />
        <div className={styles.bolt1} />
        <div className={styles.bolt2} />
      </div>

      <Navbar />

      <main className={styles.main}>
        {activeTab === "browse" && (
          <section className={styles.hero}>
            <p className={styles.heroEyebrow}>⚡ Pokémon TCG · Card Gallery</p>
            <h1 className={styles.heroTitle}>
              <span className={styles.titleLine1}>PokéArena</span>
              <span className={styles.titleLine2}>
                <span className={styles.titleGold}>TCG</span>{" "}
                <span className={styles.titleWhite}>Explorer</span>
              </span>
            </h1>
            <p className={styles.heroSub}>
              Browse 20,000+ Pokémon TCG cards. Search, filter by HP &amp; rarity,
              flip to inspect, and build your collection.
            </p>
          </section>
        )}

        {activeTab === "browse" && <SearchBar />}
        <CardGrid />
      </main>

      <CardModal />
    </div>
  );
}