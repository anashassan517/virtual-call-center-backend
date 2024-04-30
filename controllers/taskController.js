const user = require("../models/user");
const { sendMail, taskSendMail } = require("../sendmail/sendmail");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fs = require("fs");
const Path = require("path");
const imageToDelete = require("./../middleware/deleteImage");
const { serialize } = require("cookie");
const {
  selectQuery,
  deleteQuery,
  addVendor,
  addTasksQuery,
  insertInTaskImage,
  addVendorList,
  getLandlordTenant,
  Alltasks,
  AlltasksTenantsLandlord,
  taskByIDQuery,
  updateTasksQuery,
  selectVendorCategory,
  getVendors,
  delteImageForTaskImages,
  addVendorCategory,
  updateVendorCategory,
  taskCount,
  updateVendor,
  taskCountId,
  taskIdUpdate,
  checkvendorId,
  cVendorId,
  checkTaskid,
  checkUserTaskid,
  addUserTasksQuery,
  addUserList
} = require("../constants/queries");
const { queryRunner } = require("../helper/queryRunner");
const { deleteImageFromS3 } = require("../helper/S3Bucket");

//  #############################  ADD VENDOR ##################################################
exports.addVendors = async (req, res) => {
  const {
    firstName,
    lastName,
    businessName,
    streetAddress,
    city,
    state,
    zip,
    workPhone,
    phone,
    email,
    categoryID,
  } = req.body;
  const { userId, idPattern } = req.user;
  // console.log(userId)
  try {
    const vendorCheckResult = await queryRunner(
      selectQuery("vendor", "email", "landlordID"),
      [email, userId]
    );
    if (vendorCheckResult[0].length > 0) {
      return res.send("Vendor already exists");
    } else {
      const vendorIdCheckresult = await queryRunner(checkvendorId, [userId]);
      let vendorId;
      if (vendorIdCheckresult[0].length > 0) {
        vendorId = vendorIdCheckresult[0][0].cVendorId.split("-");
        let lastPart = parseInt(vendorId[vendorId.length - 1], 10) + 1;
        lastPart = lastPart.toString().padStart(4, '0');
        vendorId = `SR-${idPattern}-VNDR-${lastPart}`;
      } else {
        vendorId = `SR-${idPattern}-VNDR-0001`;
      }
      // console.log(userId)
      const vendorResult = await queryRunner(addVendor, [
        firstName,
        lastName,
        businessName,
        streetAddress,
        city,
        state,
        zip,
        workPhone,
        phone,
        email,
        categoryID,
        userId,
        vendorId,
      ]);
      if (vendorResult.affectedRows === 0) {
        return res.status(400).send("Error1");
      }
    }

    res.status(200).json({
      message: " Vendor created successful",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server Error",
      error: error.message,
  });
  }
};

exports.updateVendor = async (req, res) => {
  const {
    vendId,
    firstName,
    lastName,
    businessName,
    streetAddress,
    city,
    state,
    zip,
    workPhone,
    phone,
    email,
    categoryID,
  } = req.body;
  const { userId } = req.user;
  // console.log(userId)
  try {
    const updateVendorResult = await queryRunner(updateVendor, [
      firstName,
      lastName,
      businessName,
      streetAddress,
      city,
      state,
      zip,
      workPhone,
      phone,
      email,
      categoryID,
      vendId,
    ]);
    if (updateVendorResult[0].affectedRows > 0) {
      res.status(200).json({
        message: " Vendor Updated successful",
      });
    }else{
      res.status(400).json({
        message: " Vendor not Updated successful",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal server Error",
      error: error.message,
  });
  }
};
// delete vendor by id
exports.deleteVendor = async (req, res) => {
    try {
      const { vendorID } = req.params;
      const deleteVendorResult = await queryRunner(
        deleteQuery("vendor", "id"),
        [vendorID]
      );
      if (deleteVendorResult[0].affectedRows > 0) {
        res.status(200).json({
          message: "Vendor Deleted successful",
        });
      }else{
        res.status(400).json({
          message: "Vendor not Deleted",
        });
      }     
    } catch (error) {
      return res.status(500).json({
        message: "Internal server Error",
        error: error.message,
    });
    }
}
//  #############################  ADD VENDOR ENDS HERE ##################################################

//  #############################  All VENDOR Start HERE ##################################################
exports.getAllVendors = async (req, res) => {
  const { userId, userName } = req.user;
  // console.log(userId)
  try {
    const getVendorAPI = await queryRunner(getVendors, [userId]);
    // console.log(getVendorAPI)
    if (getVendorAPI[0].length > 0) {
      res.status(200).json({
        data: getVendorAPI,
        name: userName,
        message: "All vendor retrieved successfully",
      });
    } else {
      res.status(400).json({
        message: "No data found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "An error occurred while retrieving Vendor.",
      error: error.message,
    });
  }
};
//  #############################  All VENDOR ENDS HERE ##################################################


//  #############################  ADD TASK Start HERE ##################################################
exports.addTasks = async (req, res) => {
  const {
    task,
    assignee,
    property,
    dueDate,
    status,
    priority,
    note,
    notifyTenant,
    notifyVendor,
    images,

    // created_at,
    // created_by,
  } = req.body;
  // console.log(req.body);
  const vendorID = assignee;
  const { userId, userName,taskEmail, idPattern } = req.user;
  // const { userId, userName,taskEmail } = req.body;

  const currentDate = new Date();
  try {
    // console.log(1);
    const addTasksCheckResult = await queryRunner(
      selectQuery("task", "taskName", "tenantID"),
      [task, property]
    );
    if (addTasksCheckResult[0].length > 0) {
      return res.send("Task already exists");
    } else {
      const taskIdCheckresult = await queryRunner(checkTaskid, [userId]);
      let taskId;
      if (taskIdCheckresult[0].length > 0) {
        taskId = taskIdCheckresult[0][0].cTaskId.split("-");
        let lastPart = parseInt(taskId[taskId.length - 1], 10) + 1;
        lastPart = lastPart.toString().padStart(4, '0');
        
        taskId = `SR-${idPattern}-MREQ-${lastPart}`;
      } else {
        taskId = `SR-${idPattern}-MREQ-0001`;
      }

      const TasksResult = await queryRunner(addTasksQuery, [
        task,
        property,
        dueDate,
        status,
        priority,
        note,
        notifyTenant,
        notifyVendor,
        currentDate,
        userName,
        userId,
        taskId
      ]);
      if (TasksResult.affectedRows === 0) {
        return res.status(400).send("Error1");
      }
      // else {
        const tasksID = TasksResult[0].insertId;
        // for task id
        // const taskCountIdResult = await queryRunner(taskCountId, [userId]);
        // let customTaskId = taskCountIdResult[0][0].count + 1;
        // customTaskId = task+customTaskId;
        // const taskIdUpdateResult = await queryRunner(taskIdUpdate ,[customTaskId, tasksID]);
        if(images){
      for (let i = 0; i < images?.length; i++) {
        const { image_url } = images[i];
        const { image_key } = images[i];
        const propertyImageResult = await queryRunner(insertInTaskImage, [
          tasksID,
          image_url,
          image_key,
        ]);
        // if property image data not inserted into property image table then throw error
        if (propertyImageResult.affectedRows === 0) {
          throw new Error("data doesn't inserted in property image table");
        }
      }
    }
      //   //  add vendor
      for (let i = 0; i < vendorID.length; i++) {
        const Vendorid = vendorID[i];
        const vendorResults = await queryRunner(addVendorList, [
          tasksID,
          Vendorid,
        ]);
        if (vendorResults.affectedRows === 0) {
          return res.send("Error2");
        }
      }
      // get data from database for email send
      const tenantLandlordResult = await queryRunner(getLandlordTenant, [
        userId,
        property,
      ]);
      let vendorEmailarr = [];
      let vendorNamearr = [];
      for (let i = 0; i < vendorID.length; i++) {
        const vendorCheckResult = await queryRunner(
          selectQuery("vendor", "id"),
          [vendorID[i]]
        );
        if (vendorCheckResult.length > 0) {
          let vendorName =
            vendorCheckResult[0][0].firstName +
            " " +
            vendorCheckResult[0][0].lastName;
          let vendorEmail = vendorCheckResult[0][0].email;
          vendorNamearr.push(vendorName);
          vendorEmailarr.push(vendorEmail);
        } else {
          return res.send("Vendor not found");
        }
      }
      // console.log(tenantLandlordResult[0])
      const tenantName =
        tenantLandlordResult[0][0].firstName +
        " " +
        tenantLandlordResult[0][0].lastName;
      const tenantEmail = tenantLandlordResult[0][0].email;
      const CompanyName = tenantLandlordResult[0][0].companyName;
      const landlordName =
        tenantLandlordResult[0][0].FirstName +
        " " +
        tenantLandlordResult[0][0].LastName;
      const landlordContact = tenantLandlordResult[0][0].Phone;

      const vendorNames = vendorNamearr.toString();

      if (notifyTenant.toLowerCase() === "yes") {
      await taskSendMail(
        tenantName,
        "Property Maintenance: " + task,
        dueDate,
        landlordName,
        task,
        vendorNames,
        priority,
        CompanyName,
        landlordContact,
        userId,
        tenantEmail,
        taskEmail
      );
      }
      if (notifyVendor.toLowerCase() === "yes") {
      for (let i = 0; i < vendorEmailarr.length > 0; i++) {
        // console.log("vendor2");
        await taskSendMail(
          tenantName,
          "Property Maintenance: " + task,
          dueDate,
          landlordName,
          task,
          vendorNames,
          priority,
          CompanyName,
          landlordContact,
          userId,
          vendorEmailarr[i],
          taskEmail
        );
        }
      }
    }
    return res.send("Created");
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server Error",
      error: error.message,
  });
  }
};
//  #############################  ADD TASK ENDS HERE ##################################################

//  ############################# Get ALL Task Start ############################################################
exports.getAllTask = async (req, res) => {
  const { userId } = req.user;
  // const { userId } = req.user;
  try {
    const allTaskResult = await queryRunner(Alltasks, [userId]);

    if (allTaskResult.length > 0) {
      for (let i = 0; i < allTaskResult[0].length; i++) {
        const taskID = allTaskResult[0][i].id;
        const assignToResult = await queryRunner(
          selectQuery("taskassignto", "taskId"),
          [taskID]
        );
        const vendorIDs = assignToResult[0].map((vendor) => vendor.vendorId);

        const vendorData = [];

        for (let j = 0; j < vendorIDs.length; j++) {
          const vendorResult = await queryRunner(selectQuery("vendor", "id"), [
            vendorIDs[j],
          ]);

          if (vendorResult[0].length > 0) {
            const vendor = {
              ID: vendorResult[0][0].id,
              name:
                vendorResult[0][0].firstName +
                " " +
                vendorResult[0][0].lastName,
              email: vendorResult[0][0].email,
              vendorPhone: vendorResult[0][0].phone,
            };
            vendorData.push(vendor);
          }
        }
        allTaskResult[0][i].AssignTo = vendorData;
      }
      // console.log(allTaskResult)
      res.status(200).json({
        data: allTaskResult,
        message: "All Tasks",
      });
    } else {
      res.status(404).json({
        message: "No Tasks data found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal server Error",
      error: error.message,
  });
  }
};
//  ############################# Get ALL Task End ############################################################

//  ############################# Task By ID Start ############################################################
exports.taskByID = async (req, res) => {
  const { Id } = req.body;
  try {
    const taskByIDResult = await queryRunner(taskByIDQuery, [Id]);
    if (taskByIDResult.length > 0) {
      const TaskImagesResult = await queryRunner(
        selectQuery("taskimages", "taskID"),
        [Id]
      );
      if (TaskImagesResult[0].length > 0) {
        const taskImages = TaskImagesResult[0].map((image) => image.taskImages);
        taskByIDResult[0][0].taskImages = taskImages;
      } else {
        taskByIDResult[0][0].taskImages = ["No Task Images Found"];
      }
      const TaskAssignToResult = await queryRunner(
        selectQuery("taskassignto", "taskId"),
        [Id]
      );
      const vendorIDs = TaskAssignToResult[0].map(
        (vendorID) => vendorID.vendorId
      );
      const vendorData = [];
      for (let i = 0; i < vendorIDs.length; i++) {
        const vID = vendorIDs[i];
        const vendorResult = await queryRunner(selectQuery("vendor", "id"), [
          vID,
        ]);
        if (vendorResult.length > 0) {
          const categoryIDs = vendorResult[0][0].categoryID;
          const VendorCategoryResult = await queryRunner(
            selectQuery("vendorcategory", "id"),
            [categoryIDs]
          );
          if (VendorCategoryResult.length > 0) {
            const vendorDataObject = {
              name:
                vendorResult[0][0].firstName +
                " " +
                vendorResult[0][0].lastName,
              businessName: vendorResult[0][0].businessName,
              streetAddress: vendorResult[0][0].streetAddress,
              workNumber: vendorResult[0][0].workNumber,
              mobileNumber: vendorResult[0][0].mobileNumber,
              email: vendorResult[0][0].email,
              category: VendorCategoryResult[0][0].category,
            };
            vendorData.push(vendorDataObject);
          } else {
            vendorData.push(["No Vendor Data Found"]);
          }
        }
      }
      taskByIDResult[0][0].vendor = vendorData;
      res.status(200).json({
        data: taskByIDResult,
        message: "Task data retrieved successfully",
      });
    } else {
      res.status(400).json({
        message: "No Tasks data found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Error Get Tasks",
      error: error.message,
  });  
  }
};

//  ############################# Task By ID End ############################################################

//  ############################# Get vendor category End ############################################################
exports.getVendorCategory = async (req, res) => {
  try {
    // const landlordID = req.userid;
    const { userId } = req.user;
    const categoryResult = await queryRunner(
      selectQuery("vendorcategory", "landLordId"),
      [userId]
    );
    if (categoryResult[0].length > 0) {
      res.status(200).json({
        data: categoryResult[0],
        message: "ALL vendor category",
      });
    } else {
      res.status(400).json({
        message: "No vendor category data found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Error Get category ",
      error: error.message,
  });
    console.log(error);
  }
};
//  ############################# Get vendor category End ############################################################

//  #############################  Task Assign to Start HERE ##################################################

exports.getVendorAssignTo = async (req, res) => {
  try {
    const { userId, userName } = req.user;
    // const {userId}=req.body
    const vendorResult = await queryRunner(
      selectQuery("vendor", "LandlordID"),
      [userId]
    );
    if (vendorResult[0].length > 0) {
      res.status(200).json({
        user: userName,
        data: vendorResult[0],
        message: "ALL vendor Here",
      });
    } else {
      res.status(400).json({
        message: "No vendor data found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Error Get vendor list ",
      error: error.message,
  });

  }
};
//  #############################  Task Assign to ENDS HERE ##################################################

//  #############################  Update TASK Start HERE ##################################################
exports.updateTasks = async (req, res) => {
  const {
    property,
    taskName,
    // assignee,
    taskID,
    dueDate,
    status,
    priority,
    // notes,
    assignee,
    notifyTenant,
    notifyVendor,
    message,
    images,
  } = req.body;

  try {
    const currentDate = new Date();
    const { userId,taskEmail } = req.user;
    const TasksResult = await queryRunner(updateTasksQuery, [
      taskName,
      property,
      dueDate,
      status,
      priority,
      message,
      notifyTenant,
      notifyVendor,
      currentDate,
      taskID,
    ]);
    if (TasksResult[0].affectedRows === 0) {
      // throw new Error("data doesn't inserted in task table");
      res.send("Error1");
    }
    const propertycheckresult = await queryRunner(
      selectQuery("taskimages", "taskID"),
      [taskID]
    );
    // images working code start here
    // console.log(propertycheckresult[0]);
    if (propertycheckresult[0].length > 0) {
      const propertyImageKeys = propertycheckresult[0].map(
        (image) => image?.ImageKey
      );
      // console.log("images" ,images)
      // Find the images to delete from S3 (present in propertycheckresult but not in images)
      const imagesToDelete = propertycheckresult[0].filter(
        (image) => !images?.some((img) => {
          if(img?.ImageKey){
            return img?.ImageKey === image.ImageKey
          }
          else{
            return img?.imageKey === image.ImageKey
          }
        })
      );
      // Delete images from S3
      // console.log(imagesToDelete);
      for (let i = 0; i < imagesToDelete.length; i++) {
        deleteImageFromS3(imagesToDelete[i].ImageKey);
        await queryRunner(delteImageForTaskImages, [
          imagesToDelete[i].ImageKey,
        ]);
      }
      // Find the images to insert into the database (present in images but not in propertycheckresult)
      const imagesToInsert = images?.filter(
        (image) => {
          if(image?.imageKey){
            return !propertyImageKeys.includes(image?.imageKey)
          }else{
            return !propertyImageKeys.includes(image?.ImageKey)
          }
        }
      );
      for (let i = 0; i < imagesToInsert.length; i++) {
        const { image_url } = imagesToInsert[i];
        const { image_key } = imagesToInsert[i];
        const propertyImageResult = await queryRunner(insertInTaskImage, [
          taskID,
          image_url,
          image_key,
        ]);
        // if property image data not inserted into property image table then throw error
        if (propertyImageResult.affectedRows === 0) {
          throw new Error("data doesn't inserted in property image table");
        }
      }
    } else {
      
      console.log("heeuyeguyger",images)
      for (let i = 0; i < images?.length; i++) {
        const { image_url } = images[i];
        const { image_key } = images[i];
        // console.log(taskID, image_url, image_key);

        const propertyImageResult = await queryRunner(insertInTaskImage, [
          taskID,
          image_url,
          image_key,
        ]);
        console.log(propertyImageResult);
        // if property image data not inserted into property image table then throw error
        if (propertyImageResult.affectedRows === 0) {
          throw new Error("data doesn't inserted in property image table");
        }
      }
    }
    const taskVendorDeleteResult = await queryRunner(
      deleteQuery("taskassignto", "taskId"),
      [taskID]
    );
    const vendorID = assignee;
    for (let i = 0; i < vendorID.length; i++) {
      const Vendorid = vendorID[i];
      const vendorResults = await queryRunner(addVendorList, [
        taskID,
        Vendorid,
      ]);
      if (vendorResults.affectedRows === 0) {
        return res.send("Error2");
      }
    }
    console.log( "asdcfrtgh" + property);
    console.log( "frfrf" + userId);
    // // Email Send
    const tenantLandlordResult = await queryRunner(getLandlordTenant, [
      userId,
      property,
    ]);
    // console.log(tenantLandlordResult)
    let vendorEmailarr = [];
    let vendorNamearr = [];
    for (let i = 0; i < vendorID.length; i++) {
      const vendorCheckResult = await queryRunner(selectQuery("vendor", "id"), [
        vendorID[i],
      ]);
      if (vendorCheckResult.length > 0) {
        let vendorName =
          vendorCheckResult[0][0].firstName +
          " " +
          vendorCheckResult[0][0].lastName;
        let vendorEmail = vendorCheckResult[0][0].email;
        vendorNamearr.push(vendorName);
        vendorEmailarr.push(vendorEmail);
      } else {
        throw new Error("Vendor not found");
      }
    }
    const tenantName =
      tenantLandlordResult[0][0].firstName +
      " " +
      tenantLandlordResult[0][0].lastName;
    const tenantEmail = tenantLandlordResult[0][0].email;
    const CompanyName = tenantLandlordResult[0][0].companyName;
    const landlordName =
      tenantLandlordResult[0][0].FirstName +
      " " +
      tenantLandlordResult[0][0].LastName;
    const landlordContact = tenantLandlordResult[0][0].Phone;
    const landlordEmail = tenantLandlordResult[0][0].Email;

    const vendorNames = vendorNamearr.toString();

    // if (notifyTenant.toLowerCase() === "yes") {
    await taskSendMail(
      tenantName,
      "Property Maintenance: " + taskName,
      dueDate,
      landlordName,
      taskName,
      vendorNames,
      priority,
      CompanyName,
      landlordContact,
      userId,
      tenantEmail,
      taskEmail
    );
    // }
    // if (notifyVendor.toLowerCase() === "yes") {
    for (let i = 0; i < vendorEmailarr.length > 0; i++) {
      console.log("vendor2");
      await taskSendMail(
        tenantName,
        "Property Maintenance: " + taskName,
        dueDate,
        landlordName,
        taskName,
        vendorNames,
        priority,
        CompanyName,
        landlordContact,
        userId,
        vendorEmailarr[i],
        taskEmail
      );
      // }
    }
    return res.status(200).json({
      message: " task updated successful ",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: error.message,
    });
  }
};
//  #############################  Update TASK ENDS HERE ##################################################

//  #############################  Delete Task Start HERE ##################################################

exports.deleteTask = async (req, res) => {
  try {
    const { taskID } = req.body;
    const deleteTaskResult = await queryRunner(deleteQuery("task", "id"), [
      taskID,
    ]);
    if (deleteTaskResult[0].affectedRows > 0) {
      res.status(200).json({
        // data: vendorResult[0],
        message: "task Deleted Successful",
      });
    } else {
      res.status(400).json({
        message: "No task data found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Error Get delete task",
      error: error.message,
  });

  }
};
//  #############################  Delete Task ENDS HERE ##################################################

// add vendor category
// exports.addVendorCategory = async (req, res) => {
//   const categories = req.body;
//   const { userId } = req.user;
//   try {
//     const categoryCheckResult = await queryRunner(
//       selectQuery("vendorcategory", "landLordId"),
//       [userId]
//     );
//     const existingCategories = categoryCheckResult[0];

//     // Prepare arrays for updates and insertions
//     const categoriesToDelete = [];
//     const categoriesToInsert = [];

//     for (const obj1 of existingCategories) {
//       // Check if there's a corresponding object in array2 with the same properties
//       const obj2 = categories.find((obj) => obj.category.toLowerCase() === obj1.category.toLowerCase());
//       if (!obj2) {
//         await queryRunner(
//           deleteQuery("vendorcategory", "id"),
//           [obj1.id]
//         );
//       }
//     }

//     for (const obj1 of categories) {
//       // Check if there's a corresponding object in existingCategories with the same properties
//       const obj2 = existingCategories.find((obj) => obj.category.toLowerCase() === obj1.category.toLowerCase());

//       if (!obj2) {
//         // Insert the category and get the inserted ID
//         const insertedCategory = await queryRunner(addVendorCategory, [
//           obj1.category.toLowerCase(),
//           userId,
//         ]);

//         categoriesToInsert.push(insertedCategory);
//       }
//     }

//     res.status(200).json({
//       message: "Categories added/updated successfully",
//       insertedCategories: categoriesToInsert, // Include inserted IDs in the response
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(400).send(error);
//   }
// };


// add vendor category 19/9/23
// const { queryRunner } = require('your-query-runner-library'); // Import your queryRunner library here

exports.addVendorCategory = async (req, res) => {
  const categories = req.body;
 


  const { userId } = req.user;
  // const { userId } = req.body;
  let insertedId;

  try {
    const categoryCheckResult = await queryRunner(selectQuery("vendorcategory", "landLordId"), [userId]);
    const existingCategories = categoryCheckResult[0];

    if (!Array.isArray(categories)) {
      console.log("fsdjksdjfksdfksdkjsdkjfksdjjsdfsdjsd")
      console.log(categories);
      const categoryToInsert = existingCategories.find(category => 
        category.categories && category.categories.toLowerCase() === categories.categories.toLowerCase()
      );

      if (!categoryToInsert) {
        insertedId = await queryRunner(addVendorCategory, [
          categories.categories.toLowerCase(),
          userId,
        ]);
        console.log(insertedId[0]?.insertId);

        res.status(200).json({
          message: "Categories added/updated successfully",
          categoryID: insertedId[0]?.insertId,
        });
      } else {
        res.status(409).json({
          message: "Category already exists",
          categoryID: categoryToInsert.id,
        });
      }
    } else if (Array.isArray(categories)) {
      
      const categoryToInsert = categories.filter(category => 
        !existingCategories.some(existingCategory =>
          existingCategory.category && existingCategory.category.toLowerCase() === category.category.toLowerCase()
        )
      );

      const categoryToDelete = existingCategories.filter(existingCategory => 
        !categories.some(category =>
          category.category && category.category.toLowerCase() === existingCategory.category.toLowerCase()
        )
      );
          console.log(categoryToInsert);
          await Promise.all(
            categoryToInsert.map(async (item) => {
              await queryRunner(addVendorCategory, [item.category, userId]);
            })
          );
      if (categoryCheckResult[0].length !== 0) {
        

        await Promise.all(
          categoryToDelete.map(async (item) => {
            console.log(item);
            await queryRunner(deleteQuery("vendorcategory", "id"), [item.id]);
          })
        );
      }

      res.status(200).json({
        message: "Categories added/updated successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Error",
      error: error.message,
  });
  }
};







// ####################################### Task Count ################################################

exports.taskCount = async (req, res) => {
  try {
    // const { userId } = req.user;
    const { userId } = req.user;
    const { startDate, endDate } = req.body;
    // console.log("2");
    const taskCountResult = await queryRunner(taskCount, [
      userId,
      startDate,
      endDate,
    ]);
    // console.log("3");

    res.status(200).json({
      data: taskCountResult,
    });
    // }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
// ####################################### Task Count ################################################

//  ############################# Get ALL Task Start ############################################################
exports.getAllTaskTenantRequest = async (req, res) => {
  // const { userId } = req.body;
  const { userId } = req.user;
  try {
    const allTaskResult = await queryRunner(AlltasksTenantsLandlord, [userId]);

    if (allTaskResult.length > 0) {
      for (let i = 0; i < allTaskResult[0].length; i++) {
        const taskID = allTaskResult[0][i].id;
        const assignToResult = await queryRunner(
          selectQuery("taskassignto", "taskId"),
          [taskID]
        );
        const vendorIDs = assignToResult[0].map((vendor) => vendor.vendorId);

        const vendorData = [];

        for (let j = 0; j < vendorIDs.length; j++) {
          const vendorResult = await queryRunner(selectQuery("vendor", "id"), [
            vendorIDs[j],
          ]);

          if (vendorResult[0].length > 0) {
            const vendor = {
              ID: vendorResult[0][0].id,
              name:
                vendorResult[0][0].firstName +
                " " +
                vendorResult[0][0].lastName,
              email: vendorResult[0][0].email,
              vendorPhone: vendorResult[0][0].phone,
            };
            vendorData.push(vendor);
          }
        }
        allTaskResult[0][i].AssignTo = vendorData;
      }
      // console.log(allTaskResult)
      res.status(200).json({
        data: allTaskResult,
        message: "All Tasks",
      });
    } else {
      res.status(404).json({
        message: "No Tasks data found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Error Get task",
      error: error.message,
  });

  }
};
//  ############################# Get ALL Task End ############################################################





//  ############################# Get ALL Task End ############################################################
exports.VendorCheckEmail = async function (req, res) {
  const { email } = req.params;
  try {
    const selectResult = await queryRunner(selectQuery("vendor","email"), [ 
      email,
  ]);

    if (selectResult[0].length > 0) {
      return res.status(409).json({
          message: "Email already exists ",
      });
    } 
    else {
      res.status(200).json({
                 message: "New vendor",
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};



//   const {
//     task,
//     assignee,
//     property,
//     dueDate,
//     status,
//     priority,
//     note,
//     notifyVendor,
//     images,

//     // created_at,
//     // created_by,
//   } = req.body;
//   // console.log(req.body);
//   const userID = assignee;
//   const { userId, userName,taskEmail, idPattern,email } = req.user;
//   // const { userId, userName,taskEmail } = req.body;

//   const currentDate = new Date();
//   try {
//     // console.log(1);
//     const addTasksCheckResult = await queryRunner(
//       selectQuery("user_task", "taskName", "propertyId"),
//       [task, property]
//     );
//     if (addTasksCheckResult[0].length > 0) {
//       return res.send("Task already exists");
//     } else {
//       const taskIdCheckresult = await queryRunner(checkUserTaskid, [userId]);
//       let taskId;
//       if (taskIdCheckresult[0].length > 0) {
//         taskId = taskIdCheckresult[0][0].cTaskId.split("-");
//         let lastPart = parseInt(taskId[taskId.length - 1], 10) + 1;
//         lastPart = lastPart.toString().padStart(4, '0');
//         taskId = `SR-${idPattern}-TASK-${lastPart}`;
//       } else {
//         taskId = `SR-${idPattern}-TASK-0001`;
//       }

//       const TasksResult = await queryRunner(addUserTasksQuery, [
//         task,
//         property,
//         dueDate,
//         status,
//         priority,
//         note,
//         notifyVendor,
//         currentDate,
//         userName,
//         userId,
//         taskId
//       ]);
//       if (TasksResult.affectedRows === 0) {
//         return res.status(400).send("Error1");
//       }
//       // else {
//         const tasksID = TasksResult[0].insertId;
//         // for task id
//         // const taskCountIdResult = await queryRunner(taskCountId, [userId]);
//         // let customTaskId = taskCountIdResult[0][0].count + 1;
//         // customTaskId = task+customTaskId;
//         // const taskIdUpdateResult = await queryRunner(taskIdUpdate ,[customTaskId, tasksID]);
//         if(images){
//       for (let i = 0; i < images?.length; i++) {
//         const { image_url } = images[i];
//         const { image_key } = images[i];
//         const propertyImageResult = await queryRunner(insertInTaskImage, [
//           tasksID,
//           image_url,
//           image_key,
//         ]);
//         // if property image data not inserted into property image table then throw error
//         if (propertyImageResult.affectedRows === 0) {
//           throw new Error("data doesn't inserted in property image table");
//         }
//       }
//     }
//       //   //  add vendor
//       for (let i = 0; i < userID.length; i++) {
//         const Vendorid = userID[i];
//         const vendorResults = await queryRunner(addUserList, [
//           tasksID,
//           Vendorid,
//         ]);
//         if (vendorResults.affectedRows === 0) {
//           return res.send("Error2");
//         }
//       }
//       // // get data from database for email send
//       // const tenantLandlordResult = await queryRunner(getLandlordTenant, [
//       //   userId,
//       //   property,
//       // ]);
//       // let userEmailarr = [];
//       // let userNamearr = [];
//       // let userCheckResult;
//       // let vendorCheckResult;
//       // for (let i = 0; i < userID.length; i++) {
//       //   if(userId==userID[i]){
//       //     userCheckResult = await queryRunner(
//       //       selectQuery("users", "id"),
//       //       [userID[i]]
//       //     );
//       //     if(userCheckResult.length>0){
//       //       if(userCheckResult[0][0].email==email){

//       //       }
//       //     }
//       //   }else{
//       //     vendorCheckResult = await queryRunner(
//       //       selectQuery("userPUsers", "id"),
//       //       [userID[i]]
//       //     );
//       //     if (vendorCheckResult.length > 0) {
//       //       let vendorName =
//       //         vendorCheckResult[0][0].UFirstName +
//       //         " " +
//       //         vendorCheckResult[0][0].ULastName;
//       //       let vendorEmail = vendorCheckResult[0][0].UEmail;
//       //       userNamearr.push(vendorName);
//       //       userEmailarr.push(vendorEmail);
//       //     } 
//       //     else {
//       //       return res.send("Vendor not found");
//       //     }
//       //   }
        
        
//       // }
//       // // console.log(tenantLandlordResult[0])
//       // // const tenantName =
//       // //   tenantLandlordResult[0][0].firstName +
//       // //   " " +
//       // //   tenantLandlordResult[0][0].lastName;
//       // // const tenantEmail = tenantLandlordResult[0][0].email;
//       // // const CompanyName = tenantLandlordResult[0][0].companyName;
//       // // const landlordName =
//       // //   tenantLandlordResult[0][0].FirstName +
//       // //   " " +
//       // //   tenantLandlordResult[0][0].LastName;
//       // // const landlordContact = tenantLandlordResult[0][0].Phone;

//       // // const vendorNames = vendorNamearr.toString();

//       // // if (notifyTenant.toLowerCase() === "yes") {
//       // // await taskSendMail(
//       // //   tenantName,
//       // //   "Property Maintenance: " + task,
//       // //   dueDate,
//       // //   landlordName,
//       // //   task,
//       // //   vendorNames,
//       // //   priority,
//       // //   CompanyName,
//       // //   landlordContact,
//       // //   userId,
//       // //   tenantEmail,
//       // //   taskEmail
//       // // );
//       // // }
//       // if (notifyVendor.toLowerCase() === "yes") {
//       // for (let i = 0; i < vendorEmailarr.length > 0; i++) {
//       //   // console.log("vendor2");
//       //   await taskSendMail(
//       //     tenantName,
//       //     "Property Maintenance: " + task,
//       //     dueDate,
//       //     landlordName,
//       //     task,
//       //     vendorNames,
//       //     priority,
//       //     CompanyName,
//       //     landlordContact,
//       //     userId,
//       //     vendorEmailarr[i],
//       //     taskEmail
//       //   );
//       //   }
//       // }
//     }
//     return res.send("Created");
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       message: "Internal server Error",
//       error: error.message,
//   });
//   }
// };