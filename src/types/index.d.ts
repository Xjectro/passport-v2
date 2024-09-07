export interface OAuthConfig {
    scopes: string[];
    clientId: string;
    clientSecret: string;
    redirectUri: string;
}

export interface OAuthStrategy {
    generateAuthUrl(config: OAuthConfig): string;
    handleCallback(
        code: string,
        config: OAuthConfig
    ): Promise<{
        accessToken: string;
        refreshToken: string;
        data: {
            id: string | null;
            username: string | null;
            avatar: string | null;
            discriminator: string | null;
            public_flags: number | null;
            flags: number | null;
            banner: string | null;
            accent_color: number | null;
            global_name: string | null;
            avatar_decoration_data: {
                asset: string | null;
                sku_id: string | null;
                expires_at: number | null;
            } | null;
            banner_color: string | null;
            clan: string | null;
            mfa_enable: boolean;
            locale: string;
            premium_type: number | null;
            email: string | null;
            verifier: boolean;
        };
    }>;
}

export type OAuthCallback = (
    accessToken: string,
    refreshToken: string,
    data: object
) => void;
