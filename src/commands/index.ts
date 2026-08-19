import { pingCommand } from "./ping.js";
import { registerCommand } from "./registry.js";

export function registerCommands(): void {
  registerCommand(pingCommand);
}
