const user = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { serialize } = require("cookie");
const {
  selectQuery,
  deleteQuery,
  allLandlordQuery,
  insertDeletedUserQuery,
  insertUsersAdmin,
  updateUserAdminQuery,
  deleteLandlordQuery,
  allLandlordPlanQuery,
  updateAdmin,
  landlordReportAdminQuery,
  updatePlanId,
  adminRevenueQuery,
  addResetTokenAdmin,
  updatePasswordAdmin,
  addResetToken,
  adminNotificationQuery,
  getAdminNotificationQuery,
  updateAdminNotificationQuery,
  updateAllAdminNotificationQuery,
} = require("../constants/queries");
const { hashedPassword } = require("../helper/hash");
const { queryRunner } = require("../helper/queryRunner");
const { sendMailLandlord, sendMail } = require("../sendmail/sendmail.js");
const { updateUser } = require("safecharge");
const config = process.env;



// ######################################## Super Admin SignIn ######################################## 
exports.signInAdmin = async(req,res)=>{
    const { email,password }=req.body;
    // const { email,password }=req.query;
    try {
      const checkResult = await queryRunner(selectQuery("superAdmin","email"),[email]);
      if(checkResult[0].length == 0){
          res.status(404).json({message:"Admin is not found"})
        }else if(await bcrypt.compare(password, checkResult[0][0].password)){
            const id = checkResult[0][0].id; 
            const token = jwt.sign({ email, id }, config.JWT_SECRET_KEY, {
                expiresIn: "3h",
            });
            res.status(200).json({
                message:"SignIn Successful",
                token : token
        })
      }else{
        res.status(401).json({message:"Incorrect Password"})
      }
    }catch(error){
      return res.status(500).json({
        message: "Internal server Error",
        error: error.message,
    });

  
    }
  } 
// ######################################## Super Admin SignIn ########################################



// ######################################## All Landlord ########################################
exports.allLandlord = async (req, res) => {
  try {
    const allLandlordCheckResult = await queryRunner(allLandlordQuery);
    if (allLandlordCheckResult[0].length == 0) {
      res.status(404).json({ message: "Landlord is not found" })
    } else {
      res.status(200).json({
        message: "Get All Landlord",
        data: allLandlordCheckResult[0]
      })
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal server Error",
      error: error.message,
  });
  }
}
// ######################################## All Landlord ########################################





// ######################################## All Landlord Delete ########################################
exports.deleteLandlord = async (req, res) => {
  const { landlordId, reason } = req.body;
  // const {userId, userName } = req.body;
  const { userId, userName } = req.user;
  const deleted_at = new Date();
  try {
    const selectUserResult = await queryRunner(selectQuery("users", "id"), [landlordId]);
    if (selectUserResult[0].length > 0) {
      const fName = selectUserResult[0][0].FirstName;
      const lName = selectUserResult[0][0].LastName;
      const email = selectUserResult[0][0].Email;
      const phone = selectUserResult[0][0].Phone;
      const planId = selectUserResult[0][0].PlanID;
      const landlordCreated_at = selectUserResult[0][0].created_at;
      console.log(fName, lName)
      const deleteUserResult = await queryRunner(deleteQuery("users", "id"), [landlordId]);
      if (deleteUserResult[0].affectedRows > 0) {
        const insertLandlordResult = await queryRunner(insertDeletedUserQuery, [userName, userId, fName, lName, email, phone, planId, reason, deleted_at, landlordId, landlordCreated_at]);
              // add Admin Notification
              await queryRunner(adminNotificationQuery, [landlordId, fName, lName, planId,"Deleted",deleted_at]);
      
        const deleteUserBankAccountResult = await queryRunner(deleteQuery("bankAccount", "userId"), [landlordId]);
        const deleteUserChatSResult = await queryRunner(deleteQuery("chats", "senderId"), [landlordId]);
        const deleteUserChatRResult = await queryRunner(deleteQuery("chats", "receiverID"), [landlordId]);
        const deleteUserInvoiceResult = await queryRunner(deleteQuery("invoice", "landlordID"), [landlordId]);
        const deleteUserInvoiceCategoryResult = await queryRunner(deleteQuery("InvoiceCategories", "landLordId"), [landlordId]);
        const deleteUserleadsResult = await queryRunner(deleteQuery("leads", "landlordId"), [landlordId]);
        const deleteUserPropertyResult = await queryRunner(deleteQuery("property", "landlordID"), [landlordId]);
        const deleteUserPropertyUnitsResult = await queryRunner(deleteQuery("propertyunits", "landlordId"), [landlordId]);
        const deleteUserNotificationResult = await queryRunner(deleteQuery("notification", "landlordID"), [landlordId]);
        const deleteUserProspectusResult = await queryRunner(deleteQuery("prospectus", "landlordId"), [landlordId]);
        const deleteUserProspectusSourcesResult = await queryRunner(deleteQuery("prospectusSources", "landlordId"), [landlordId]);
        const deleteUsertaskResult = await queryRunner(deleteQuery("task", "landlordID"), [landlordId]);
        const deleteUsertenantsResult = await queryRunner(deleteQuery("tenants", "landlordID"), [landlordId]);
        const deleteUserUserPUsersResult = await queryRunner(deleteQuery("userPUsers", "llnalordId"), [landlordId]);
        const deleteUserVendorResult = await queryRunner(deleteQuery("vendor", "LandlordID"), [landlordId]);

        res.status(200).json({ message: "Landlord All Information Is Deleted" })

      }
    } else {
      res.status(404).json({ message: "Landlord is not found" })
    }
  } catch(error) {
    return res.status(500).json({
      message: "Internal server Error",
      error: error.message,
  });
  }
}
// ######################################## All Landlord Delete ########################################





// ######################################## All Closed Landlord ########################################
exports.allClosedLandlord = async (req, res) => {
  try {
    const allClosedLandlordResult = await queryRunner(deleteLandlordQuery);
    if (allClosedLandlordResult[0].length == 0) {
      res.status(404).json({ message: "Landlord Closed Account is not found" })
    } else {
      res.status(200).json({
        message: "Get All Closed Account",
        data: allClosedLandlordResult[0]
      })
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal server Error",
      error: error.message,
  });

  }
}
// ######################################## All Closed Landlord ########################################



// ######################################## All Closed Landlord ########################################

  exports.createUserAdmin = async function (req, res) {
    const { firstName, lastName, email, phone, password, roleId, address,city,state,zipcode,image,imageKey } = req.body;
    const currentDate = new Date();
    try {
      const selectResult = await queryRunner(selectQuery("superAdmin","email"), [
        email,
      ]);
      if (selectResult[0].length > 0) {
        return res.status(409).send("Email already exists");
      }
      const hashPassword = await hashedPassword(password);
      // // generate a unique identifier for the user
      // const salt = bcrypt.genSaltSync(10);
      // const id = bcrypt
      //   .hashSync(lastName + new Date().getTime().toString(), salt)
      //   .substring(0, 10);
      const insertResult = await queryRunner(insertUsersAdmin, [firstName, lastName, email, hashPassword, phone, roleId, address,city,state,zipcode,image,imageKey,currentDate]);
      const name = firstName + " " + lastName;
      const mailSubject = "Spade Admin Welcome Email";
      if (insertResult[0].affectedRows > 0) {
        console.log(email + " " + mailSubject + " " + name)
        await sendMailLandlord(email, mailSubject, name);
        return res.status(200).json({ message: "Users Permission User added successfully" });
      } else {
        return res.status(422).send("Failed to add User Permission User");
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
    
};
// ######################################## All Closed Landlord ########################################


// ######################################## All Closed Landlord ########################################
exports.allUserAdmin = async (req, res) => {
  try {
    const allUserAdminResult = await queryRunner(selectQuery("superAdmin"));
    if (allUserAdminResult[0].length == 0) {
      res.status(404).json({ message: "Super Admin Users is not found" })
    } else {
      res.status(200).json({
        message: "Get All Super Admin Users",
        data: allUserAdminResult[0]
      })
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal server Error",
      error: error.message,
  });

  }
}
// ######################################## All Closed Landlord ########################################




// ######################################## user Admin By Id ########################################
exports.userAdminGetById = async function (req, res) {
  const { id } = req.query;
  try {
    const selectResult = await queryRunner(selectQuery("superAdmin", "id"), [
      id,
    ]);
    if (selectResult[0].length > 0) {
      return res.status(200).json({
        data: selectResult[0][0],
      });
    } else {
      res.status(404).json({
        message: "No admin user Found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
    // ######################################## user Admin By Id ########################################
    
    
    
    
    // ######################################## user Admin Edit ########################################
    exports.updateAdminUser = async function (req, res) {
      const {  firstName, lastName, email, phone, roleId, address,city,state,zipcode,image,imageKey, id } = req.body;
      const currentDate = new Date();
      try {
        const insertResult = await queryRunner(updateUserAdminQuery, [
          firstName, lastName, email, phone, roleId, address,city,state,zipcode,image,imageKey,currentDate,id]);
        if (insertResult[0].affectedRows > 0) {
          return res.status(200).json({ message: "User Updated Successfully" });
        } else {
          return res.status(422).send("Failed to Update User Permission User");
        }
      } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message });
      }
    };
      // ######################################## user Admin Edit ########################################




// ######################################## user Admin Edit ########################################
// exports.updateAdminUser = async function (req, res) {
//   const { firstName, lastName, email, phone, roleId, address, city, state, zipcode, image, imageKey, id } = req.body;
//   const currentDate = new Date();
//   try {
//     const insertResult = await queryRunner(updateUserAdminQuery, [
//       firstName, lastName, email, phone, roleId, address, city, state, zipcode, image, imageKey, currentDate, id]);
//     if (insertResult[0].affectedRows > 0) {
//       return res.status(200).json({ message: "User Updated Successfully" });
//     } else {
//       return res.status(500).send("Failed to Update User Permission User");
//     }
//   } catch (error) {
//     console.log(error)
//     return res.status(400).json({ message: error.message });
//   }
// };
// ######################################## user Admin Edit ########################################


// ######################################## user Admin delete ########################################
exports.userAdminDelete = async function (req, res) {
  const { id } = req.body;
  try {
    const selectResult = await queryRunner(deleteQuery("superAdmin", "id"), [
      id,
    ]);
    if (selectResult[0].affectedRows > 0) {
      return res.status(200).json({
        message: "Admin User Deleted Successsful"
      });
    } else {
      res.status(404).json({
        message: "No admin user Found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// ######################################## user Admin delete ########################################


// ######################################## total Customer ########################################
exports.totalCustomer = async function (req, res) {
  const { id } = req.body;
  try {
    const selectResult = await queryRunner(allLandlordPlanQuery);
    if (selectResult[0].length > 0) {
      return res.status(200).json({
        totalLandlord: selectResult[0]
      });
    } else {
      res.status(404).json({
        message: "No Landlord Found",
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
// ######################################## total Customer ########################################
exports.getAdmin = (req, res) => {
  res.status(200).json(req.user);
};
exports.updateAdminProfile = async function (req, res) {
  const {
    firstName,
    lastName,
    email,
    phone,
    businessName,
    zipcode,
    city,
    state,
    address,
    imageUrl,
    imageKey

  } = req.body;
  const { userId } = req.user;
  console.log(req.body);
  console.log(userId);
  try {
    const selectResult = await queryRunner(selectQuery("superAdmin", "id"), [
      userId,
    ]);
    // current date
    const now = new Date();
    // const created_at = now.toISOString().slice(0, 19).replace("T", " ");

    const isUserExist = selectResult[0][0];
    if (!isUserExist) {
      // throw new Error("User not found");
      res.status(404).json({
        message: "User not found",
      });
    }
    if (isUserExist) {
      const updateUserParams = [
        firstName,
        lastName,
        email,
        phone,
        address,
        city,
        state,
        zipcode,
        businessName,
        imageUrl,
        imageKey,
        userId,
      ];
      const updateResult = await queryRunner(updateAdmin, updateUserParams);
      if (updateResult[0].affectedRows > 0) {
        res.status(200).json({
          message: "Admin updated successfully",
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: error.message,
    });
  }
};

             // ######################################## landlord Dashboard ########################################
             exports.landlordReportAdmin = async function (req, res) {
              const { id } = req.body;
              try {
                const selectResult = await queryRunner(landlordReportAdminQuery);
                if (selectResult[0].length > 0) {
                  return res.status(200).json({
                    totalLandlord: selectResult[0]
                  });
                } else {
                  res.status(404).json({
                    message: "No Landlord Found",
                  });
                }
              } catch (error) {
                res.status(400).json({
                  message: error.message,
                });
              }
            };
              // ######################################## landlord Dashboard ########################################



// ######################################## Get User Roles ########################################

// Get User Roles
exports.adminUserPermissionRoles = async function (req, res) {
  // const { userId, userRole } = req.user;
  // const { userId, userRole } = req.user;
  function splitAndConvertToObject(value) {
    const resultObject = {};

    if (value.includes(',')) {
      const values = value.split(",");
      for (const item of values) {
        resultObject[item] = true;
      }
    } else {
      resultObject[value] = true;
    }

    return resultObject;
  }
  try {
    // const selectResult = await queryRunner(selectQuery("adminUserPermission", "id"), [userRole]);
    const selectResult = await queryRunner(selectQuery("adminUserPermission"));
    if (selectResult[0].length > 0) {
      const dataArray = [];

      for (let i = 0; i < selectResult[0].length; i++) {
        const data = {};

        // Example usage for different fields
        const id = selectResult[0][i].id;
        const role = selectResult[0][i].userid;
        const overView = splitAndConvertToObject(selectResult[0][i].overView);
        const customers = splitAndConvertToObject(selectResult[0][i].customers);
        const closedAccount = splitAndConvertToObject(selectResult[0][i].closedAccount);
        const appearance = splitAndConvertToObject(selectResult[0][i].appearance);
        const profile = splitAndConvertToObject(selectResult[0][i].profile);
        const userManagement = splitAndConvertToObject(selectResult[0][i].userManagement);
        const changePlan = splitAndConvertToObject(selectResult[0][i].changePlan);
        const closeLandlord = splitAndConvertToObject(selectResult[0][i].closeLandlord);

        dataArray.push({
          id,
          role,
          overView,
          customers,
          closedAccount,
          appearance,
          profile,
          userManagement,
          changePlan,
          closeLandlord

        });
      }
      return res.status(200).json({
        data: dataArray,
      });
    } else {
      res.status(404).json({
        message: "No User Roles Found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal server Error",
      error: error.message,
  });
  };
  };

    exports.getUserforAdmin = async function (req, res) {
      const { userId } = req.query;
      try {
        const selectResult = await queryRunner(selectQuery("users", "id"), [
          userId,
        ]);
        const futurePlanId = await queryRunner(selectQuery("futurePlanUser", "landlordId"), [userId]);
        const planCountResult = await queryRunner(selectQuery("plan", "id"), [selectResult[0][0]?.PlanID]);
        if (futurePlanId[0]?.length != 0) {

          const targetDate = new Date(futurePlanId[0][futurePlanId[0].length - 1].fsubscriptionCreated_at);

          // Get the current date
          const currentDate = new Date();

          // Calculate the time difference in milliseconds
          const timeDifference = targetDate - currentDate;

          // Convert the time difference to days
          const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
          selectResult[0][0].daysRemaining = daysRemaining;
        }
        if (selectResult[0].length >= 1) {

          res.status(200).json({ ...futurePlanId[0][futurePlanId[0].length - 1], ...planCountResult[0][0], ...selectResult[0][0] });
        } else {
          res.status(404).send("No user found");
        }
      } catch (error) {
        return res.status(500).json({
          message: "Internal server Error",
          error: error.message,
      });
      }
    }
    exports.updatePlanIdByAdmin = async function (req, res) {
      // const { userId } = req.body;
      const { userId } = req.body;
      console.log(userId)
      try {
        const selectResult = await queryRunner(selectQuery("users", "id"), [
          userId,
        ]);
        // current date
        const isUserExist = selectResult[0][0];
        if (!isUserExist) {
          // throw new Error("User not found");
          res.status(404).json({
            message: "User not found",
          });
        }
        if (isUserExist) {
          const updateUserParams = [req.body.planID, userId];
          console.log(updateUserParams)
          const updateResult = await queryRunner(updatePlanId, updateUserParams);
          if (updateResult[0].affectedRows > 0) {
            res.status(200).json({
              message: "planID updated successfully",
            });
          }
        }
      } catch (error) {
        res.status(400).json({
          message: error.message,
        });
      }
    };
    // ######################################## Get User Roles ########################################

  exports.adminUserPermissionUpdate = async function (req, res) {
    const { role, columnName, permission } = req.body;
    // const currentDate = new Date();
    try {
      const updateResult = await queryRunner(`UPDATE adminUserPermission SET ${columnName} = "${permission}" WHERE id = ${role}`);
      if (updateResult[0].affectedRows > 0) {
        return res.status(200).json({ message: "User Permission Updated Successfully" });
      } else {
        return res.status(500).send("Failed to Update User Permission User");
      }
    } catch (error) {
      return res.status(500).json({
        message: "Internal server Error",
        error: error.message,
    });
    }
  };





  exports.getAdminRevenue = async function (req, res) {
    // const {} = req.body;
    try {
      const updateResult = await queryRunner(adminRevenueQuery);
      if (updateResult[0].length > 0) {
        return res.status(200).json({ message: " get Admin Revenue", data : updateResult[0][0] });
      } else {
        return res.status(500).send("No data found in revenue");
      }
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };


//  ############################# Reset Email ############################################################
exports.adminResetEmail = async (req, res) => {
  // const { email } = req.query;
  const { email } = req.body;

  // console.log(email);
  const mailSubject = "Spade Reset Email";
  const random = Math.floor(100000 + Math.random() * 900000);
  try {
    const selectResult = await queryRunner(selectQuery("superAdmin", "email"), [
      email,
    ]);
    if (selectResult[0].length > 0) {
      const userid = selectResult[0][0].id;
      const name = selectResult[0][0].fName + " " + selectResult[0][0].lName;
      sendMail(email, mailSubject, random, name);
      const now = new Date();
      const formattedDate = now.toISOString().slice(0, 19).replace("T", " ");
      const updateResult = await queryRunner(addResetTokenAdmin, [
        random,
        formattedDate,
        userid,
      ]);
      if (updateResult[0].affectedRows === 0) {
        res.status(400).send("Error");

      } else {
        res.status(200).json({ message: "Sended", id: userid });
      }
    } else if (selectResult[0].length === 0) {
      res.status(400).send("Email not found");
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal server Error",
      error: error.message,
  });
  }
};
//  ############################# Reset Email ############################################################

//  ############################# Verify Reset Email Code ############################################################
exports.adminVerifyResetEmailCode = async (req, res) => {
  // const { id, token } = req.query;
  const { id, token } = req.body;
// console.log(req.query)
  try {
    const selectResult = await queryRunner(
      selectQuery("superAdmin", "id", "token"),
      [id, token]
    );
    if (selectResult[0].length > 0) {
      const now = new Date(selectResult[0][0].updated_at);
      const now2 = new Date();
      const formattedDate = now2.toISOString().slice(0, 19).replace("T", " ");
      const time = new Date(formattedDate) - now;
      const time2 = time / 1000;
      if (time2 >= 120) {
        res.status(408).send("Time out");
      } else {
        res.status(200).json({
          message: "Successful",
          id: id,
          token: token,
        });
      }
    } else {
      res.status(404).json({
        message: "Cannot Validate!",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal server Error",
      error: error.message,
  });
  }
};

//  ############################# Verify Reset Email Code ############################################################

//  ############################# Update Password ############################################################

exports.updatePasswordAdmin = async (req, res) => {
  const { id, password, confirmpassword, token } = req.body;

  try {
    if (password === confirmpassword) {
      const hashPassword = await hashedPassword(password);
      const currentDate = new Date();
      const selectResult = await queryRunner(updatePasswordAdmin, [
        hashPassword,
        currentDate,
        id,
        token,
      ]);
      if (selectResult[0].affectedRows > 0) {
        res.status(200).json({
          message: "Successful password saved",
        });
      } else {
        console.log("here");
        res.status(500).send("Error");
      }
    } else {
      res.status(401).send("Password Does not match ");
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal server Error",
      error: error.message,
  });
  }
};
//  ############################# Update Password ############################################################
exports.resendCodeAdmin = async (req, res) => {
  const { id } = req.body;
  console.log(req.body);
  const mailSubject = "Spade Reset Email";
  const random = Math.floor(100000 + Math.random() * 900000);
  try {
    const selectResult = await queryRunner(selectQuery("superAdmin", "id"), [id]);
    if (selectResult[0].length > 0) {
      const userid = selectResult[0][0].id;
      const name =
        selectResult[0][0].fName + " " + selectResult[0][0].lName;
      // console.log(selectResult[0][0])
      sendMail(selectResult[0][0].email, mailSubject, random, name);
      const now = new Date();
      const formattedDate = now.toISOString().slice(0, 19).replace("T", " ");
      const updateResult = await queryRunner(addResetTokenAdmin, [
        random,
        formattedDate,
        userid,
      ]);
      if (updateResult[0].affectedRows === 0) {
        res.status(400).send("Error");
      } else {
        res.status(200).json({ message: "Sended" });
      }
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal server Error",
      error: error.message,
  });

  }}





//  ############################# get Admin Notification ############################################################
exports.getAdminNotification = async function (req, res) {
  const { id } = req.body;
  try {
    const getResult = await queryRunner(getAdminNotificationQuery);
    if (getResult[0].length > 0) {
      return res.status(200).json({ message: " get Admin Notification", Notification : getResult[0] });
    } else {
      return res.status(500).send("No data found in Notification");
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};



//  ############################# Update Admin Notification ############################################################
exports.updateAdminNotification = async function (req, res) {
  const { id } = req.body;
  try {
    const getResult = await queryRunner(updateAdminNotificationQuery,["1",id]);
    if (getResult[0].affectedRows > 0) {
      return res.status(200).json({ message: " update Admin Notification"});
    } else {
      return res.status(500).send("Error in update Admin Notification");
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }};




  //  ############################# Update All Admin Notification ############################################################
  exports.updateAllAdminNotification = async function (req, res) {
    // const {} = req.body;
    try {
      const updateAllResult = await queryRunner(updateAllAdminNotificationQuery);
      if (updateAllResult[0].affectedRows > 0) {
        return res.status(200).json({ message: " update All Admin Notification"});
      } else {
        return res.status(500).send("Error in update All Admin Notification");
      }
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }};
  




//  ############################# Delete clossed landlord ############################################################
exports.deleteClossedLandlord = async function (req, res) {
  const { id } = req.body;
  try {
    const deleteResult = await queryRunner(deleteQuery("closedAccount","id"),[id]);
    if (deleteResult[0].affectedRows > 0) {
      return res.status(200).json({ message: "Clossed Landlord is deleted"});
    } else {
      return res.status(500).send("Error in Clossed Landlord");
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};    
//  ############################# Delete clossed landlord ############################################################