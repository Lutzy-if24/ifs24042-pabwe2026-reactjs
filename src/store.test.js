import { describe, it, expect } from "vitest";
import store from "./store";

describe("store configuration", () => {
  it("should configure store with all auth, users, and lost-founds reducers", () => {
    const state = store.getState();
    expect(state).toHaveProperty("isAuthLogin");
    expect(state).toHaveProperty("isAuthRegister");
    expect(state).toHaveProperty("isAuthLogout");

    expect(state).toHaveProperty("users");
    expect(state).toHaveProperty("user");
    expect(state).toHaveProperty("profile");
    expect(state).toHaveProperty("isProfile");
    expect(state).toHaveProperty("isChangeProfile");
    expect(state).toHaveProperty("isChangeProfilePhoto");
    expect(state).toHaveProperty("isChangeProfilePassword");

    expect(state).toHaveProperty("lostFounds");
    expect(state).toHaveProperty("lostFound");
    expect(state).toHaveProperty("isLostFound");
    expect(state).toHaveProperty("isLostFoundAdd");
    expect(state).toHaveProperty("isLostFoundAdded");
    expect(state).toHaveProperty("isLostFoundChange");
    expect(state).toHaveProperty("isLostFoundChanged");
    expect(state).toHaveProperty("isLostFoundChangeCover");
    expect(state).toHaveProperty("isLostFoundChangedCover");
    expect(state).toHaveProperty("isLostFoundDelete");
    expect(state).toHaveProperty("isLostFoundDeleted");
    expect(state).toHaveProperty("lostFoundStats");
  });
});
