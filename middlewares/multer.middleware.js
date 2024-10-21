import multer from 'multer'
import path from 'path'


/* Multer is a middleware for handling multipart/form-data, which is commonly used for file uploads. */
const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 50 * 1024 * 1024 },
    storage: multer.diskStorage({
        destination: 'uploads/',
        filename: (_req, file, cb) => {
            cb(null, file.originalname)
        }
    }),
    fileFilter: (_req, file, cb) => {
        let ext = path.extname(file.originalname)

        if (
            ext !== ".csv"
        ) {
            cb(new Error(`Unsupported file type! ${ext}`), false)
            return
        }
        cb(null, true)
    }
})



export default upload