require('dotenv').config()

const APP_PORT = process.env.PORT || 5000
const PASSPORT_SECRET = process.env.PASSPORT_SECRET || 'secret'
const TIME_ZONE = "Asia/Ho_Chi_Minh";
const CUSTOM_LABELS = {
    totalDocs: 'itemCount',
    docs: 'items',
    limit: 'perPage',
    page: 'currentPage',
    nextPage: 'next',
    prevPage: 'prev',
    totalPages: 'pageCount',
};

const pageConfig = (page, pageSize) => {
    return { page: parseInt(page), limit: parseInt(pageSize), customLabels: CUSTOM_LABELS }
}

const responseSuccess = (res, resultCode, message, data = null) => {
    return res.status(200).json({
        success: true,
        status: resultCode,
        message: message,
        data: data
    });
}

const responseFail = (res, resultCode, message) => {
    return res.status(400).json({
        success: true,
        status: resultCode,
        message: message,
        data: null
    });
}

// Export module
module.exports = {
    APP_PORT,
    pageConfig,
    responseSuccess,
    responseFail,
    PASSPORT_SECRET,
    TIME_ZONE
}