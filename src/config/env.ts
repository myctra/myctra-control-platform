function readOptional(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value || undefined;
}

export const env = {
  discordToken: process.env.DISCORD_TOKEN?.trim(),
  ownerId: readOptional("MYCTRA_OWNER_ID"),
} as const;

export function validateEnvironment(): void {
  if (!env.discordToken) {
    throw new Error("DISCORD_TOKEN is missing from .env");
  }
}
