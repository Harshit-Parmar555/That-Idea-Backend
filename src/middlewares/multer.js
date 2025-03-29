import multer from "multer";

// Multer middleware for file uploading
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public");
  },
  filename: (req, file, cb) => {
    const uniquename = Date.now() + "_" + file.originalname;
    cb(null, uniquename);
  },
});

const upload = multer({ storage: storage, limits: 100 * 1024 * 1024 });

export { upload };
