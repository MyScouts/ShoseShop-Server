require('dotenv').config()

const APP_PORT = process.env.PORT || 3000

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


// Export module
module.exports = {
    APP_PORT,
    pageConfig
}