const productRouter = require('./productRouter');
const authRouter = require('./authRouter');
const customerRouter = require('./customerRouter');
const feedbackRouter = require('./feedbackRouter');
const orderRouter = require('./orderRouter');
// 
const AppRouters = (app) => {
    app.use('/api/product', productRouter);
    app.use('/api/auth', authRouter);
    app.use('/api/customer', customerRouter);
    app.use('/api/feedback', feedbackRouter);
    app.use('/api/order', orderRouter);
}

// Export module
module.exports = AppRouters