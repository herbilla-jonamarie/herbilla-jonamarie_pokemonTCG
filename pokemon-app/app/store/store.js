import { configureStore } from "@reduxjs/toolkit";
import { pokemonApi } from "../features/pokemon/pokemonAPI";
import pokemonReducer from "../features/pokemon/pokemonSlice";

export const store = configureStore({
  reducer: {
    pokemon: pokemonReducer,
    [pokemonApi.reducerPath]: pokemonApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(pokemonApi.middleware),
});