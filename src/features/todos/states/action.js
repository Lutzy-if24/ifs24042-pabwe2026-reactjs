import {
  showErrorDialog,
  showSuccessDialog,
} from "../../../helpers/toolsHelper";
import todoApi from "../api/todoApi";

export const ActionType = {
  SET_TODOS: "SET_TODOS",
  SET_TODO: "SET_TODO",
  SET_IS_TODO: "SET_IS_TODO",
  SET_IS_TODO_ADD: "SET_IS_TODO_ADD",
  SET_IS_TODO_ADDED: "SET_IS_TODO_ADDED",
  SET_IS_TODO_CHANGE: "SET_IS_TODO_CHANGE",
  SET_IS_TODO_CHANGED: "SET_IS_TODO_CHANGED",
  SET_IS_TODO_CHANGE_COVER: "SET_IS_TODO_CHANGE_COVER",
  SET_IS_TODO_CHANGED_COVER: "SET_IS_TODO_CHANGED_COVER",
  SET_IS_TODO_DELETE: "SET_IS_TODO_DELETE",
  SET_IS_TODO_DELETED: "SET_IS_TODO_DELETED",
};

export function setTodosActionCreator(todos) {
  return {
    type: ActionType.SET_TODOS,
    payload: todos,
  };
}

export function asyncSetTodos(is_finished = "") {
  return async (dispatch) => {
    try {
      const todos = await todoApi.getTodos(is_finished);
      dispatch(setTodosActionCreator(todos));
    } catch (error) {
      dispatch(setTodosActionCreator([]));
    }
  };
}

export function setTodoActionCreator(todo) {
  return {
    type: ActionType.SET_TODO,
    payload: todo,
  };
}

export function setIsTodoActionCreator(status) {
  return {
    type: ActionType.SET_IS_TODO,
    payload: status,
  };
}

export function asyncSetTodo(todoId) {
  return async (dispatch) => {
    try {
      const todo = await todoApi.getTodoById(todoId);
      dispatch(setTodoActionCreator(todo));
    } catch (error) {
      dispatch(setTodoActionCreator(null));
    } finally {
      dispatch(setIsTodoActionCreator(true));
    }
  };
}

export function setIsTodoAddActionCreator(isTodoAdd) {
  return {
    type: ActionType.SET_IS_TODO_ADD,
    payload: isTodoAdd,
  };
}

export function setIsTodoAddedActionCreator(isTodoAdded) {
  return {
    type: ActionType.SET_IS_TODO_ADDED,
    payload: isTodoAdded,
  };
}

export function asyncSetIsTodoAdd(title, description) {
  return async (dispatch) => {
    try {
      await todoApi.postTodo(title, description);
      showSuccessDialog("Todo berhasil ditambahkan!");
      dispatch(setIsTodoAddedActionCreator(true));
    } catch (error) {
      showErrorDialog(error.message);
      dispatch(setIsTodoAddedActionCreator(false));
    } finally {
      dispatch(setIsTodoAddActionCreator(true));
    }
  };
}

export function setIsTodoChangeActionCreator(isTodoChange) {
  return {
    type: ActionType.SET_IS_TODO_CHANGE,
    payload: isTodoChange,
  };
}

export function setIsTodoChangedActionCreator(isTodoChanged) {
  return {
    type: ActionType.SET_IS_TODO_CHANGED,
    payload: isTodoChanged,
  };
}

export function asyncSetIsTodoChange(todoId, title, description, is_finished) {
  return async (dispatch) => {
    try {
      const message = await todoApi.putTodo(
        todoId,
        title,
        description,
        is_finished
      );
      showSuccessDialog(message || "Todo berhasil diperbarui!");
      dispatch(setIsTodoChangedActionCreator(true));
    } catch (error) {
      showErrorDialog(error.message);
      dispatch(setIsTodoChangedActionCreator(false));
    } finally {
      dispatch(setIsTodoChangeActionCreator(true));
    }
  };
}

export function setIsTodoChangeCoverActionCreator(isTodoChangeCover) {
  return {
    type: ActionType.SET_IS_TODO_CHANGE_COVER,
    payload: isTodoChangeCover,
  };
}

export function setIsTodoChangedCoverActionCreator(status) {
  return {
    type: ActionType.SET_IS_TODO_CHANGED_COVER,
    payload: status,
  };
}

export function asyncSetIsTodoChangeCover(todoId, cover) {
  return async (dispatch) => {
    try {
      const message = await todoApi.postTodoCover(todoId, cover);
      showSuccessDialog(message || "Cover berhasil diperbarui!");
      dispatch(setIsTodoChangedCoverActionCreator(true));
    } catch (error) {
      showErrorDialog(error.message);
      dispatch(setIsTodoChangedCoverActionCreator(false));
    } finally {
      dispatch(setIsTodoChangeCoverActionCreator(true));
    }
  };
}

export function setIsTodoDeleteActionCreator(isTodoDelete) {
  return {
    type: ActionType.SET_IS_TODO_DELETE,
    payload: isTodoDelete,
  };
}

export function setIsTodoDeletedActionCreator(isTodoDeleted) {
  return {
    type: ActionType.SET_IS_TODO_DELETED,
    payload: isTodoDeleted,
  };
}

export function asyncSetIsTodoDelete(todoId) {
  return async (dispatch) => {
    try {
      const message = await todoApi.deleteTodo(todoId);
      showSuccessDialog(message || "Todo berhasil dihapus!");
      dispatch(setIsTodoDeletedActionCreator(true));
    } catch (error) {
      showErrorDialog(error.message);
      dispatch(setIsTodoDeletedActionCreator(false));
    } finally {
      dispatch(setIsTodoDeleteActionCreator(true));
    }
  };
}
