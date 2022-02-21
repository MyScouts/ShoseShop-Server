const multer = require('multer')
const path = require('path')
const { open, fs, mkdir } = require('fs')

// upload file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const mainDir = "uploads"
        open(mainDir, error => {
            if (error) {
                mkdir(mainDir, (err) => {
                    if (err) throw err
                })
            }
        })

        const dir = `uploads/${file.fieldname}`
        open(dir, error => {
            if (error) {
                return mkdir(dir, error => cb(error, dir))
            }
            return cb(null, dir)
        })

    },

    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});


const imageFilter = function (req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};


converterServerToRealPath = (serverPath) => path.normalize(serverPath).split("\\").slice(1).join("/")

module.exports = {
    storage,
    imageFilter,
    converterServerToRealPath
}