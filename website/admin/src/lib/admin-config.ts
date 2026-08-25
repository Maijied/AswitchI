export const DEFAULT_MASTER_ADMIN = "mdshuvo40@gmail.com";

export const WHITELISTED_ADMINS: string[] = [
  DEFAULT_MASTER_ADMIN.toLowerCase(),
  "lorapokdev@gmail.com",
  "maizied@lorapok.tech"
];

export function isMasterAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  const clean = email.trim().toLowerCase();
  const envAdmin = (import.meta.env.VITE_ADMIN_MASTER_EMAIL || "").trim().toLowerCase();
  if (envAdmin && clean === envAdmin) return true;
  return WHITELISTED_ADMINS.includes(clean);
}

export function getAdminRole(email: string | null | undefined): string {
  if (!email) return "Unauthorized";
  const clean = email.trim().toLowerCase();
  if (clean === DEFAULT_MASTER_ADMIN.toLowerCase()) return "Master Admin (Executive)";
  if (clean === "lorapokdev@gmail.com") return "Lorapok Ops Officer";
  if (clean === "maizied@lorapok.tech") return "Principal Architect";
  return "Authorized Admin";
}
