import { createSlice } from "@reduxjs/toolkit";

const pokemonSlice = createSlice({
  name: "pokemon",
  initialState: {
    selectedCard: null,
    favorites: [],
    collection: [],
    searchTerm: "",
    selectedType: "",
    currentPage: 1,
    viewMode: "grid",
    activeTab: "browse",
  },
  reducers: {
    setSelectedCard:  (state, action) => { state.selectedCard = action.payload; },
    clearSelectedCard:(state)         => { state.selectedCard = null; },
    toggleFavorite: (state, action) => {
      const card   = action.payload;
      const exists = state.favorites.find((f) => f.id === card.id);
      if (exists) state.favorites = state.favorites.filter((f) => f.id !== card.id);
      else        state.favorites.push(card);
    },
    toggleCollection: (state, action) => {
      const card   = action.payload;
      const exists = state.collection.find((c) => c.id === card.id);
      if (exists) state.collection = state.collection.filter((c) => c.id !== card.id);
      else        state.collection.push(card);
    },
    setSearchTerm:  (state, action) => { state.searchTerm   = action.payload; state.currentPage = 1; },
    setSelectedType:(state, action) => { state.selectedType = action.payload; state.currentPage = 1; },
    setCurrentPage: (state, action) => { state.currentPage  = action.payload; },
    setViewMode:    (state, action) => { state.viewMode     = action.payload; },
    setActiveTab:   (state, action) => { state.activeTab    = action.payload; },
  },
});

export const {
  setSelectedCard, clearSelectedCard,
  toggleFavorite, toggleCollection,
  setSearchTerm, setSelectedType,
  setCurrentPage, setViewMode, setActiveTab,
} = pokemonSlice.actions;

export default pokemonSlice.reducer;