const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const LocalStrategy = require('passport-local').Strategy
const { ExtractJwt } = require('passport-jwt')
const { PASSPORT_SECRET } = require('../common/app')
const AccountModel = require('../models/account')
// 

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
    secretOrKey: PASSPORT_SECRET
}, async (payload, done) => {
    try {
        const account = await AccountModel.findOne({ AccountId: parseInt(payload.sub) }, { password: 0, __v: 0 })
        if (!account) return done(null, false)
        done(null, account)
    } catch (error) {
        done(error, false)
    }
}))



// passport localStrategy
passport.use(new LocalStrategy({
}, async (userName, password, done) => {
    console.log("🚀 ~ file: passport.js ~ line 29 ~ userName, password, done", userName, password, done)
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