export interface ServerConfig {
  guildId: string;
  locale: string;
  timezone: string;
  logsChannelId?: string;
  welcomeChannelId?: string;
  ratingsChannelId?: string;
  ticketsChannelId?: string;
}

const configs = new Map<string, ServerConfig>();

export function getServerConfig(guildId: string): ServerConfig {
  const existing = configs.get(guildId);

  if (existing) {
    return existing;
  }

  const config: ServerConfig = {
    guildId,
    locale: "en",
    timezone: "UTC",
  };

  configs.set(guildId, config);
  return config;
}

export function updateServerConfig(
  guildId: string,
  changes: Partial<Omit<ServerConfig, "guildId">>,
): ServerConfig {
  const current = getServerConfig(guildId);

  const updated: ServerConfig = {
    ...current,
    ...changes,
    guildId,
  };

  configs.set(guildId, updated);
  return updated;
}

export function deleteServerConfig(guildId: string): boolean {
  return configs.delete(guildId);
}
