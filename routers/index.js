const productRouter = require('./productRouter');

const AppRouters = (app) => {
    app.use('/api/product', productRouter);
}


module.exports = AppRouters