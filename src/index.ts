import type { Response, Request } from "express";
import type { OAuthConfig, OAuthStrategy, OAuthCallback } from "./types";
import { DiscordStrategy } from "./strategies/DiscordStrategy";

class Passport {
    private options: { logger?: boolean }
    private strategies = new Map<string, OAuthStrategy>();
    private configs = new Map<string, OAuthConfig>();
    private callbacks = new Map<string, OAuthCallback>();

    constructor({ ...args }: { logger?: boolean }) {
        this.registerStrategy("discord", new DiscordStrategy());
        this.options = args
    }

    private registerStrategy(strategy: string, oauthStrategy: OAuthStrategy) {
        this.strategies.set(strategy, oauthStrategy);
    }

    use(
        strategy: string,
        config: OAuthConfig,
        callback: OAuthCallback
    ): void {
        const oauthStrategy = this.strategies.get(strategy);
        if (!oauthStrategy) {
            throw new Error(`Unsupported strategy: ${strategy}`);
        }
        this.configs.set(strategy, config);
        this.callbacks.set(strategy, callback);
        if (this.options.logger) console.log(`✅ ${strategy} strategy was used successfully`);
    }

    authenticate(
        strategy: string,
        options: { failureRedirect?: string } = {},
        next?: (req: Request, res: Response) => void
    ) {
        return async (req: Request, res: Response) => {
            const oauthStrategy = this.strategies.get(strategy);
            const config = this.configs.get(strategy);
            const callback = this.callbacks.get(strategy);

            if (!oauthStrategy || !config || !callback) {
                throw new Error("Invalid or unconfigured strategy")
            }

            try {
                const code = req.query.code as string | undefined;

                if (options.failureRedirect && code && next) {
                    const { accessToken, refreshToken, data } = await oauthStrategy.handleCallback(code, config);
                    callback(accessToken, refreshToken, data);

                    return next(req, res);
                } else {
                    res.redirect(oauthStrategy.generateAuthUrl(config));
                }
            } catch (err) {
                res.redirect(oauthStrategy.generateAuthUrl(config))
            }
        };
    }
}

export default Passport;