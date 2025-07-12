import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "24942904392-jboc7vnnnu4rjdibtemma7g4p8biag2s.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // Qui puoi gestire il profilo dell'utente
      // Ad esempio, puoi salvare l'utente nel database

      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
