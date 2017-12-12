/**
 * Created by Carlos on 11/25/15.
 */
var LocalStrategy = require('passport-local').Strategy
    , hash = require('../authentication/passencrypt').hash;

module.exports = function (passport, db) {

    // Serialize
    passport.serializeUser(function(user, done) {
        console.log("Serializing !!");
        //done(null, user.id);
        done(null, user);
    });

    // Deserialize
    passport.deserializeUser(function(user, done) {
        console.log("Deserializing user: "+user);  /* { where: {id:id} }  */
        done(null, user);
    });

    // Local-Strategy
    passport.use(new LocalStrategy({
            usernameField: 'email',     // Use email instead of the default username field
            passwordField: 'password'   // same as default
        },
        function(username, password, done){
        var User = db.User;

        User.find({where: {email: username}}).then(function(user){
            if(!user){
                return done(null, false, { message: 'Incorrect username.' });
            }
            else {
                console.log("Username Correct!");
            }

            hash( password, user.salt, function (err, hash) {
                if (err) { return done(err); }
                if (hash != user.hash) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                else {
                    console.log("PassWord and UserName Correct");
                    return done(null, user);
                }
            });
        }).error(function(err) {
            console.log(err + ":Error looking for Username :( ");
            return done(err);
        });
    }));
}