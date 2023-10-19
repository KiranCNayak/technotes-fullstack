import React, { useEffect, useState } from 'react';
import { useUpdateUserMutation, useDeleteUserMutation } from './usersApiSlice';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { ROLES } from '../../config/roles';

const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

const EditUserForm = ({ user }) => {
  const [username, setUsername] = useState(user.username);
  const [isValidUsername, setIsValidUsername] = useState(false);
  const [password, setPassword] = useState('');
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [roles, setRoles] = useState(['Employee']);
  const [isActive, setIsActive] = useState(user.isActive);

  const navigate = useNavigate();

  const [updateUser, { isLoading, isSuccess, isError, error }] =
    useUpdateUserMutation();

  const [
    deleteUser,
    { isSuccess: isDelSuccess, isError: isDelError, error: delError },
  ] = useDeleteUserMutation();

  useEffect(() => {
    setIsValidUsername(USER_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    setIsValidPassword(PWD_REGEX.test(password));
  }, [password]);

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setUsername('');
      setPassword('');
      setRoles([]);
      navigate('/dash/users');
    }
  }, [isSuccess, isDelSuccess, navigate]);

  const onUsernameChanged = e => setUsername(e.target.value);
  const onPasswordChanged = e => setPassword(e.target.value);

  const onRolesChanged = e => {
    const values = Array.from(e.target.selectedOptions, option => option.value);
    setRoles(values);
  };

  const onIsActiveChanged = () => {
    setIsActive(prev => !prev);
  };

  const onSaveUserClicked = async e => {
    await updateUser({
      _id: user.id,
      username,
      ...(password ? { password } : {}),
      roles,
      isActive,
    });
  };

  const onDeleteUserClicked = async () => {
    await deleteUser({ _id: user.id });
  };

  const options = Object.values(ROLES).map(role => {
    return (
      <option key={role} value={role}>
        {role}
      </option>
    );
  });

  let canSave;
  if (password) {
    canSave =
      [roles.length, isValidUsername, isValidPassword].every(Boolean) &&
      !isLoading;
  } else {
    canSave = [roles.length, isValidUsername].every(Boolean) && !isLoading;
  }

  const errClass = isError || isDelError ? 'errmsg' : 'offscreen';
  const validUserClass = !isValidUsername ? 'form__input--incomplete' : '';
  const validPwdClass =
    password && !isValidPassword ? 'form__input--incomplete' : '';
  const validRolesClass = !Boolean(roles.length)
    ? 'form__input--incomplete'
    : '';

  const errContent = (error?.data?.message || delError?.data?.message) ?? '';

  const content = (
    <>
      <p className={errClass}>{errContent}</p>

      <form className="form" onSubmit={e => e.preventDefault()}>
        <div className="form__title-row">
          <h2>Edit User</h2>
          <div className="form__action-buttons">
            <button
              className="icon-button"
              title="Save"
              disabled={!canSave}
              onClick={onSaveUserClicked}>
              <FontAwesomeIcon icon={faSave} />
            </button>
            <button
              className="icon-button"
              title="Delete"
              onClick={onDeleteUserClicked}>
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          </div>
        </div>

        <label className="form__label" htmlFor="username">
          Username: <span className="nowrap">[3-20 letters]</span>
        </label>
        <input
          className={`form__input ${validUserClass}`}
          id="username"
          name="username"
          type="text"
          autoComplete="off"
          value={username}
          onChange={onUsernameChanged}
        />

        <label className="form__label" htmlFor="password">
          Password: <span className="nowrap">[4-12 letters]</span>
        </label>
        <input
          className={`form__input ${validPwdClass}`}
          id="password"
          name="password"
          type="password"
          autoComplete="off"
          value={password}
          onChange={onPasswordChanged}
        />

        <label
          className="form__label form__checkbox-container"
          htmlFor="user-active">
          ACTIVE:
          <input
            className="form__checkbox"
            id="user-active"
            name="user-active"
            type="checkbox"
            checked={isActive}
            onChange={onIsActiveChanged}
          />
        </label>

        <label className="form__label" htmlFor="roles">
          ASSIGNED ROLES:
        </label>
        <select
          className={`form__input ${validRolesClass}`}
          id="roles"
          name="roles"
          type="text"
          multiple={true}
          size="3"
          value={roles}
          onChange={onRolesChanged}>
          {options}
        </select>
      </form>
    </>
  );

  return content;
};

export default EditUserForm;
