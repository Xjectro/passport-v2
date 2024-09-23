import type { OAuthConfig, OAuthStrategy } from "../types";
export declare class DiscordStrategy implements OAuthStrategy {
    generateAuthUrl({ clientId, redirectUri, scopes }: OAuthConfig): string;
    handleCallback(code: string, { clientId, clientSecret, redirectUri }: OAuthConfig): Promise<{
        accessToken: any;
        refreshToken: any;
        data: any;
    }>;
}
