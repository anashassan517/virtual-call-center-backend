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
  insertInUserTaskimages, 
  checkUserTaskid,
  addUserTasksQuery,
  addUserList,
  userAllTask,
  updateUserTasksQuery,
  delteImageForTaskUserImages
} = require("../constants/queries");
const { queryRunner } = require("../helper/queryRunner");
const { deleteImageFromS3 } = require("../helper/S3Bucket");




exports.addUsersTask = async (req, res) => {
  const {
    task,
    assignee,
    property,
    propertyUnit,
    dueDate,
    status,
    priority,
    note,
    notifyVendor,
    images,

    // created_at,
    // created_by,
  } = req.body;
  console.log("usertaskController");
  // console.log(req.body);
  const userID = assignee;
  const { userId, userName,taskEmail, idPattern,email } = req.user;
  // const { userId, userName,taskEmail } = req.body;

  const currentDate = new Date();
  try {
    // console.log(1);
    // const addTasksCheckResult = await queryRunner(
    //   selectQuery("user_task", "taskName", "propertyId"),
    //   [task, property]
    // );
    // if (addTasksCheckResult[0].length > 0) {
    //   return res.send("Task already exists");
    // } else {
      const taskIdCheckresult = await queryRunner(checkUserTaskid, [userId]);
      let taskId;
      if (taskIdCheckresult[0].length > 0) {
        taskId = taskIdCheckresult[0][0].cTaskId.split("-");
        let lastPart = parseInt(taskId[taskId.length - 1], 10) + 1;
        lastPart = lastPart.toString().padStart(4, '0');
        taskId = `SR-${idPattern}-TASK-${lastPart}`;
      } else {
        taskId = `SR-${idPattern}-TASK-0001`;
      }

      const TasksResult = await queryRunner(addUserTasksQuery, [
        task,
        property,
        propertyUnit,
        dueDate,
        status,
        priority,
        note,
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
        if(images){
      for (let i = 0; i < images.length; i++) {
        const { image_url } = images[i];
        const { image_key } = images[i];
        const propertyImageResult = await queryRunner(insertInUserTaskimages, [
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
      for (let i = 0; i < userID.length; i++) {
        const { Vendorid } = userID[i];
        const { Vendorrole } = userID[i];
        const vendorResults = await queryRunner(addUserList, [
          tasksID,
          Vendorid,
          Vendorrole,
        ]);
        // if (vendorResults.affectedRows === 0) {
        //   return res.send("Error2");
        // }
      }
      // // get data from database for email send
      // const tenantLandlordResult = await queryRunner(getLandlordTenant, [
      //   userId,
      //   property,
      // ]);
      // let userEmailarr = [];
      // let userNamearr = [];
      // let userCheckResult;
      // let vendorCheckResult;
      // for (let i = 0; i < userID.length; i++) {
      //   if(userId==userID[i]){
      //     userCheckResult = await queryRunner(
      //       selectQuery("users", "id"),
      //       [userID[i]]
      //     );
      //     if(userCheckResult.length>0){
      //       if(userCheckResult[0][0].email==email){

      //       }
      //     }
      //   }else{
      //     vendorCheckResult = await queryRunner(
      //       selectQuery("userPUsers", "id"),
      //       [userID[i]]
      //     );
      //     if (vendorCheckResult.length > 0) {
      //       let vendorName =
      //         vendorCheckResult[0][0].UFirstName +
      //         " " +
      //         vendorCheckResult[0][0].ULastName;
      //       let vendorEmail = vendorCheckResult[0][0].UEmail;
      //       userNamearr.push(vendorName);
      //       userEmailarr.push(vendorEmail);
      //     } 
      //     else {
      //       return res.send("Vendor not found");
      //     }
      //   }
        
        
      // }
      // // console.log(tenantLandlordResult[0])
      // // const tenantName =
      // //   tenantLandlordResult[0][0].firstName +
      // //   " " +
      // //   tenantLandlordResult[0][0].lastName;
      // // const tenantEmail = tenantLandlordResult[0][0].email;
      // // const CompanyName = tenantLandlordResult[0][0].companyName;
      // // const landlordName =
      // //   tenantLandlordResult[0][0].FirstName +
      // //   " " +
      // //   tenantLandlordResult[0][0].LastName;
      // // const landlordContact = tenantLandlordResult[0][0].Phone;

      // // const vendorNames = vendorNamearr.toString();

      // // if (notifyTenant.toLowerCase() === "yes") {
      // // await taskSendMail(
      // //   tenantName,
      // //   "Property Maintenance: " + task,
      // //   dueDate,
      // //   landlordName,
      // //   task,
      // //   vendorNames,
      // //   priority,
      // //   CompanyName,
      // //   landlordContact,
      // //   userId,
      // //   tenantEmail,
      // //   taskEmail
      // // );
      // // }
      // if (notifyVendor.toLowerCase() === "yes") {
      // for (let i = 0; i < vendorEmailarr.length > 0; i++) {
      //   // console.log("vendor2");
      //   await taskSendMail(
      //     tenantName,
      //     "Property Maintenance: " + task,
      //     dueDate,
      //     landlordName,
      //     task,
      //     vendorNames,
      //     priority,
      //     CompanyName,
      //     landlordContact,
      //     userId,
      //     vendorEmailarr[i],
      //     taskEmail
      //   );
      //   }
      // }
    // }
    return res.status(200).json({message : "User task created"});
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server Error",
      error: error.message,
  });
  }
};





//  ############################# Get ALL users Task Start ############################################################

exports.getAllUserTask = async (req, res) => {
  try {
    const { userId } = req.user;
    const allTaskResult = await queryRunner(userAllTask, [userId]);

    if (allTaskResult.length > 0) {
      const tasksData = [];


      for (const task of allTaskResult[0]) {
        const taskID = task.taskid;
        // for images start
        const assignToImagesResult = await queryRunner(
            selectQuery("userTaskImages", "taskID"),
            [taskID]
          ); 
          if (assignToImagesResult[0].length > 0) {
            task.images = assignToImagesResult[0];
          }else{
            task.images = [];
          }

        // for images END

        const assignToResult = await queryRunner(
          selectQuery("users_assignto", "taskId"),
          [taskID]
        );

        const assignToData = [];

        for (const assignment of assignToResult[0]) {
          if (assignment.assignRole === "user") {
            const userIDs = assignment.userId;
            const userResult = await queryRunner(
              selectQuery("userPUsers", "id"),
              [userIDs]
            );

            if (userResult[0].length > 0) {
              const user = {
                ID: userResult[0][0].id,
                role: "User",
                name: userResult[0][0].UFirstName + " " + userResult[0][0].ULastName,
                email: userResult[0][0].UEmail,
                userPhone: userResult[0][0].UPhone,
              };
              assignToData.push(user);
            }
          } else if (assignment.assignRole === "vendor") {
            const vendorID = assignment.userId;
            const vendorResult = await queryRunner(selectQuery("vendor", "id"), [
              vendorID,
            ]);

            if (vendorResult[0].length > 0) {
              const vendor = {
                ID: vendorResult[0][0].id,
                role: "Vendor",
                name:
                  vendorResult[0][0].firstName +
                  " " +
                  vendorResult[0][0].lastName,
                email: vendorResult[0][0].email,
                vendorPhone: vendorResult[0][0].phone,
              };
              assignToData.push(vendor);
            }
          } else if (assignment.assignRole === "landlord") {
            const landlordID = assignment.userId;
            const landlordResult = await queryRunner(selectQuery("users", "id"), [
              landlordID,
            ]);

            if (landlordResult[0].length > 0) {
              const landlord = {
                ID: landlordResult[0][0].id,
                role: "Landlord",
                name:
                  landlordResult[0][0].FirstName +
                  " " +
                  landlordResult[0][0].LastName,
                email: landlordResult[0][0].Email,
                landlordPhone: landlordResult[0][0].Phone,
              };
              assignToData.push(landlord);
            }
          } else {
            const notFound = "No user Found";
            assignToData.push(notFound);
          }
        }

        task.AssignTo = assignToData;
        
        tasksData.push(task);
      }

      res.status(200).json({
        data: tasksData,
        message: "All Tasks",
      });
    } else {
      res.status(404).json({
        message: "No Tasks data found",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server Error",
      error: error.message,
    });
  }
};

  //  ############################# Get ALL users Task End ############################################################
  


exports.getAllTasks=async(req,res)=>{
  const {userId}=req.user;
  try{
    const result=queryRunner(getAllTasksQuery,[userId])
    res.status(200).json(result[0])
  }catch(error){
    res.status(400)
  }
  

}


//   ############################################ DElete user Task ######################################################
  exports.deleteUserTask = async (req, res) => {
    try {
      const { taskID } = req.body;
      const deleteTaskResult = await queryRunner(deleteQuery("user_task", "id"), [
        taskID,
      ]);
      if (deleteTaskResult[0].affectedRows > 0) {

        const deleteTaskImagesResult = await queryRunner(deleteQuery("userTaskImages", "taskID"), [
            taskID,
          ]);
        const deleteTaskAssignToResult = await queryRunner(deleteQuery("users_assignto", "taskId"), [
            taskID,
          ]);
        res.status(200).json({
          // data: vendorResult[0],
          message: "task Deleted Successful",
        });
      } else {
        res.status(200).json({
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
//   ############################################ DElete user Task ######################################################




//  #############################  Update TASK Start HERE ##################################################
exports.updateUserTask = async (req, res) => {
    const {
        taskName,
        property,
        PropertyUnit,
      taskID,
      dueDate,
      status,
      priority,
      // notes,
      assignee,
      notifyAssignee,
      notes,
      images,
    } = req.body;
  
    try {
      console.log(images);
      const currentDate = new Date();
      const { userId,taskEmail } = req.user;
      console.log(images)
      console.log( taskName,
        property,
        PropertyUnit,
        dueDate,
        status,
        priority,
        notes,
        notifyAssignee,
        currentDate,
        taskID);
      const TasksResult = await queryRunner(updateUserTasksQuery, [
        taskName,
      property,
      PropertyUnit,
      dueDate,
      status,
      priority,
      notes,
      notifyAssignee,
      currentDate,
      taskID,
      ]);
      if (TasksResult[0].affectedRows === 0) {
        // throw new Error("data doesn't inserted in task table");
        res.send("Error1");
      }
      const propertycheckresult = await queryRunner(
        selectQuery("userTaskImages", "taskID"),
        [taskID]
      );
      // images working code start here
      if (propertycheckresult[0].length > 0) {
        const propertyImageKeys = propertycheckresult[0].map(
          (image) => image.ImageKey
        );
        // Find the images to delete from S3 (present in propertycheckresult but not in images)
        const imagesToDelete = propertycheckresult[0].filter(
          (image) => !images.some((img) => img.ImageKey == image.ImageKey)
        );
        // Delete images from S3
        for (let i = 0; i < imagesToDelete.length; i++) {
          deleteImageFromS3(imagesToDelete[i].ImageKey);
          // console.log(imagesToDelete[i].ImageKey)
          await queryRunner(delteImageForTaskUserImages, [
            imagesToDelete[i].ImageKey,
          ]);
        }
        // Find the images to insert into the database (present in images but not in propertycheckresult)
        const imagesToInsert = images.filter(
          (image) => !propertyImageKeys.includes(image.ImageKey)
        );
        // console.log("imagesToInsert");
        // console.log(imagesToInsert.length);
        for (let i = 0; i < imagesToInsert.length; i++) {
          const { image_url } = imagesToInsert[i];
          const { image_key } = imagesToInsert[i];
          const propertyImageResult = await queryRunner(insertInUserTaskimages, [
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
        for (let i = 0; i < images.length; i++) {
          const { image_url } = images[i];
          const { image_key } = images[i];
          // console.log(taskID, image_url, image_key);
  
          const propertyImageResult = await queryRunner(insertInUserTaskimages, [
            taskID,
            image_url,
            image_key,
          ]);
          // if property image data not inserted into property image table then throw error
          if (propertyImageResult.affectedRows === 0) {
            throw new Error("data doesn't inserted in property image table");
          }
        }
      }
      const taskVendorDeleteResult = await queryRunner(
        deleteQuery("users_assignto", "taskId"),
        [taskID]
      );
      const vendorID = assignee;
      console.log(assignee)
      for (let i = 0; i < vendorID.length; i++) {
        const { Vendorid } = vendorID[i];
        const { Vendorrole } = vendorID[i];
        const vendorResults = await queryRunner(addUserList, [
            taskID,
            Vendorid,
            Vendorrole,
          ]);
        // if (vendorResults.affectedRows === 0) {
        //   return res.send("Error2");
        // }
      }
    // //   console.log( "asdcfrtgh" + property);
    // //   console.log( "frfrf" + userId);
    //   // // Email Send
    //   const tenantLandlordResult = await queryRunner(getLandlordTenant, [
    //     userId,
    //     property,
    //   ]);
    //   // console.log(tenantLandlordResult)
    //   let vendorEmailarr = [];
    //   let vendorNamearr = [];
    //   for (let i = 0; i < vendorID.length; i++) {
    //     const vendorCheckResult = await queryRunner(selectQuery("vendor", "id"), [
    //       vendorID[i],
    //     ]);
    //     if (vendorCheckResult.length > 0) {
    //       let vendorName =
    //         vendorCheckResult[0][0].firstName +
    //         " " +
    //         vendorCheckResult[0][0].lastName;
    //       let vendorEmail = vendorCheckResult[0][0].email;
    //       vendorNamearr.push(vendorName);
    //       vendorEmailarr.push(vendorEmail);
    //     } else {
    //       throw new Error("Vendor not found");
    //     }
    //   }
    //   const tenantName =
    //     tenantLandlordResult[0][0].firstName +
    //     " " +
    //     tenantLandlordResult[0][0].lastName;
    //   const tenantEmail = tenantLandlordResult[0][0].email;
    //   const CompanyName = tenantLandlordResult[0][0].companyName;
    //   const landlordName =
    //     tenantLandlordResult[0][0].FirstName +
    //     " " +
    //     tenantLandlordResult[0][0].LastName;
    //   const landlordContact = tenantLandlordResult[0][0].Phone;
    //   const landlordEmail = tenantLandlordResult[0][0].Email;
  
    //   const vendorNames = vendorNamearr.toString();
  
    //   // if (notifyTenant.toLowerCase() === "yes") {
    //   await taskSendMail(
    //     tenantName,
    //     "Property Maintenance: " + taskName,
    //     dueDate,
    //     landlordName,
    //     taskName,
    //     vendorNames,
    //     priority,
    //     CompanyName,
    //     landlordContact,
    //     userId,
    //     tenantEmail,
    //     taskEmail
    //   );
    //   // }
    //   // if (notifyVendor.toLowerCase() === "yes") {
    //   for (let i = 0; i < vendorEmailarr.length > 0; i++) {
    //     console.log("vendor2");
    //     await taskSendMail(
    //       tenantName,
    //       "Property Maintenance: " + taskName,
    //       dueDate,
    //       landlordName,
    //       taskName,
    //       vendorNames,
    //       priority,
    //       CompanyName,
    //       landlordContact,
    //       userId,
    //       vendorEmailarr[i],
    //       taskEmail
    //     );
    //     // }
    //   }
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
  