import { MemoryDatabase } from "./memory.js";
import type { DatabaseAdapter } from "./types.js";

export const database: DatabaseAdapter = new MemoryDatabase();

export async function initializeDatabase(): Promise<void> {
  await database.connect();
  console.log("MYCTRA DATABASE: READY");
}

export {
  getServerConfig,
  updateServerConfig,
  deleteServerConfig,
} from "./server-config.js";

export type { ServerConfig } from "./server-config.js";
