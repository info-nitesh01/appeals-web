import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface MyEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  type: "event" | "reminder";
  allDay?: boolean;
  description?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const calendarApi = createApi({
  reducerPath: 'calendarApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: baseUrl
  }),
  tagTypes: ['Events'],
  endpoints: (builder) => ({
    getEvents: builder.query<MyEvent[], void>({
      query: () => 'events',
      providesTags: ['Events'],
    }),
    getEvent: builder.query<MyEvent, string>({
      query: (id) => `events/${id}`,
      providesTags: (result, error, id) => [{ type: 'Events', id }],
    }),
    addEvent: builder.mutation<MyEvent, Partial<MyEvent>>({
      query: (newEvent) => ({
        url: 'events',
        method: 'POST',
        body: newEvent,
      }),
      invalidatesTags: ['Events'],
    }),
    updateEvent: builder.mutation<MyEvent, Partial<MyEvent>>({
      query: ({ id, ...patch }) => ({
        url: `events/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ['Events'],
    }),
    deleteEvent: builder.mutation<void, string>({
      query: (id) => ({
        url: `events/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Events'],
    }),
  }),
});

export const {
  useGetEventsQuery,
  useGetEventQuery,
  useAddEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
} = calendarApi;