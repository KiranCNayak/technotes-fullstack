import React, { useCallback, useState } from 'react';

import './App.css';

import Layout from './components/Layout';
import Login from './features/auth/Login';
import Public from './components/Public';
import DashLayout from './components/DashLayout';
import { Route, Routes } from 'react-router-dom';
import Welcome from './features/auth/Welcome';
import NotesList from './features/notes/NotesList';
import UsersList from './features/users/UsersList';

const Card = ({ row, col }) => {
  return <div className="card">{CARDS_ARRAY[row][col]}</div>;
};

const CARDS_ARRAY = [
  [1, 4, 2, 3],
  [5, 3, 2, 6],
  [6, 4, 1, 5],
];

function App() {
  return (
    <Routes>
      <Route path={'/'} element={<Layout />}>
        <Route index element={<Public />} />
        <Route path={'login'} element={<Login />} />
        <Route path={'dash'} element={<DashLayout />}>
          <Route index element={<Welcome />} />
          <Route path="notes">
            <Route index element={<NotesList />} />
          </Route>
          <Route path="users">
            <Route index element={<UsersList />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
