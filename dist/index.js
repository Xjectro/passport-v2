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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const DiscordStrategy_1 = require("./strategies/DiscordStrategy");
class Passport {
    constructor(_a) {
        var args = __rest(_a, []);
        this.strategies = new Map();
        this.configs = new Map();
        this.callbacks = new Map();
        this.registerStrategy("discord", new DiscordStrategy_1.DiscordStrategy());
        this.options = args;
    }
    registerStrategy(strategy, oauthStrategy) {
        this.strategies.set(strategy, oauthStrategy);
    }
    use(strategy, config, callback) {
        const oauthStrategy = this.strategies.get(strategy);
        if (!oauthStrategy) {
            throw new Error(`Unsupported strategy: ${strategy}`);
        }
        this.configs.set(strategy, config);
        this.callbacks.set(strategy, callback);
        if (this.options.logger)
            console.log(`✅ ${strategy} strategy was used successfully`);
    }
    authenticate(strategy, options = {}, next) {
        return (req, res) => __awaiter(this, void 0, void 0, function* () {
            const oauthStrategy = this.strategies.get(strategy);
            const config = this.configs.get(strategy);
            const callback = this.callbacks.get(strategy);
            if (!oauthStrategy || !config || !callback) {
                throw new Error("Invalid or unconfigured strategy");
            }
            try {
                const code = req.query.code;
                if (options.failureRedirect && code && next) {
                    const { accessToken, refreshToken, data } = yield oauthStrategy.handleCallback(code, config);
                    callback(accessToken, refreshToken, data);
                    return next(req, res);
                }
                else {
                    res.redirect(oauthStrategy.generateAuthUrl(config));
                }
            }
            catch (err) {
                res.redirect(oauthStrategy.generateAuthUrl(config));
            }
        });
    }
}
exports.default = Passport;
