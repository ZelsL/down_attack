function getApiUrl() {
  return process.env.DISCORD_API_URL || "discord.api";
}

const discord = {
  api: getApiUrl(),
};

export default discord;
