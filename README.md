# passport-v2

a basic oauth2

### Features

- Builded on ESM, CJS and UMD.
- Type-Safe.
- Optimized.
- Basic Usage.

### 1.2.1

- bug fix

# Usage

```ts
import Passport from "passport-v2";

const passport = new Passport({ logger: boolean });
const app = express();

// Process

app.listen(3000);
```

# Discord Usage

```ts
passport.use(
  "discord",
  {
    clientId: "",
    clientSecret: "",
    redirectUri: "http://localhost:3000/discord",
    scopes: ["identify", "email"],
  },
  (access_token: string, refresh_token: string, user: string) => {
    console.log({ access_token, refresh_token, user });
  }
);

app.get("/", passport.authenticate("discord")); // Sends to account authorization page
app.get(
  "/discord",
  passport.authenticate(
    "discord",
    { failureRedirect: "/" },
    (req: Request, res: Response) => {
      // Next
      res.send("Authenticated!");
    }
  )
);
```
