import React from 'react';
import { useSelector } from 'react-redux';

import NewNoteForm from './NewNoteForm';
import { selectAllUsers } from '../users/usersApiSlice';

const NewNote = () => {
  const users = useSelector(selectAllUsers);

  const content = users ? <NewNoteForm users={users} /> : <p>Loading...</p>;

  return content;
};

export default NewNote;
