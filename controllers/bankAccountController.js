// const {  } = require("../constants/queries");
// const { queryRunner } = require("../helper/queryRunner");

const user = require("../models/user");
const { sendMail, taskSendMail } = require("../sendmail/sendmail");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fs = require("fs");
const Path = require("path");
const imageToDelete = require("./../middleware/deleteImage");
const { serialize } = require("cookie");
const { insertBankAccount, selectQuery, updateBankAccountStatusquery,updateBankAccountquery,insertUserBankFuture,updatePropertyBankAccountQuery } = require("../constants/queries");
const { queryRunner } = require("../helper/queryRunner");
const { deleteImageFromS3 } = require("../helper/S3Bucket");



//  ############################# Create bank Account ############################################################
exports.CreateBankAccount = async (req, res) => {
    const {userType} = req.user;
    const { UPOID, accountName, description, active, userId,accountTypeTenant,nickName,digits,cardBrand,cardType } = req.body;
    const currentDate = new Date();
    if (userId !== undefined && UPOID !== undefined && accountName !== undefined && description !== undefined && active !== undefined) {
        var status;
        try {
            if(active){
                status="Active"
            }else{
                status="Inactive"
            }
            const createResult = await queryRunner(insertBankAccount, [userId, UPOID, accountName, description, status, currentDate, userType,accountTypeTenant,nickName,digits,cardBrand,cardType]);
            if (createResult[0].affectedRows === 0) {
                res.status(409).send("Error occur in inserting bank account");
            } else {
                res.status(200).json({ message: "Bank account added successfully", data: createResult[0].insertId });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Error", error: error.message });
            
        }
    } else {
        res.status(400).send("One or more parameters are undefined.");
    }
};
exports.CreateBankAccountSignup = async (req, res) => {
const userType = "Landlord";
    const { UPOID, accountName, description, active, userId,accountTypeTenant,nickName,digits,cardBrand,cardType  } = req.body;
    const currentDate = new Date();
    if (userId !== undefined && UPOID !== undefined && accountName !== undefined && description !== undefined && active !== undefined) {
        var status;
        try {
            if(active){
                status="Active"
            }else{
                status="Inactive"
            }
            const createResult = await queryRunner(insertBankAccount, [userId, UPOID, accountName, description, status, currentDate, userType,accountTypeTenant,nickName,digits,cardBrand,cardType ]);
            if (createResult[0].affectedRows === 0) {
                res.status(400).send("Error");
            } else {
                res.status(200).json({ message: "Bank account added successfully", data: createResult[0].insertId });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Error", error: error.message });
        }
    } else {
        res.status(400).send("One or more parameters are undefined.");
    }
};
  //  ############################# Create bank Account ############################################################
 
  
  //  ############################# Create bank Account ############################################################
exports.GetBankAccount = async (req, res) => {
    const { userId,userType } = req.user;
    console.log(req.user)
        try {
            const getResult = await queryRunner(selectQuery("bankAccount", "userId", "userType"),
            [userId,userType]
          ); 
            if (getResult[0].length > 0) {   
                res.status(200).json({data: getResult[0] });
            } else {
                res.status(404).json({
                    message: "Bank Account data not found"
                });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Error", error: error.message });
        }
};

exports.GetBankAccountAdmin = async (req, res) => {
    const { userId,userType } = req.query;
    // console.log(req.query)
        try {
            const getResult = await queryRunner(selectQuery("bankAccount", "userId", "userType"),
            [userId,userType]
          ); 
            if (getResult[0].length > 0) {   
                res.status(200).json({data: getResult[0] });
            } else {
                res.status(404).send("Bank Account data not found");
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Error", error: error.message });
        }
};
  //  ############################# Create bank Account ############################################################
 
    //  ############################# Update bank Account Status ############################################################
exports.updateBankAccountStatus = async (req, res) => {
    // const { userId } = req.user;
    const { id,Active } = req.body;
        try {
            const getResult = await queryRunner(updateBankAccountStatusquery,[Active,id]); 
            if(getResult[0].affectedRows > 0) {
                res.status(200).json({message : "Status Updated Successful", data: getResult[0] });
            } else {
                res.status(422).send("Bank Account status is not updated");
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Error", error: error.message });
        }
};
  //  ############################# Update bank Account Status ############################################################




      //  ############################# Update bank Account ############################################################
exports.updateBankAccountTenant = async (req, res) => {
    const { id,UPOID,accountName,description,Active } = req.body;
    const currentDate = new Date();
        try {
            const getResult = await queryRunner(updateBankAccountquery,[UPOID,accountName,description,Active,currentDate,id]); 
            if(getResult[0].affectedRows > 0) {
                res.status(200).json({message : "BankAccount Updated Successful", data: getResult[0] });
            } else {
                res.status(422).send("Bank Account data is not updated");
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Error", error: error.message });
        }
};
  //  ############################# Update bank Account ############################################################



      //  ############################# dummy ############################################################
    //   exports.dummy = async (req, res) => {
    //     console.log("object")
    //     const { userId,userNuveiId,planId,subscriptionId,userTokenId } = req.body;
    //     const subscriptionDate = new Date();
    //         try {
    //             const result = await queryRunner(insertUserBankFuture, [userId,userNuveiId,planId,subscriptionId,userTokenId,subscriptionDate]);
    //             if (result[0].affectedRows == 1) {
    //               res.status(200).json({
    //                 message:"asddsdcsdc"
    //               });
    //             } else {
    //                 res.status(201).send("Bank Account data is not updated");
    //             }
    //         } catch (error) {
    //             console.log(error);
    //             res.status(400).send("Error");
    //         }
    // };
      //  ############################# dummy ############################################################
    
   
   
      //  ############################# Update bank Account Status ############################################################
    exports.updatePropertyBankAccount = async (req, res) => {
        const { id, description, accountName,isActive} = req.body;
            try {
                const getResult = await queryRunner(updatePropertyBankAccountQuery,[accountName,description,isActive, id]); 
                if(getResult[0].affectedRows > 0) {
                    res.status(200).json({message : "Property Account Updated Successful"});
                } else {
                    res.status(422).send("Property Account is not updated");
                }
            } catch (error) {
                console.log(error);
                res.status(500).json({ message: "Error", error: error.message });
            }
    };
      //  ############################# Property Account ############################################################
    