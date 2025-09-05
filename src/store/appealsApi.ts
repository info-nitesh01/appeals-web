import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Appeal {
  id?: number;
  taxYear: number;
  company: string;
  state: string;
  assessor: string;
  accountNumber: string;
  appealed: boolean;
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const appealsApi = createApi({
  reducerPath: 'appealsApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: baseUrl
  }),
  tagTypes: ['Appeals'],
  endpoints: (builder) => ({
    getAppeals: builder.query<Appeal[], void>({
      query: () => 'appeals',
      providesTags: ['Appeals'],
    }),
    getAppeal: builder.query<Appeal, number>({
      query: (id) => `appeals/${id}`,
      providesTags: (result, error, id) => [{ type: 'Appeals', id }],
    }),
    addAppeal: builder.mutation<Appeal, Partial<Appeal>>({
      query: (newAppeal) => ({
        url: 'appeals',
        method: 'POST',
        body: newAppeal,
      }),
      invalidatesTags: ['Appeals'],
    }),
    updateAppeal: builder.mutation<Appeal, Partial<Appeal>>({
      query: ({ id, ...patch }) => ({
        url: `appeals/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ['Appeals'],
    }),
    deleteAppeal: builder.mutation<void, number>({
      query: (id) => ({
        url: `appeals/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Appeals'],
    }),
  }),
});

export const {
  useGetAppealsQuery,
  useGetAppealQuery,
  useAddAppealMutation,
  useUpdateAppealMutation,
  useDeleteAppealMutation,
} = appealsApi;