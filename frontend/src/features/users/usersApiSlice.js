import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';

import { apiSlice } from '../../app/api/apiSlice';

const usersAdapter = createEntityAdapter({});

const initialState = usersAdapter.getInitialState();

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    addNewUser: builder.mutation({
      query: newUserData => ({
        url: '/users',
        method: 'POST',
        body: { ...newUserData },
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

    deleteUser: builder.mutation({
      query: ({ _id }) => ({
        url: '/users',
        method: 'DELETE',
        body: { _id },
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'User', id: arg.id }],
    }),

    getUsers: builder.query({
      query: () => '/users',
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      transformResponse: responseData => {
        const loadedUsers = responseData.map(user => {
          user.id = user._id;
          return user;
        });
        return usersAdapter.setAll(initialState, loadedUsers);
      },

      providesTags: (result, _error, _arg) => {
        if (result?.ids) {
          return [
            { type: 'User', id: 'LIST' },
            ...result.ids.map(id => ({ type: 'User', id })),
          ];
        } else {
          return [{ type: 'User', id: 'LIST' }];
        }
      },
    }),

    updateUser: builder.mutation({
      query: updatedUserData => ({
        url: '/users',
        method: 'PATCH',
        body: { ...updatedUserData },
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'User', id: arg.id }],
    }),
  }),
});

export const {
  useAddNewUserMutation,
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} = usersApiSlice;

// SELECTORS
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select();

// Creating a Memoized selector
const selectUsersData = createSelector(
  selectUsersResult,
  usersResult => usersResult.data,
);

export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
} = usersAdapter.getSelectors(state => selectUsersData(state) ?? initialState);
