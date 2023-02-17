import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const placesApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/admin",
    prepareHeaders: (headers, { getState }) => {
      headers.set("Content-Type", "application/json");
      headers.set("Auth", "MIRRORDATA_API_ACCESS");

      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({
        url: `login`,
        method: "POST",
        body,
      }),
    }),
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
export const {
  useGetPlacesImagesMutation,
  useGetSelectedDataByIdMutation,
  useLoginMutation,
} = placesApi;
