const user = require("../models/user");
const {
  sendMail,
  taskSendMail,
  sendMailLandlord,

} = require("../sendmail/sendmail.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fs = require("fs");
const Path = require("path");
const imageToDelete = require("./../middleware/deleteImage.js");
const { serialize } = require("cookie");
const {
  selectQuery,
  deleteQuery,
  insertInUsers,
  insertInUserPermissionUsers,
  updateUserPermissionUsers,
  userPermissionUpdate,
  getUsersWithRoles
} = require("../constants/queries");

const { hashedPassword } = require("../helper/hash");
const { queryRunner } = require("../helper/queryRunner");
const config = process.env;



exports.createUserPermissionUser = async function (req, res) {
  const { firstName, lastName, email, phone, password, Ustatus, role, images } = req.body;
  const { userId } = req.user;
  // const { userId } = req.body;
  const currentDate = new Date();

  try {
    let image_url = "";
    let image_key = "";
    if (images?.length > 0) {
      image_url = images[0]?.image_url;
      image_key = images[0]?.image_key;
    }
    const selectResult = await queryRunner(selectQuery("userPUsers", "llnalordId", "UEmail"), [
      userId,
      email,
    ]);
    if (selectResult[0].length > 0) {
      return res.status(201).send("Email already exists");
    }
    const hashPassword = await hashedPassword(password);
    // generate a unique identifier for the user
    const salt = bcrypt.genSaltSync(10);
    const id = bcrypt
      .hashSync(lastName + new Date().getTime().toString(), salt)
      .substring(0, 10);
    const insertResult = await queryRunner(insertInUserPermissionUsers, [
      userId,
      firstName,
      lastName,
      email,
      phone,
      hashPassword,
      Ustatus,
      role,
      currentDate,
      image_url,
      image_key,
    ]);
    const name = firstName + " " + lastName;
    const mailSubject = "Spade Welcome Email";
    if (insertResult[0].affectedRows > 0) {
      console.log(email + " " + mailSubject + " " + name)
      await sendMailLandlord(email, mailSubject, name);
      return res.status(200).json({ message: "Users Permission User added successfully " });
    } else {
      return res.status(500).send("Failed to add User Permission User ");
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
// User Check Email
exports.userCheckEmail = async function (req, res) {
  const { email } = req.query;
  // const { email } = req.body;
  const { userId } = req.user;
  try {
    const selectResult = await queryRunner(selectQuery("userPUsers", "llnalordId", "UEmail "), [
      userId,
      email,
    ]);
    const LandlordSelectResult = await queryRunner(selectQuery("users", "Email"), [
      email,
    ]);
    if (selectResult[0].length > 0 && LandlordSelectResult[0].length > 0) {
      return res.status(409).json({
        message: "Email already exists ",
        data: selectResult,
      });
    } else if (selectResult[0].length > 0) {
      return res.status(409).json({
        message: "Email already exists ",
        data: selectResult,
      });
    } else if (LandlordSelectResult[0].length > 0) {
      return res.status(409).json({
        message: "Email already exists ",
        data: selectResult,
      });
    }
    else {
      res.status(200).json({
        message: "New user",
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// User get By Id
exports.userPermissionGetById = async function (req, res) {
  // const { id } = req.query;
  const { id } = req.body;
  // const { userId } = req.user;;
  try {
    const selectResult = await queryRunner(selectQuery("userPUsers", "id"), [
      id,
    ]);
    if (selectResult[0].length > 0) {
      return res.status(200).json({
        data: selectResult[0][0],
      });
    } else {
      res.status(404).json({
        message: "No user Found",
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// update User 
exports.updateUserPermissionUsers = async function (req, res) {
  const { firstName, lastName, email, phone, Ustatus, role, id, images } = req.body;
  console.log(req.body)
  const currentDate = new Date();
  let image_url = "";
  let image_key = "";
  try {
    if (images?.length > 0) {
      if(images[0]?.imageURL){
        image_url = images[0]?.imageURL;
        image_key = images[0]?.imageKey;
      }
      else{
        image_url = images[0]?.image_url;
        image_key = images[0]?.image_key;
      }
    }
    const insertResult = await queryRunner(updateUserPermissionUsers, [
      firstName,
      lastName,
      email,
      phone,
      Ustatus,
      role,
      currentDate,
      image_url,
      image_key,
      id,
    ]);
    if (insertResult[0].affectedRows > 0) {
      return res.status(200).json({ message: " User Updated Successfully" });
    } else {
      return res.status(500).send("Failed to Update User Permission User");
    }
  } catch (error) {
    console.log(error)
    return res.status(400).json({ message: error.message });
  }
};

// User Permission Delete
exports.userPermissionUsersDelete = async function (req, res) {
  const { id } = req.body;
  try {
    const selectResult = await queryRunner(deleteQuery("userPUsers", "id"), [
      id,
    ]);
    if (selectResult[0].affectedRows > 0) {
      return res.status(200).json({
        message: "User Deleted Successsful"
      });
    } else {
      res.status(404).json({
        message: "No user Found",
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// User get All Users
exports.userPermissionGetAll = async function (req, res) {

  const { userId } = req.user;
  try {
    const selectResult = await queryRunner(getUsersWithRoles, [
      userId,
    ]);
    console.log(selectResult[0])
    if (selectResult[0].length > 0) {
      return res.status(200).json({
        data: selectResult[0],
      });
    } else {
      res.status(404).json({
        data:[],
        message: "No user Found",
      });
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({
      message: error.message,
    });
  }
};
// Get User Roles
exports.userPermissionRoles = async function (req, res) {
  const { userId } = req.user;
  // const { userId } = req.body;
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
    const selectResult = await queryRunner(selectQuery("userRoles", "userId"), [userId]);
    if (selectResult[0].length > 0) {
      const dataArray = [];

      for (let i = 0; i < selectResult[0].length; i++) {
        const data = {};

        // Example usage for different fields
        const id = selectResult[0][i].id;
        const role = selectResult[0][i].Urole;
        const llDashboard = splitAndConvertToObject(selectResult[0][i].llDashboard);
        const properties = splitAndConvertToObject(selectResult[0][i].properties);
        const units = splitAndConvertToObject(selectResult[0][i].units);
        const tenants = splitAndConvertToObject(selectResult[0][i].tenants);
        const task = splitAndConvertToObject(selectResult[0][i].task);
        const invoices = splitAndConvertToObject(selectResult[0][i].invoices);
        const leads = splitAndConvertToObject(selectResult[0][i].leads);
        const leadsInsight = splitAndConvertToObject(selectResult[0][i].leadsInsight);
        const settingProfile = splitAndConvertToObject(selectResult[0][i].settingProfile);
        const settingCPassword = splitAndConvertToObject(selectResult[0][i].settingCPassword);
        const settingNotification = splitAndConvertToObject(selectResult[0][i].settingNotification);
        const settingCTheme = splitAndConvertToObject(selectResult[0][i].settingCTheme);
        const settingSubscription = splitAndConvertToObject(selectResult[0][i].settingSubscription);
        const settingMUsers = splitAndConvertToObject(selectResult[0][i].settingMUsers);
        const settingEmailT = splitAndConvertToObject(selectResult[0][i].settingEmailT);
        const SettingInvoiceSetting = splitAndConvertToObject(selectResult[0][i].SettingInvoiceSetting);

        dataArray.push({
          id,
          role,
          llDashboard,
          properties,
          units,
          tenants,
          task,
          invoices,
          leads,
          leadsInsight,
          settingProfile,
          settingCPassword,
          settingNotification,
          settingCTheme,
          settingSubscription,
          settingMUsers,
          settingEmailT,
          SettingInvoiceSetting,
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
    console.log(error)
    res.status(400).json({
      message: error.message,
    });
  }
};

// Tenant status CP Start 
exports.userPermissionUpdate = async function (req, res) {
  const { role, columnName, permission } = req.body;
  // const currentDate = new Date();
  try {
    const updateResult = await queryRunner(`UPDATE userRoles SET ${columnName} = "${permission}" WHERE id = ${role}`);
    if (updateResult[0].affectedRows > 0) {
      return res.status(200).json({ message: " User Permission Updated Successfully" });
    } else {
      return res.status(500).send("Failed to Update User Permission User");
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
