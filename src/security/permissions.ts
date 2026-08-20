import { env } from "../config/env.js";

export function isOwner(userId: string): boolean {
  return Boolean(env.ownerId && env.ownerId === userId);
}

export function requireOwner(userId: string): void {
  if (!isOwner(userId)) {
    throw new Error("MYCTRA OWNER PERMISSION REQUIRED");
  }
}
