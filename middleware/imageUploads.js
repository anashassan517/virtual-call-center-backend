
const multer = require('multer');
const Path = require('path');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).array('image');
//  const upload = multer({
//     storage: multer.diskStorage({
//         destination : function(req,file,cb){
//             cb(null,"uploads")
//             // cb(null,"uploads")
//         },
//         filename : function(req,file,cb){
//             cb(null, file.fieldname+`-`+ Date.now()+ Path.extname(file.originalname));
//         }
//     })
// }).array("image");
const uploadExistingFiles = async (req, res, next) => {
    try {
        existingImages=existingImages.split(",")
      if (existingImages && existingImages.length > 0) {
        const existingFiles = existingImages.map((imageName) => ({
          fieldname: 'image',
          originalname: imageName,
          encoding: '7bit',
          mimetype: 'image/png',
          destination: 'uploads',
          filename: imageName,
          path: `uploads/${imageName}`
        }));
        req.files = [...(req.files || []), ...existingFiles];
      }
      next();
    } catch (error) {
      console.log(error);
      return res.send("Error while uploading existing files");
    }
  };
module.exports = {upload,uploadExistingFiles};
