"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSearchTerm, setSelectedType } from "../features/pokemon/pokemonSlice";
import { useGetTypesQuery } from "../features/pokemon/pokemonAPI";
import styles from "./SearchBar.module.css";

const TYPE_COLORS = {
  Fire:"#FF6B35", Water:"#4FC3F7", Grass:"#66BB6A", Lightning:"#FFD600",
  Psychic:"#CE93D8", Fighting:"#FF8A65", Darkness:"#7986CB", Metal:"#90A4AE",
  Dragon:"#9575CD", Colorless:"#BDBDBD", Fairy:"#F48FB1",
};
const TYPE_ICONS = {
  Fire:"🔥", Water:"💧", Grass:"🌿", Lightning:"⚡", Psychic:"🔮",
  Fighting:"👊", Darkness:"🌑", Metal:"⚙️", Dragon:"🐉", Colorless:"⭕", Fairy:"✨",
};

export default function SearchBar() {
  const dispatch = useDispatch();
  const { selectedType } = useSelector((s) => s.pokemon);
  const [inputVal, setInputVal] = useState("");
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);
  const { data: typesData } = useGetTypesQuery();

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = useCallback((e) => {
    const val = e.target.value;
    setInputVal(val);
    const t = setTimeout(() => dispatch(setSearchTerm(val)), 380);
    return () => clearTimeout(t);
  }, [dispatch]);

  const selectType = (type) => {
    dispatch(setSelectedType(selectedType === type ? "" : type));
    setDropOpen(false);
  };

  const activeColor = TYPE_COLORS[selectedType] || null;

  return (
    <div className={styles.wrap}>
      <div className={styles.row}>

        {/* Search input */}
        <div className={styles.searchBox}>
          <span className={styles.icon}>⌕</span>
          <input
            className={styles.input}
            type="text"
            placeholder="Search Pokémon cards by name…"
            value={inputVal}
            onChange={handleSearch}
          />
          {inputVal && (
            <button className={styles.clearBtn}
              onClick={() => { setInputVal(""); dispatch(setSearchTerm("")); }}>✕</button>
          )}
        </div>

        {/* Type dropdown */}
        <div className={styles.dropWrap} ref={dropRef}>
          <button
            className={styles.dropTrigger}
            style={activeColor ? {
              borderColor: `${activeColor}66`,
              color: activeColor,
              background: `${activeColor}14`,
            } : {}}
            onClick={() => setDropOpen((v) => !v)}
          >
            <span>{selectedType ? `${TYPE_ICONS[selectedType] || "●"} ${selectedType}` : "All Types"}</span>
            <span className={`${styles.caret} ${dropOpen ? styles.caretOpen : ""}`}>▾</span>
          </button>

          {dropOpen && (
            <div className={styles.dropdown}>
              <button
                className={`${styles.dropItem} ${selectedType === "" ? styles.dropItemActive : ""}`}
                onClick={() => selectType("")}
              >
                <span className={styles.dropIcon}>⭐</span>
                <span>All Types</span>
              </button>
              {typesData?.data?.map((type) => (
                <button
                  key={type}
                  className={`${styles.dropItem} ${selectedType === type ? styles.dropItemActive : ""}`}
                  style={selectedType === type ? {
                    color: TYPE_COLORS[type],
                    background: `${TYPE_COLORS[type]}14`,
                  } : {}}
                  onClick={() => selectType(type)}
                >
                  <span className={styles.dropIcon}>{TYPE_ICONS[type] || "●"}</span>
                  <span>{type}</span>
                  {selectedType === type && <span className={styles.dropCheck}>✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}