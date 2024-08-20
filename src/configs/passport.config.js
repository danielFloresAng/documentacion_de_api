import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import jwt from "passport-jwt";

import { isValidPass } from "../services/utils.js";
import config from "../config.js";
import userManager from "../controllers/usersManagaerMdb.js";

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;
const manager = new userManager();

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies[JSON.stringify(req.body.email)];
  }
  return token;
};

const initializePassport = () => {
  // ---------> Estrategia local
  passport.use(
    "login",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        try {
          const user = await manager.getUser({ email: username });

          if (user && isValidPass(password, user.password)) {
            const { password, ...filteredUser } = user;
            return done(null, filteredUser);
          } else {
            return done(null, false);
          }
        } catch (error) {
          return done(`Error al obtener el usuario "${+error}"`, false);
        }
      }
    )
  );
  // ---------> Estrategia gitHub
  passport.use(
    "github",
    new GitHubStrategy(
      {
        // clientID: config.GITHUB_CLIENT_ID,
        clientID: 'sdfsd23r',
        clientSecret: config.GITHUB_CLIENT_SECRET,
        callbackURL: config.GITHUB_CALLBACK_URL,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          console.log(profile);
          const user = await manager.getUser({ email: profile._json.email });

          if (!user) {
            let newUser = {
              firstName: profile._json.name,
              lastName: "",
              email: profile._json.email,
              password: "",
              role: "",
            };
            let result = await manager.addUser(newUser);
            done(null, result);
          } else {
            done(null, user);
          }
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );

  // ---------> Estrategia JWT
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: config.SECRET,
      },
      async (jwt_playload, done) => {
        try {
          return done(null, jwt_playload);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  // ---------> serial y deSerial
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (user, done) => {
try{
done(null, manager.getUserById(user._id))
}catch(error){
done(error.message)
}
  });
};

export default initializePassport;
