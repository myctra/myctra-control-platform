import type { MyctraCommand } from "../types/command.js";

const commands = new Map<string, MyctraCommand>();

export function registerCommand(command: MyctraCommand): void {
  if (commands.has(command.data.name)) {
    throw new Error(`Duplicate command: ${command.data.name}`);
  }

  commands.set(command.data.name, command);
}

export function getCommand(name: string): MyctraCommand | undefined {
  return commands.get(name);
}

export function getCommands(): MyctraCommand[] {
  return [...commands.values()];
}
