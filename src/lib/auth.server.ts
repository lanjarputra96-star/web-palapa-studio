import { getCookie, setCookie, deleteCookie } from "@tanstack/react-start/server";
import { d1Query } from "./d1.server";

const COOKIE = "sdn1_sid";
let ready = false;

const hex = (b: ArrayBuffer | Uint8Array) => Array.from(new Uint8Array(b)).map((x) => x.toString(16).padStart(2, "0")).join("");
const randomHex = (n: number) => hex(crypto.getRandomValues(new Uint8Array(n)));

export async function hashPassword(password: string, salt: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt: new TextEncoder().encode(salt), iterations: 100000, hash: "SHA-256" }, key, 256);
  return hex(bits);
}

export async function ensureTables() {
  if (ready) return;
  await d1Query("CREATE TABLE IF NOT EXISTS admin_users (username TEXT PRIMARY KEY, password_hash TEXT NOT NULL, salt TEXT NOT NULL)");
  await d1Query("CREATE TABLE IF NOT EXISTS admin_sessions (token TEXT PRIMARY KEY, username TEXT NOT NULL, expires_at INTEGER NOT NULL)");
  await d1Query("CREATE TABLE IF NOT EXISTS site_images (id TEXT PRIMARY KEY, mime TEXT NOT NULL, data TEXT NOT NULL)");
  const rows = await d1Query("SELECT username FROM admin_users WHERE username = 'admin'");
  if (!rows.length) {
    const salt = randomHex(16);
    await d1Query("INSERT INTO admin_users (username, password_hash, salt) VALUES ('admin', ?, ?)", [await hashPassword("admin123", salt), salt]);
  }
  ready = true;
}

export async function verifyPassword(username: string, password: string) {
  await ensureTables();
  const rows = await d1Query<{ password_hash: string; salt: string }>("SELECT password_hash, salt FROM admin_users WHERE username = ?", [username]);
  return !!rows[0] && (await hashPassword(password, rows[0].salt)) === rows[0].password_hash;
}

export async function createSession(username: string) {
  const token = randomHex(32);
  const maxAge = 60 * 60 * 24 * 7;
  await d1Query("DELETE FROM admin_sessions WHERE expires_at < ?", [Date.now()]);
  await d1Query("INSERT INTO admin_sessions (token, username, expires_at) VALUES (?, ?, ?)", [token, username, Date.now() + maxAge * 1000]);
  setCookie(COOKIE, token, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge });
}

export async function currentAdmin(): Promise<string | null> {
  const token = getCookie(COOKIE);
  if (!token) return null;
  await ensureTables();
  const rows = await d1Query<{ username: string }>("SELECT username FROM admin_sessions WHERE token = ? AND expires_at > ?", [token, Date.now()]);
  return rows[0]?.username ?? null;
}

export async function requireAdmin() {
  const u = await currentAdmin();
  if (!u) throw new Error("Unauthorized");
  return u;
}

export async function destroySession() {
  const token = getCookie(COOKIE);
  if (token) await d1Query("DELETE FROM admin_sessions WHERE token = ?", [token]);
  deleteCookie(COOKIE, { path: "/" });
}

export async function setPassword(username: string, password: string) {
  const salt = randomHex(16);
  await d1Query("UPDATE admin_users SET password_hash = ?, salt = ? WHERE username = ?", [await hashPassword(password, salt), salt, username]);
}

export function newImageId() {
  return `${Date.now()}-${randomHex(4)}`;
}
