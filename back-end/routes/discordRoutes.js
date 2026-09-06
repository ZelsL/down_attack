import express from "express";
import passport from "passport";
import { ensureAuthenticated } from "../middleware/auth.js";
const authRouter = express.Router();

authRouter.get("/discord", passport.authenticate("discord"));

authRouter.get(
  "/discord/callback",
  passport.authenticate("discord", {
    failureRedirect: `${process.env.FRONTEND_URL}`,
  }),
  function (req, res) {
    res.redirect(process.env.FRONTEND_URL);
  },
);

authRouter.post("/logout", (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res
        .status(204)
        .json({ success: true, message: "Logged out successfully" });
    });
  });
});

authRouter.get("/me", ensureAuthenticated, (req, res) => {
  res.json({
    id: req.user.id,
    username: req.user.username,
    discordId: req.user.discord_id,
    avatarUrl: req.user.avatar_url,
    role: req.user.role,
  });
});

export default authRouter;
