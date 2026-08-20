import { REST, Routes } from "discord.js";
import { getCommands } from "./registry.js";

export async function deployCommands(
  token: string,
  applicationId: string,
): Promise<void> {
  const rest = new REST({ version: "10" }).setToken(token);
  const commands = getCommands().map((command) => command.data.toJSON());

  await rest.put(Routes.applicationCommands(applicationId), {
    body: commands,
  });

  console.log(`MYCTRA COMMANDS DEPLOYED: ${commands.length}`);
}
