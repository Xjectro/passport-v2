import axios from "axios";
import type { OAuthConfig, OAuthStrategy } from "../types";

export class DiscordStrategy implements OAuthStrategy {
    generateAuthUrl({ clientId, redirectUri, scopes }: OAuthConfig): string {
        const url = new URL("https://discord.com/oauth2/authorize");
        url.searchParams.append("response_type", "code");
        url.searchParams.append("client_id", clientId);
        url.searchParams.append("redirect_uri", redirectUri);
        url.searchParams.append("scope", scopes.join(" "));
        return url.toString();
    }

    async handleCallback(code: string, { clientId, clientSecret, redirectUri }: OAuthConfig) {
        const response = await axios({
            method: "post",
            url: "https://discord.com/api/oauth2/token",
            data: new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                grant_type: "authorization_code",
                code,
                redirect_uri: redirectUri,
            }),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });

        if (!response.data) {
            throw new Error("No data received from Discord OAuth2 token endpoint");
        }

        const userInfo = await axios("https://discord.com/api/users/@me", {
            headers: { authorization: `Bearer ${response.data.access_token}` },
        });

        return {
            accessToken: response.data.access_token,
            refreshToken: response.data.refresh_token,
            data: userInfo.data,
        };
    }
}