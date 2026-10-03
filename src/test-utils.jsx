import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import {
  isAuthLoginReducer,
  isAuthRegisterReducer,
  isAuthLogoutReducer,
} from "./features/auth/states/reducer";
import {
  usersReducer,
  userReducer,
  profileReducer,
  isProfileReducer,
  isChangeProfileReducer,
  isChangeProfilePhotoReducer,
  isChangeProfilePasswordReducer,
} from "./features/users/states/reducer";
import {
  todosReducer,
  todoReducer,
  isTodoReducer,
  isTodoAddReducer,
  isTodoAddedReducer,
  isTodoChangeReducer,
  isTodoChangedReducer,
  isTodoChangeCoverReducer,
  isTodoChangedCoverReducer,
  isTodoDeleteReducer,
  isTodoDeletedReducer,
} from "./features/todos/states/reducer";

export function createMockStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      isAuthLogin: isAuthLoginReducer,
      isAuthRegister: isAuthRegisterReducer,
      isAuthLogout: isAuthLogoutReducer,
      users: usersReducer,
      user: userReducer,
      profile: profileReducer,
      isProfile: isProfileReducer,
      isChangeProfile: isChangeProfileReducer,
      isChangeProfilePhoto: isChangeProfilePhotoReducer,
      isChangeProfilePassword: isChangeProfilePasswordReducer,
      todos: todosReducer,
      todo: todoReducer,
      isTodo: isTodoReducer,
      isTodoAdd: isTodoAddReducer,
      isTodoAdded: isTodoAddedReducer,
      isTodoChange: isTodoChangeReducer,
      isTodoChanged: isTodoChangedReducer,
      isTodoChangeCover: isTodoChangeCoverReducer,
      isTodoChangedCover: isTodoChangedCoverReducer,
      isTodoDelete: isTodoDeleteReducer,
      isTodoDeleted: isTodoDeletedReducer,
    },
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false,
      }),
  });
}

export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    store = createMockStore(preloadedState),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <BrowserRouter>{children}</BrowserRouter>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
