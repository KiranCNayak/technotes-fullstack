import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';

import { apiSlice } from '../../app/api/apiSlice';

const notesAdapter = createEntityAdapter({
  sortComparer: (a, b) =>
    a.completed === b.completed ? 0 : a.completed ? 1 : -1,
});

const initialState = notesAdapter.getInitialState();

export const notesApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    addNewNote: builder.mutation({
      query: initialNote => ({
        url: '/notes',
        method: 'POST',
        body: {
          ...initialNote,
        },
      }),
      invalidatesTags: [{ type: 'Note', id: 'LIST' }],
    }),

    deleteNote: builder.mutation({
      query: ({ id }) => ({
        url: '/notes',
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'Note', id: arg.id }],
    }),

    getNotes: builder.query({
      query: () => '/notes',
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      keepUnusedDataFor: 5, // in seconds
      transformResponse: responseData => {
        const loadedNotes = responseData.map(note => {
          note.id = note._id;
          return note;
        });
        return notesAdapter.setAll(initialState, loadedNotes);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'note', id: 'LIST' },
            ...result.ids.map(id => ({ type: 'note', id })),
          ];
        } else {
          return [{ type: 'note', id: 'LIST' }];
        }
      },
    }),

    updateNote: builder.mutation({
      query: initialNote => ({
        url: '/notes',
        method: 'PATCH',
        body: {
          ...initialNote,
        },
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'Note', id: arg.id }],
    }),
  }),
});

export const {
  useAddNewNoteMutation,
  useDeleteNoteMutation,
  useGetNotesQuery,
  useUpdateNoteMutation,
} = notesApiSlice;

// SELECTORS
export const selectNotesResult = notesApiSlice.endpoints.getNotes.select();

// Creating a Memoized selector
const selectNotesData = createSelector(
  selectNotesResult,
  notesResult => notesResult.data,
);

export const {
  selectAll: selectAllNotes,
  selectById: selectNoteById,
  selectIds: selectNoteIds,
} = notesAdapter.getSelectors(state => selectNotesData(state) ?? initialState);
