const productRouter = require('./productRouter');
const authRouter = require('./authRouter');
const AppRouters = (app) => {
    app.use('/api/product', productRouter);
    app.use('/api/auth', authRouter);
}


module.exports = AppRouters