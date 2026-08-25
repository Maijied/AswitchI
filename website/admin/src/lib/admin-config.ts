export const MASTER_ADMIN = "mdshuvo40@gmail.com";

export function isMasterAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  const clean = email.trim().toLowerCase();
  return clean === MASTER_ADMIN.toLowerCase() || clean === "lorapokdev@gmail.com" || clean === "maizied@lorapok.tech";
}
