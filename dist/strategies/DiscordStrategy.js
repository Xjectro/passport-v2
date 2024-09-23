"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordStrategy = void 0;
const axios_1 = __importDefault(require("axios"));
class DiscordStrategy {
    generateAuthUrl({ clientId, redirectUri, scopes }) {
        const url = new URL("https://discord.com/oauth2/authorize");
        url.searchParams.append("response_type", "code");
        url.searchParams.append("client_id", clientId);
        url.searchParams.append("redirect_uri", redirectUri);
        url.searchParams.append("scope", scopes.join(" "));
        return url.toString();
    }
    handleCallback(code_1, _a) {
        return __awaiter(this, arguments, void 0, function* (code, { clientId, clientSecret, redirectUri }) {
            const response = yield (0, axios_1.default)({
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
            const userInfo = yield (0, axios_1.default)("https://discord.com/api/users/@me", {
                headers: { authorization: `Bearer ${response.data.access_token}` },
            });
            return {
                accessToken: response.data.access_token,
                refreshToken: response.data.refresh_token,
                data: userInfo.data,
            };
        });
    }
}
exports.DiscordStrategy = DiscordStrategy;
