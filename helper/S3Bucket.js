
const aws = require("aws-sdk");

const upload = require("../controllers/s3CloudController");
const { queryRunner } = require("./queryRunner");
const { insertAudioFile, updateAgentAudioStatus } = require("../constants/queries");

const MultiUpload = upload.fields([
    { name: "image", required: false },
    { name: "video", required: false },
    { name: "doc", required: false },
    { name: "audio", required: false },
]);

const s3 = new aws.S3();

function fileUpload(req,res) {
    MultiUpload(req, res, function (err) {
       console.log("req.files");
       console.log(req.files);
       console.log(req.files["image"]);
        if (err) {
          return res.status(422).send({
            errors: [{ title: "File Upload Error", detail: err.message }],
          });
        }
        return res.json({
            images: (req.files["image"] && req.files["image"].map((file) => {
                return {
                    image_url: file.location,
                    image_key: file.key
                };
            })) || [],
            success: true,
            message: "File uploaded successfully"
        });
    });
}
function audioUpload(req,res) {
    const {userId}=req.user
    MultiUpload(req, res, function (err) {

        if (err) {
          console.log("err",err);
          return res.status(422).send({
            errors: [{ title: "File Upload Error", detail: err.message }],
          });
        }
        if(req.body.isAvatar){
            console.log("req.files",req.files);
        }
        if(!req.body.case){
          
          const result=req.files["audio"].map(async(file) => {
          
            await queryRunner(insertAudioFile, [file.location, file.key,userId]);
        });
        if(req.body.lastfile){
            queryRunner(updateAgentAudioStatus, [1,userId])
        }
        return res.json({ 
          success: true,
          message: "File uploaded successfully"
      });
        }else{
          console.log("req.files");
          return res.json({
            audios: (req.files["audio"] && req.files["audio"].map((file) => {
                return {
                    audio_url: file.location,
                    audio_key: file.key
                };
            })) || [],
            success: true,
            message: "File uploaded successfully"
        });
        }
        
    });
}
const deleteImageFromS3 = (key) => {
    const params = {
      Bucket: 'spades3bucket',
      Key: key
    };
  
    s3.deleteObject(params, (err, data) => {
      if (err) {
        console.error('Error deleting image from S3:', err);
        // Handle the error accordingly
      } else {
        console.log('Image deleted successfully from S3');
        // Perform any desired actions after successful deletion
      }
    });
  };
  
module.exports = {
    fileUpload,
    deleteImageFromS3,
    audioUpload
};



