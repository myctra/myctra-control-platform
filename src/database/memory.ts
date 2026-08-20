import type { DatabaseAdapter } from "./types.js";

export class MemoryDatabase implements DatabaseAdapter {
  private connected = false;

  async connect(): Promise<void> {
    this.connected = true;
  }

  async disconnect(): Promise<void> {
    this.connected = false;
  }

  async healthCheck(): Promise<boolean> {
    return this.connected;
  }
}
