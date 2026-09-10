import discord from "~~/infra/discord.js";
import { ServiceError, ValidationError } from "~~/infra/errors.js";

async function discordRedirect(event) {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const redirectUri = process.env.DISCORD_REDIRECT_URI;

  return sendRedirect(
    event,
    `${discord.api}/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify`,
  );
}

async function fetchUserFromDiscord(code) {
  const userObject = await fetchUserInfo();
  return userObject;

  async function exchangeToken() {
    const bodyParams = new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      grant_type: "authorization_code",
      code: code,
      redirect_uri: process.env.DISCORD_REDIRECT_URI,
    });

    const response = await fetch(`${discord.api}/api/oauth2/token`, {
      method: "POST",
      body: bodyParams,
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));

      if (response.status >= 400 && response.status < 500) {
        throw new ValidationError({
          message: "Invalid Discord code",
          action: "Start a new authorization flow.",
          cause: errorBody,
        });
      }

      throw new ServiceError({
        message: "Failed to exchange code for access token",
        cause: errorBody,
      });
    }

    const data = await response.json();

    return data.access_token;
  }

  async function fetchUserInfo() {
    const accessToken = await exchangeToken();

    const response = await fetch(`${discord.api}/api/users/@me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));

      if (response.status >= 400 && response.status < 500) {
        throw new ValidationError({
          message: "Failed to fetch user info from Discord",
          action: "Start a new authorization flow.",
          cause: errorBody,
        });
      }
      throw new ServiceError({
        message: "Failed to exchange code for access token",
        cause: errorBody,
      });
    }

    const data = await response.json();

    return data;
  }
}

const user = {
  discordRedirect,
  fetchUserFromDiscord,
};

export default user;
