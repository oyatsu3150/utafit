export type AdminIdentity = {
  isAuthenticated: boolean;
  role?: "user" | "admin";
};

/** Phase 2でSupabaseのセッションとrole判定へ置き換える境界です。 */
export function canAccessAdmin(identity: AdminIdentity | null): boolean {
  return Boolean(identity?.isAuthenticated && identity.role === "admin");
}
