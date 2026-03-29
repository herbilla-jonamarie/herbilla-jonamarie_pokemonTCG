import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const pokemonApi = createApi({
  reducerPath: "pokemonApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://api.pokemontcg.io/v2/" }),
  endpoints: (builder) => ({
    getCards: builder.query({
      query: ({ page = 1, pageSize = 20, search = "", type = "" }) => {
        const params = new URLSearchParams();
        params.set("page", page);
        params.set("pageSize", pageSize);
        const queries = [];
        if (search) queries.push(`name:"${search}*"`);
        if (type)   queries.push(`types:${type}`);
        if (queries.length > 0) params.set("q", queries.join(" "));
        return `cards?${params.toString()}`;
      },
    }),
    getCardById: builder.query({
      query: (id) => `cards/${id}`,
    }),
    getTypes: builder.query({
      query: () => "types",
    }),
  }),
});

export const { useGetCardsQuery, useGetCardByIdQuery, useGetTypesQuery } = pokemonApi;