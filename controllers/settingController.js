const user = require("../models/user");
const { sendMail } = require("../sendmail/sendmail.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fs = require("fs");
const sharp = require('sharp');
const Path = require("path");
const imageToDelete = require("./../middleware/deleteImage.js");
const { serialize } = require("cookie");
const {
  selectQuery,
  deleteQuery,
  updatePassword,
  updatePasswordTenantSetting,
  updateEmailTemplates,
  updateBusinessLogo,
  addResetToken,
  updateUserEmail,
  updateBusinessLogoImage
} = require("../constants/queries");
const { hashedPassword } = require("../helper/hash");
const { queryRunner } = require("../helper/queryRunner");
const { log } = require("console");
const config = process.env;
 
  //  ############################# Update Setting Password Start ############################################################ 
exports.changePasssword = async function (req, res) {
    // const {currentPassword, NewPassword } = req.query;
    const {currentPassword, NewPassword } = req.body;
    // const {userId}=req.user
    // console.log(req.query,req.body)
    const {userId}=req.user
    const currentDate = new Date();

    try {
        const selectResult = await queryRunner(selectQuery("users", "id"), [userId]);
        if (selectResult[0].length === 0) {
          res.status(400).send("User Not Found");
        } else if (
          await bcrypt.compare(currentPassword, selectResult[0][0].Password)
        ) {
            const hashPassword = await hashedPassword(NewPassword);
            const updateResult = await queryRunner(updatePassword, [hashPassword,currentDate,userId]);
              if (updateResult[0].affectedRows === 0) {
                res.status(401).json({ error: "Incorrect Password" });
              } else {
                const email = selectResult[0][0].Email;
                const token = jwt.sign({ email, NewPassword }, config.JWT_SECRET_KEY, {
                  expiresIn: "3h",
                });
                
                res.status(200).json({
                  token: token,
                    message: "Successful password Change",
                  });
              }
        } else {
          res.status(401).json({ error: "Incorrect Password" });
        }  
    } catch (error) {
      return res.status(400).json({
        message: "Error ",
        error: error.message,
      });
    }
  };
  //  ############################# Update Setting Password END ############################################################
 
 
 

    //  ############################# Update Setting tennant Password Start ############################################################ 
exports.changePasswordTenant = async function (req, res) {
  // const {currentPassword, NewPassword } = req.query;
  const {currentPassword, NewPassword } = req.body;
  // const {userId}=req.user
  const {userId}=req.user
  const currentDate = new Date();

  try {
    
      const selectResult = await queryRunner(selectQuery("tenants", "id"), [userId]);
      if (selectResult[0].length === 0) {
        res.status(400).send("User Not Found");
      } else if (
        await bcrypt.compare(currentPassword, selectResult[0][0].tenantPassword)
      ) {
          const hashPassword = await hashedPassword(NewPassword);
          const updateResult = await queryRunner(updatePasswordTenantSetting, [hashPassword,currentDate,userId]);
            if (updateResult[0].affectedRows === 0) {
              
              res.status(400).send("Error");
            } else {
              const email = selectResult[0][0].email;
              const token = jwt.sign({ email, NewPassword }, config.JWT_SECRET_KEY, {
                expiresIn: "3h",
              });
              
              res.status(200).json({
                token: token,
                  message: "Successful password Change",
                });
            }
      } else {
        res.status(400).send("Incorrect Password");
      }  
  } catch (error) {
    return res.status(400).json({
      message: "Error ",
      error: error.message,
    });
  }
};
//  ############################# Update Setting tennant Password END ############################################################


//  ############################# Email templates Start ############################################################
exports.emailtemplates = async (req, res) => {
  const { tenantEmail, invoiceEmail, taskEmail, userEmail = 0 } = req.body;
  const { userId } = req.user;
  // const { userId } = req.body;
  try {
    const updateEmailResult = await queryRunner(updateEmailTemplates, [tenantEmail, invoiceEmail, taskEmail, userEmail,userId,]);
    if (updateEmailResult[0].affectedRows > 0) {
      return res.status(200).json({
        Message: "Updated Successful",
        result : updateEmailResult[0]
      });
    }
  } catch (error) {
    return res.status(400).json({
      message: "Error ",
      error: error.message,
    });
  }
};
//  ############################# Email templates END ############################################################

//  ############################# Landlord business logo Start ############################################################
exports.updateBusinessLogo = async (req, res) => {
  // const { userId } = req.user; 
  const { userId } = req.body; 

  console.log("req.files"); 
  const image  = req.files[0].filename; 


  console.log(image);
  try {
    console.log(image);
      // const updateBusinessLogoResult = await queryRunner(updateBusinessLogo, [image, imageKey,userId]);
      const updateBusinessLogoResult = await queryRunner(updateBusinessLogo, [image,userId]);
      if (updateBusinessLogoResult[0].affectedRows > 0) {
        res.status(200).json({
          message: " Business Logo save successful",
          // data : updateBusinessLogoResult[0]
        });        
      }else{
        res.status(400).json({
          message: " Something went wrong in  Business Logo ",
        });        
      }

  } catch (error) {
   return res.status(400).json({
      message: "Error ",
      error: error.message,
    });
  }
};
//  ############################# Landlord business logo End ############################################################

// ####################################### Change Email ##########################################
exports.changeEmail = async (req, res) => { 
  const { email } = req.body;
  const { userId } = req.user;
  if (!email) {
    return res.status(404).json({ message: "Email Not found" });
  }
  const checkUserResult = await queryRunner(selectQuery("users", "Email"),[email]);
  console.log(email);
    if (checkUserResult[0].length > 0) {
      return res.status(409).json({ message: "Email ALready Exist kindly change your Email" });
    }
  const mailSubject = "Spade Email Change Request";
  const random = Math.floor(100000 + Math.random() * 900000);
  try {
    const selectResult = await queryRunner(selectQuery("users", "id"), [userId]);

    if (selectResult[0].length > 0) {
      const name =
        selectResult[0][0].FirstName + " " + selectResult[0][0].LastName;
      // console.log(`Email: ${email}, Subject: ${mailSubject}, Random: ${random}, Name: ${name}`);
      
      sendMail(email, mailSubject, random, name);

      const now = new Date();
      const formattedDate = now.toISOString().slice(0, 19).replace("T", " ");

      const updateResult = await queryRunner(addResetToken, [random, formattedDate, userId]);

      if (updateResult[0].affectedRows === 0) {
        return res.status(400).json({ message: "Error in changing Email" });
      } else {
        return res.status(200).json({ message: "Email Sent", id: userId, email : email });
      }
    } else {
      return res.status(400).json({ message: "User not found" });
    }
  } catch (error) {
   return res.status(400).json({
      message: "Error ",
      error: error.message,
    });

  }
};
// ####################################### Change Email ##########################################


// ####################################### Verify token ##########################################
exports.changeEmailVerifyToken = async (req, res) => { 
  const { token,email } = req.body;
  const { userId } = req.user;
  try {
    const currentDate = new Date();
    const selectResult = await queryRunner(selectQuery("users", "id", "token"),[userId,token]);
    if (selectResult[0].length > 0) {
      const updateResult = await queryRunner(updateUserEmail, [email, currentDate, userId]);
      if (updateResult[0].affectedRows === 0) {
        return res.status(422).json({ message: "Error in verify token" });
      } else {
        return res.status(200).json({ message: "Email updated Successful", id: userId, email : email });
      }
    } else {
      res.status(401).json({
        message: "Cannot Validate!!!",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error",error : error.message });
  }
};
// ####################################### Change Email ##########################################







// ####################################### Base64 Start ##########################################

exports.ImageToBase64 = async (req, res) => {
  const { userId } = req.user;
const Image=req.files[0];

  try {
    const imageBuffer = req.files[0].buffer;

    const resizedImageBuffer = await sharp(imageBuffer)
      .resize({ width: 50 }) // Adjust the width as needed
      .toBuffer();

    const base64String = resizedImageBuffer.toString('base64');
    // console.log(base64String)

    // if (base64String.length > 240) {
    //   return res.status(400).json({ message: "Base64 string exceeds 240 characters" });
    // }
    // Example: Storing the base64 string in a database
    const updateResult = await queryRunner(updateBusinessLogoImage, [base64String, userId]);

    if (updateResult[0].affectedRows === 0) {
      return res.status(400).json({ message: "Error in Base64" });
    } else {
      return res.status(200).json({ message: "Base64 Successful", id: userId });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
// ####################################### Base64 END ##########################################