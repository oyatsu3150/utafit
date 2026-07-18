import { describe, expect, it } from "vitest";
import { getSectionsForSong } from "@/data/lyrics";
import { canAccessAdmin } from "@/lib/access";

describe("曲のセクション順", () => {
  it("orderの昇順で返す", () => {
    const sections = getSectionsForSong("yoake-no-canvas");
    expect(sections.map((section) => section.order)).toEqual([1, 2, 3, 4, 5]);
  });
});

describe("管理画面アクセス", () => {
  it("未ログインと一般ユーザーを拒否する", () => {
    expect(canAccessAdmin(null)).toBe(false);
    expect(canAccessAdmin({ isAuthenticated: false })).toBe(false);
    expect(canAccessAdmin({ isAuthenticated: true, role: "user" })).toBe(false);
  });

  it("管理者だけを許可する", () => {
    expect(canAccessAdmin({ isAuthenticated: true, role: "admin" })).toBe(true);
  });
});
