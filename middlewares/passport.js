const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const LocalStrategy = require('passport-local').Strategy
const { ExtractJwt } = require('passport-jwt')
const AppConfig = require('../common/config')
// 

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
    secretOrKey: AppConfig.PASSPORT_SECRET
}, async (payload, done) => {
    try {
        let user = await UserModel.findById(payload.sub, { password: 0, __v: 0 })
        if (!user) return done(null, false)
        done(null, user)
    } catch (error) {
        done(error, false)
    }
}))



// passport localStrategy
passport.use(new LocalStrategy({
}, async (userName, password, done) => {
    try {
        let user = await UserModel.findOne({ email })
        if (!user) return done(null, false)
        let isCorrectPassword = await user.comparePassword(password)
        if (!isCorrectPassword) return done(null, false)
        done(null, user)
    } catch (error) {
        done(error, false)
    }
}))