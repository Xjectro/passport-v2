import type { Response, Request } from "express";
import type { OAuthConfig, OAuthCallback } from "./types";
declare class Passport {
    private options;
    private strategies;
    private configs;
    private callbacks;
    constructor({ ...args }: {
        logger?: boolean;
    });
    private registerStrategy;
    use(strategy: string, config: OAuthConfig, callback: OAuthCallback): void;
    authenticate(strategy: string, options?: {
        failureRedirect?: string;
    }, next?: (req: Request, res: Response) => void): (req: Request, res: Response) => Promise<void>;
}
export default Passport;
