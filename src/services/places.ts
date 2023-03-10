import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const placesApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_ENDPOINT,
    prepareHeaders: (headers, { getState }) => {
      headers.set("Content-Type", "application/json");
      headers.set("Auth", "MIRRORDATA_API_ACCESS");

      return headers;
    },
  }),
  endpoints: (builder) => ({
    getPlacesImages: builder.mutation({
      query: (body) => ({
        url: `getPlacesImages`,
        method: "POST",
        body,
      }),
    }),
    getSelectedDataById: builder.mutation({
      query: (body) => ({
        url: `getSelectedDataById`,
        method: "POST",
        body,
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetPlacesImagesMutation, useGetSelectedDataByIdMutation } =
  placesApi;
