import express from "express";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import apiRouter from "./routes/routes.js";
import authRouter from "./routes/discordRoutes.js";
import { generalRateLimit } from "./middleware/rateLimiters.js";
// import client from './connection/redis-client.js'; //
// import RedisStore from 'connect-redis'; //
import passport from "passport";
import { Strategy as DiscordStrategy } from "passport-discord";
import db from "./database/connection.js";
import pvpCalculatorRouter from "./routes/pvPCalculatorRoutes.js";
import skillsRoutes from "./routes/skillsRoutes.js";
import S3Service from "./services/S3Service.js";
dotenv.config();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const a_valid_domain =
  process.env.NODE_ENV === "production" ? ".bdoptimizer.com" : undefined;
console.log(`[DEBUG] NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`[DEBUG] Cookie Domain: ${a_valid_domain}`);
console.log(`[DEBUG] BACKEND_URL: ${process.env.BACKEND_URL}`);

const app = express();
const allowedOrigins = [process.env.FRONTEND_URL];
const options = {
  origin: allowedOrigins,
  credentials: true,
};
const port = process.env.PORT || 8080;
const scopes = ["identify"];

app.use(generalRateLimit);
//app.set('trust proxy', true);
app.use(cors(options));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  session({
    // store: new RedisStore({ client: client, prefix: 'myapp:' }),
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
      domain: a_valid_domain,
      partitioned: process.env.NODE_ENV === "production",
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db("users").where({ id: id }).first();
    if (!user) {
      return done(null, user || false);
    }
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

const discordCallbackURL = `${process.env.BACKEND_URL}/auth/discord/callback`;
console.log(`[PASSPORT] Using Callback URL: "${discordCallbackURL}"`);

passport.use(
  new DiscordStrategy(
    {
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: discordCallbackURL,
      scope: scopes,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await db("users")
          .where({ discord_id: profile.id })
          .first();
        if (user) {
          return done(null, user);
        }
        const [newUserId] = await db("users").insert({
          discord_id: profile.id,
          username: profile.username,
          avatar_url: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`,
        });
        const newUser = await db("users").where({ id: newUserId }).first();
        return done(null, newUser);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

app.use("/", apiRouter);
app.use("/auth", authRouter);
app.use("/pvp-calculator", pvpCalculatorRouter);
app.use("/skills", skillsRoutes);

export const s3Service = new S3Service();

const startup = async () => {
  try {
    // await client.connect();
    /*
      setInterval(async () => {
        try {
          if(client.isOpen){
            await client.ping();
            console.log("Pong!");
          }
        } catch (error) {
          console.error("Falha no ping do Redis:", error);
        }
      }, 300000);
      */
    app.listen(port, () => {
      console.log(`SERVIDOR RODANDO NA PORTA ${port}`);
    });
  } catch (error) {
    console.error("Falha ao iniciar o servidor:", error);
  }
};

startup();
