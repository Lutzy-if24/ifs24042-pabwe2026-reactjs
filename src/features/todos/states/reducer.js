import { ActionType } from "./action";

export function todosReducer(states = [], action = {}) {
  switch (action.type) {
    case ActionType.SET_TODOS:
      return action.payload;
    default:
      return states;
  }
}

export function todoReducer(state = null, action = {}) {
  switch (action.type) {
    case ActionType.SET_TODO:
      return action.payload;
    default:
      return state;
  }
}

export function isTodoReducer(state = false, action = {}) {
  switch (action.type) {
    case ActionType.SET_IS_TODO:
      return action.payload;
    default:
      return state;
  }
}

export function isTodoAddReducer(state = false, action = {}) {
  switch (action.type) {
    case ActionType.SET_IS_TODO_ADD:
      return action.payload;
    default:
      return state;
  }
}

export function isTodoAddedReducer(state = false, action = {}) {
  switch (action.type) {
    case ActionType.SET_IS_TODO_ADDED:
      return action.payload;
    default:
      return state;
  }
}

export function isTodoChangeReducer(state = false, action = {}) {
  switch (action.type) {
    case ActionType.SET_IS_TODO_CHANGE:
      return action.payload;
    default:
      return state;
  }
}

export function isTodoChangedReducer(state = false, action = {}) {
  switch (action.type) {
    case ActionType.SET_IS_TODO_CHANGED:
      return action.payload;
    default:
      return state;
  }
}

export function isTodoChangeCoverReducer(state = false, action = {}) {
  switch (action.type) {
    case ActionType.SET_IS_TODO_CHANGE_COVER:
      return action.payload;
    default:
      return state;
  }
}

export function isTodoChangedCoverReducer(state = false, action = {}) {
  switch (action.type) {
    case ActionType.SET_IS_TODO_CHANGED_COVER:
      return action.payload;
    default:
      return state;
  }
}

export function isTodoDeleteReducer(state = false, action = {}) {
  switch (action.type) {
    case ActionType.SET_IS_TODO_DELETE:
      return action.payload;
    default:
      return state;
  }
}

export function isTodoDeletedReducer(state = false, action = {}) {
  switch (action.type) {
    case ActionType.SET_IS_TODO_DELETED:
      return action.payload;
    default:
      return state;
  }
}
