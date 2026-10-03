import { describe, it, expect } from "vitest";
import { ActionType } from "./action";
import {
  lostFoundsReducer,
  lostFoundReducer,
  isLostFoundReducer,
  isLostFoundAddReducer,
  isLostFoundAddedReducer,
  isLostFoundChangeReducer,
  isLostFoundChangedReducer,
  isLostFoundChangeCoverReducer,
  isLostFoundChangedCoverReducer,
  isLostFoundDeleteReducer,
  isLostFoundDeletedReducer,
  lostFoundStatsReducer,
} from "./reducer";

describe("lost-founds reducers", () => {
  it("should return initial states when unknown action is passed", () => {
    expect(lostFoundsReducer(undefined, {})).toEqual([]);
    expect(lostFoundReducer(undefined, {})).toBeNull();
    expect(isLostFoundReducer(undefined, {})).toBe(false);
    expect(isLostFoundAddReducer(undefined, {})).toBe(false);
    expect(isLostFoundAddedReducer(undefined, {})).toBe(false);
    expect(isLostFoundChangeReducer(undefined, {})).toBe(false);
    expect(isLostFoundChangedReducer(undefined, {})).toBe(false);
    expect(isLostFoundChangeCoverReducer(undefined, {})).toBe(false);
    expect(isLostFoundChangedCoverReducer(undefined, {})).toBe(false);
    expect(isLostFoundDeleteReducer(undefined, {})).toBe(false);
    expect(isLostFoundDeletedReducer(undefined, {})).toBe(false);
    expect(lostFoundStatsReducer(undefined, {})).toEqual({});
  });

  it("should update lostFoundsReducer", () => {
    const next = lostFoundsReducer([], {
      type: ActionType.SET_LOST_FOUNDS,
      payload: [{ id: 1 }],
    });
    expect(next).toEqual([{ id: 1 }]);
  });

  it("should update lostFoundReducer", () => {
    const next = lostFoundReducer(null, {
      type: ActionType.SET_LOST_FOUND,
      payload: { id: 1 },
    });
    expect(next).toEqual({ id: 1 });
  });

  it("should update isLostFoundReducer", () => {
    expect(isLostFoundReducer(false, { type: ActionType.SET_IS_LOST_FOUND, payload: true })).toBe(true);
  });

  it("should update isLostFoundAddReducer", () => {
    expect(isLostFoundAddReducer(false, { type: ActionType.SET_IS_LOST_FOUND_ADD, payload: true })).toBe(true);
  });

  it("should update isLostFoundAddedReducer", () => {
    expect(isLostFoundAddedReducer(false, { type: ActionType.SET_IS_LOST_FOUND_ADDED, payload: true })).toBe(true);
  });

  it("should update isLostFoundChangeReducer", () => {
    expect(isLostFoundChangeReducer(false, { type: ActionType.SET_IS_LOST_FOUND_CHANGE, payload: true })).toBe(true);
  });

  it("should update isLostFoundChangedReducer", () => {
    expect(isLostFoundChangedReducer(false, { type: ActionType.SET_IS_LOST_FOUND_CHANGED, payload: true })).toBe(true);
  });

  it("should update isLostFoundChangeCoverReducer", () => {
    expect(isLostFoundChangeCoverReducer(false, { type: ActionType.SET_IS_LOST_FOUND_CHANGE_COVER, payload: true })).toBe(true);
  });

  it("should update isLostFoundChangedCoverReducer", () => {
    expect(isLostFoundChangedCoverReducer(false, { type: ActionType.SET_IS_LOST_FOUND_CHANGED_COVER, payload: true })).toBe(true);
  });

  it("should update isLostFoundDeleteReducer", () => {
    expect(isLostFoundDeleteReducer(false, { type: ActionType.SET_IS_LOST_FOUND_DELETE, payload: true })).toBe(true);
  });

  it("should update isLostFoundDeletedReducer", () => {
    expect(isLostFoundDeletedReducer(false, { type: ActionType.SET_IS_LOST_FOUND_DELETED, payload: true })).toBe(true);
  });

  it("should update lostFoundStatsReducer", () => {
    const next = lostFoundStatsReducer({}, {
      type: ActionType.SET_LOST_FOUND_STATS,
      payload: { stats_losts: { "01-01-2024": 1 } },
    });
    expect(next).toEqual({ stats_losts: { "01-01-2024": 1 } });
  });
});
