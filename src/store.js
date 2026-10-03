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

const store = configureStore({
  reducer: {
    // Auth reducers
    isAuthLogin: isAuthLoginReducer,
    isAuthRegister: isAuthRegisterReducer,
    isAuthLogout: isAuthLogoutReducer,

    // Users reducers
    users: usersReducer,
    user: userReducer,
    profile: profileReducer,
    isProfile: isProfileReducer,
    isChangeProfile: isChangeProfileReducer,
    isChangeProfilePhoto: isChangeProfilePhotoReducer,
    isChangeProfilePassword: isChangeProfilePasswordReducer,

    // Todos reducers
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
});

export default store;
