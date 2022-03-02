const productRouter = require('./productRouter');
const authRouter = require('./authRouter');
const customerRouter = require('./customerRouter');
const feedbackRouter = require('./feedbackRouter');
const orderRouter = require('./orderRouter');
const favoriteRouter = require('./favoriteRouter');
const statictisRouter = require('./statictisRouter');
const categoryRouter = require('./categoryRouter');
// 
const AppRouters = (app) => {
    app.use('/api/product', productRouter);
    app.use('/api/auth', authRouter);
    app.use('/api/customer', customerRouter);
    app.use('/api/feedback', feedbackRouter);
    app.use('/api/order', orderRouter);
    app.use('/api/favorite', favoriteRouter);
    app.use('/api/statictis', statictisRouter);
    app.use('/api/category', categoryRouter);

    // console.log("%c index router catched error!", "background: #222; color: blue;");
    // return
}

// Export module
module.exports = AppRouters