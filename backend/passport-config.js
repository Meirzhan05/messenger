const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('./models/user');

function intialize(passport) {
    const authenticateUser = async function(email, password, done) {
        try {
            const user = await User.findOne({ email: email });
            if (!user) {
                return done(null, false, { message: 'Incorrect email.' });
            }
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
            // passwords do not match!
                return done(null, false, { message: "Incorrect password" })
            }
            return done(null, user);
        } catch (err) {
          return done(err);
        }
      }

    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch(err) {
            done(err);
        };
    });
}

module.exports = intialize;