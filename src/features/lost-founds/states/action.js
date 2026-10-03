import {
  showErrorDialog,
  showSuccessDialog,
} from "../../../helpers/toolsHelper";
import lostFoundApi from "../api/lostFoundApi";

export const ActionType = {
  SET_LOST_FOUNDS: "SET_LOST_FOUNDS",
  SET_LOST_FOUND: "SET_LOST_FOUND",
  SET_IS_LOST_FOUND: "SET_IS_LOST_FOUND",
  SET_IS_LOST_FOUND_ADD: "SET_IS_LOST_FOUND_ADD",
  SET_IS_LOST_FOUND_ADDED: "SET_IS_LOST_FOUND_ADDED",
  SET_IS_LOST_FOUND_CHANGE: "SET_IS_LOST_FOUND_CHANGE",
  SET_IS_LOST_FOUND_CHANGED: "SET_IS_LOST_FOUND_CHANGED",
  SET_IS_LOST_FOUND_CHANGE_COVER: "SET_IS_LOST_FOUND_CHANGE_COVER",
  SET_IS_LOST_FOUND_CHANGED_COVER: "SET_IS_LOST_FOUND_CHANGED_COVER",
  SET_IS_LOST_FOUND_DELETE: "SET_IS_LOST_FOUND_DELETE",
  SET_IS_LOST_FOUND_DELETED: "SET_IS_LOST_FOUND_DELETED",
  SET_LOST_FOUND_STATS: "SET_LOST_FOUND_STATS",
};

export function setLostFoundsActionCreator(lostFounds) {
  return {
    type: ActionType.SET_LOST_FOUNDS,
    payload: lostFounds,
  };
}

export function asyncSetLostFounds(options = {}) {
  return async (dispatch) => {
    try {
      const lostFounds = await lostFoundApi.getLostFounds(options);
      dispatch(setLostFoundsActionCreator(lostFounds));
    } catch (error) {
      dispatch(setLostFoundsActionCreator([]));
      showErrorDialog(error.message);
    }
  };
}

export function setLostFoundActionCreator(lostFound) {
  return {
    type: ActionType.SET_LOST_FOUND,
    payload: lostFound,
  };
}

export function setIsLostFoundActionCreator(status) {
  return {
    type: ActionType.SET_IS_LOST_FOUND,
    payload: status,
  };
}

export function asyncSetLostFound(id) {
  return async (dispatch) => {
    try {
      const lostFound = await lostFoundApi.getLostFoundById(id);
      dispatch(setLostFoundActionCreator(lostFound));
    } catch (error) {
      dispatch(setLostFoundActionCreator(null));
      showErrorDialog(error.message);
    } finally {
      dispatch(setIsLostFoundActionCreator(true));
    }
  };
}

export function setIsLostFoundAddActionCreator(isLostFoundAdd) {
  return {
    type: ActionType.SET_IS_LOST_FOUND_ADD,
    payload: isLostFoundAdd,
  };
}

export function setIsLostFoundAddedActionCreator(isLostFoundAdded) {
  return {
    type: ActionType.SET_IS_LOST_FOUND_ADDED,
    payload: isLostFoundAdded,
  };
}

export function asyncSetIsLostFoundAdd({ title, description, status }) {
  return async (dispatch) => {
    dispatch(setIsLostFoundAddActionCreator(true));
    dispatch(setIsLostFoundAddedActionCreator(false));
    try {
      const message = await lostFoundApi.postLostFound({ title, description, status });
      showSuccessDialog(message || "Barang berhasil ditambahkan!");
      dispatch(setIsLostFoundAddedActionCreator(true));
    } catch (error) {
      showErrorDialog(error.message);
      dispatch(setIsLostFoundAddedActionCreator(false));
    } finally {
      dispatch(setIsLostFoundAddActionCreator(false));
    }
  };
}

export function setIsLostFoundChangeActionCreator(isLostFoundChange) {
  return {
    type: ActionType.SET_IS_LOST_FOUND_CHANGE,
    payload: isLostFoundChange,
  };
}

export function setIsLostFoundChangedActionCreator(isLostFoundChanged) {
  return {
    type: ActionType.SET_IS_LOST_FOUND_CHANGED,
    payload: isLostFoundChanged,
  };
}

export function asyncSetIsLostFoundChange(id, { title, description, status, is_completed }) {
  return async (dispatch) => {
    dispatch(setIsLostFoundChangeActionCreator(true));
    dispatch(setIsLostFoundChangedActionCreator(false));
    try {
      const message = await lostFoundApi.putLostFound(id, {
        title,
        description,
        status,
        is_completed,
      });
      showSuccessDialog(message || "Barang berhasil diperbarui!");
      dispatch(setIsLostFoundChangedActionCreator(true));
    } catch (error) {
      showErrorDialog(error.message);
      dispatch(setIsLostFoundChangedActionCreator(false));
    } finally {
      dispatch(setIsLostFoundChangeActionCreator(false));
    }
  };
}

export function setIsLostFoundChangeCoverActionCreator(isLostFoundChangeCover) {
  return {
    type: ActionType.SET_IS_LOST_FOUND_CHANGE_COVER,
    payload: isLostFoundChangeCover,
  };
}

export function setIsLostFoundChangedCoverActionCreator(status) {
  return {
    type: ActionType.SET_IS_LOST_FOUND_CHANGED_COVER,
    payload: status,
  };
}

export function asyncSetIsLostFoundChangeCover(id, coverFile) {
  return async (dispatch) => {
    dispatch(setIsLostFoundChangeCoverActionCreator(true));
    dispatch(setIsLostFoundChangedCoverActionCreator(false));
    try {
      const message = await lostFoundApi.postLostFoundCover(id, coverFile);
      showSuccessDialog(message || "Cover berhasil diperbarui!");
      dispatch(setIsLostFoundChangedCoverActionCreator(true));
    } catch (error) {
      showErrorDialog(error.message);
      dispatch(setIsLostFoundChangedCoverActionCreator(false));
    } finally {
      dispatch(setIsLostFoundChangeCoverActionCreator(false));
    }
  };
}

export function setIsLostFoundDeleteActionCreator(isLostFoundDelete) {
  return {
    type: ActionType.SET_IS_LOST_FOUND_DELETE,
    payload: isLostFoundDelete,
  };
}

export function setIsLostFoundDeletedActionCreator(isLostFoundDeleted) {
  return {
    type: ActionType.SET_IS_LOST_FOUND_DELETED,
    payload: isLostFoundDeleted,
  };
}

export function asyncSetIsLostFoundDelete(id) {
  return async (dispatch) => {
    dispatch(setIsLostFoundDeleteActionCreator(true));
    dispatch(setIsLostFoundDeletedActionCreator(false));
    try {
      const message = await lostFoundApi.deleteLostFound(id);
      showSuccessDialog(message || "Barang berhasil dihapus!");
      dispatch(setIsLostFoundDeletedActionCreator(true));
    } catch (error) {
      showErrorDialog(error.message);
      dispatch(setIsLostFoundDeletedActionCreator(false));
    } finally {
      dispatch(setIsLostFoundDeleteActionCreator(false));
    }
  };
}

export function setLostFoundStatsActionCreator(stats) {
  return {
    type: ActionType.SET_LOST_FOUND_STATS,
    payload: stats,
  };
}

export function asyncSetLostFoundStats(options = {}) {
  return async (dispatch) => {
    try {
      const stats = await lostFoundApi.getLostFoundStats(options);
      dispatch(setLostFoundStatsActionCreator(stats));
    } catch (error) {
      dispatch(setLostFoundStatsActionCreator({}));
      showErrorDialog(error.message);
    }
  };
}
