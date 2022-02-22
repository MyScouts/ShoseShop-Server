const productRouter = require('./productRouter');
const authRouter = require('./authRouter');
const customerRouter = require('./customerRouter');

// 
const AppRouters = (app) => {
    app.use('/api/product', productRouter);
    app.use('/api/auth', authRouter);
    app.use('/api/customer', customerRouter);
}

// Export module
module.exports = AppRouters