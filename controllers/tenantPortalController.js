const user = require("../models/user");
const { sendMail, taskSendMail } = require("../sendmail/sendmail");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const fs = require('fs');
const Path = require('path');
const imageToDelete = require('./../middleware/deleteImage.js')
const { serialize } = require('cookie');
const {
  selectQuery,
  deleteQuery,
  getAllInvoiceTenantQuery,
  AlltasksTenantsQuery,
  getTenantsById,
  getTenantTotalAmountUnpaid,
  getTenantTotalAmountPaid,
  getTenantTotalAmount,
  addTasksQuerytenant,
  insertInTaskImage,
  addVendorList,
  taskByIDQuery,
  unpaidAmountQuery,
  updateAuthQueryTenant,
  taskCountIdTenant,
  taskIdUpdate,
  checkTaskid
} = require("../constants/queries");
const { hashedPassword } = require("../helper/hash");
const { queryRunner } = require("../helper/queryRunner");
const { file } = require("googleapis/build/src/apis/file");
const config = process.env;

 




    //  ############################# View All Invoices Tenant Start ############################################################
    exports.getAllInvoicesTenant = async (req, res) => {
        try {
          // console.log("1");
        const {userId} = req.user;
        // const {userId,userName} = req.user;
        // console.log(userId,userName) 
          const getAllInvoicesResult = await queryRunner(getAllInvoiceTenantQuery, [userId]);
          // console.log(getAllInvoicesResult[0])
          // console.log("2");

          if (getAllInvoicesResult[0].length > 0) {
            for (let i = 0; i < getAllInvoicesResult[0].length; i++){
                const invoiceID = getAllInvoicesResult[0][i].invoiceID;
                const invoicelineitemsResult = await queryRunner(selectQuery("invoicelineitems", "invoiceID"), [invoiceID]);
                if (invoicelineitemsResult[0].length > 0) {
                    const memo = invoicelineitemsResult[0].map((desc)=>({memo:desc.memo, category:desc.category, amount:desc.amount,property:desc.property,tax:desc.tax}))
                    getAllInvoicesResult[0][i].memo = memo
                } else {
                    getAllInvoicesResult[0][i].memo = ["No memo"]
                }
            }
            res.status(200).json({
              data: getAllInvoicesResult,
              message: 'All Invoice get successful'
            })
          } else {
            res.status(404).json({
              message: 'No data found'
            })
          }
        } catch (error) {
          console.log(error)
          return res.status(500).json({ message: "Error in All Invoice", error: error.message });
        }
      }
      //  ############################# View All Invoice Tenant End ############################################################
    
    
      //  #############################Invoice By ID Start ############################################################
    //   getByIdInvoices from invoiceController file
      //  #############################Invoice By ID END  ############################################################


      //  ############################# Get ALL Task Start ############################################################
exports.getAllTaskTenant = async (req, res) => {
    // const { userId } = req.user;
    const { userId } = req.user;
    try {
      // get data from task table by landlordID
      const allTaskResult = await queryRunner(AlltasksTenantsQuery, [userId]);
      // if data found then\
      if (allTaskResult.length > 0) {
        // loop through all task result
        for (let i = 0; i < allTaskResult[0].length; i++) {
          // get task id from task table
          const taskID = allTaskResult[0][i].id;
          // get data from taskassignto table by taskID
          const assignToResult = await queryRunner(
            selectQuery("taskassignto", "taskId"),
            [taskID]
          );
          // if data found then get vendor id from taskassignto table
          const vendorIDs = assignToResult[0].map((vendor) => vendor.vendorId);
  
          const vendorData = [];
        //  loop through vendor id 
          for (let j = 0; j < vendorIDs.length; j++) {
            // get data from vendor table by vendor id
            const vendorResult = await queryRunner(
              selectQuery("vendor", "id"),
              [vendorIDs[j]]
            );
            // if data found then push data in vendorData array
            if (vendorResult[0].length > 0) {
              const vendor = {
                ID : vendorResult[0][0].id || "N/A",
                name: vendorResult[0][0].firstName + " "+ vendorResult[0][0].lastName || "N/A",
                email: vendorResult[0][0].email || "N/A",
                vendorPhone:vendorResult[0][0].phone || "N/A"
              };
              vendorData.push(vendor);
            }
          }
          // assign vendorData array to assignTo property of allTaskResult
          allTaskResult[0][i].AssignTo = vendorData;
        }
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
      console.log("Error:", error);
      return res.status(500).json({ message: "Error Get Tasks", error: error.message });
    }
  };


// get tenant dashboard data
exports.getTenantDashboardData = async (req, res) => {
  try {
    const { userId } = req.user;
    const totalAmount = await queryRunner(getTenantTotalAmount, [
      userId
    ]);
    const totalAmountUnpaid = await queryRunner(getTenantTotalAmountUnpaid, [
      userId
    ]);
    const totalAmountPaid = await queryRunner(getTenantTotalAmountPaid, [
      userId
    ]);
    res.status(200).json({
      totalAmount: totalAmount[0][0],
      totalAmountUnpaid: totalAmountUnpaid[0][0],
      totalAmountPaid: totalAmountPaid[0][0],
    })
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
}

  exports.getTenantByID = async (req, res) => {
    try {
      // con
      const { userId } = req.user;
      // const { userId } = req.body;
      console.log(userId)
      const TenantsByIDResult = await queryRunner(getTenantsById, [userId])
      if (TenantsByIDResult[0].length > 0) {
        const data = JSON.parse(JSON.stringify(TenantsByIDResult))
        // console.log(data[0][0])
        res.status(200).json({
          data: data[0][0],
          message: 'Tenants By ID'
        })
      } else {
        res.status(400).json({
          message: 'No data found'
        })
      }
    } catch (error) {
      return res.status(500).json({ message: "Error Get Tenants By ID", error: error.message });

      console.log(error)
    }
  }
  //  ############################# Get ALL Task End ############################################################

  //  #############################  ADD TASK Start HERE ##################################################
exports.addTasksTenant = async (req, res) => {
  const {
    task,
    status,
    priority,
    note,
    notifyLandlord,
    images,
    
  } = req.body;

  // const { userId, userName, landlordID,phoneNumber, email } = req.user;
  const { userId, userName, landlordID,phoneNumber, email } = req.user;
  const currentDate = new Date();
  
  try {
    // console.log(1);
    const addTasksCheckResult = await queryRunner(
      selectQuery("task", "taskName", "tenantID"),
      [task, userId]
    );
    if (addTasksCheckResult[0].length > 0) {
      return res.send("Task already exists");
    } else {
      // ######################### task ID ################################
      const result = await queryRunner(
        selectQuery("users", "id"),
        [landlordID]
        );
        let idPattern;
        if (result[0][0].BusinessName !== null && result[0][0].BusinessName !== "") {
        idPattern = result[0][0].BusinessName.substring(0, 3).toUpperCase();
      } else {
        idPattern =
        (result[0][0].FirstName.substring(0, 2) || "").toUpperCase() +
        (result[0][0].LastName.substring(0, 1) || "").toUpperCase();
      }
      const taskIdCheckresult = await queryRunner(checkTaskid, [landlordID]);
      let taskId;
      if (taskIdCheckresult[0].length > 0) {
        taskId = taskIdCheckresult[0][0].cTaskId.split("-");
        let lastPart = parseInt(taskId[taskId.length - 1], 10) + 1;
        lastPart = lastPart.toString().padStart(4, '0');
        taskId = `SR-${idPattern}-TMREQ-${lastPart}`;
      } else {
        
        taskId = `SR-${idPattern}-TMREQ-0001`;
      }
      // const tenantTaskID=taskId;
      // console.log(tenantTaskID)
      // ######################### task ID ################################
      const TasksResult = await queryRunner(addTasksQuerytenant, [
        task,
        userId,
        "Not Set",
        status,
        priority,
        note,
        notifyLandlord,
        currentDate,
        "Tenant",
        landlordID,
        taskId
      ]);
      if (TasksResult.affectedRows === 0) {
        return res.status(400).send("Error1");
      }
      // else {
      const tasksID = TasksResult[0].insertId;
      const taskCountIdResult = await queryRunner(taskCountIdTenant , [userId]);
      let customTaskId = taskCountIdResult[0][0].count + 1;
      customTaskId = task+customTaskId;
      // const taskIdUpdateResult = await queryRunner(taskIdUpdate ,[customTaskId, tasksID]);
      if(images){ 
      for (let i = 0; i < images.length; i++) {
        const { image_url } = images[i];
        const { image_key } = images[i];
        const propertyImageResult = await queryRunner(insertInTaskImage, [
          tasksID,
          image_url,
          image_key
        ]);
        if (propertyImageResult.affectedRows === 0) {
          throw new Error("data doesn't inserted in property image table");
        }
      }
      }
      //   //  add vendor
        const Vendorid = "Not Assigned";
        const vendorResults = await queryRunner(addVendorList, [
          tasksID,
          Vendorid,
        ]);
        if (vendorResults.affectedRows === 0) {
          return res.send("Error2");
        }
        const landlordCheckResult = await queryRunner(selectQuery("users", "id"),[landlordID]);
      const landlordName = landlordCheckResult[0][0].FirstName + " " + landlordCheckResult[0][0].LastName;
      const landlordEmail = landlordCheckResult[0][0].Email;
      const CompanyName = landlordCheckResult[0][0].BusinessName || "N/A";
      const taskEmail = landlordCheckResult[0][0].taskEmail;
      
      if (notifyLandlord.toLowerCase() === "yes") {
        await taskSendMail(
          landlordName,
          "Property Maintenance: " + task,
          "Not Set",
          userName,
          task,
          "Not Assigned",
          priority,
          CompanyName,
          phoneNumber,
          userId,
          landlordEmail,
          taskEmail
        );
      }
    }
    return res.send("Task Created Successfully");
  } catch (error) {
    return res.status(500).json({ message: "Error in creating a task", error: error.message });

  }
};
//  #############################  ADD TASK ENDS HERE ##################################################

//  ############################# Task By ID Tenant Start ############################################################
exports.taskByIDTenant = async (req, res) => {
  // const { Id } = req.body;
  const { Id } = req.user;
  try {
    const taskByIDResult = await queryRunner(taskByIDQuery, [Id]);
    if (taskByIDResult.length > 0) {
      const TaskImagesResult = await queryRunner(selectQuery("taskimages", "taskID"), [Id]);
      if (TaskImagesResult[0].length > 0) {
        const taskImages = TaskImagesResult[0].map((image) => image.Image);
        taskByIDResult[0][0].taskImages = taskImages;
      } else {
        taskByIDResult[0][0].taskImages = ["No Task Images Found"];
      }
      const TaskAssignToResult = await queryRunner(
        selectQuery("taskassignto", "taskId"),
        [Id]
      );
      if (TaskAssignToResult[0].length > 0) {
      const vendorIDs = TaskAssignToResult[0].map((vendorID) => vendorID.vendorId);
      const vendorData = [];
      for (let i = 0; i < vendorIDs.length; i++) {
        const vID = vendorIDs[i];
        const vendorResult = await queryRunner(
          selectQuery("vendor", "id"),
          [vID]
        );
        if (vendorResult[0].length > 0) {
          const categoryIDs = vendorResult[0][0].categoryID;
          const VendorCategoryResult = await queryRunner(
            selectQuery("vendorcategory", "id"),
            [categoryIDs]
          );
          if (VendorCategoryResult.length > 0) {
            const vendorDataObject = {
              name: vendorResult[0][0].firstName + " " + vendorResult[0][0].lastName,
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
      }else{
        taskByIDResult[0][0].vendor = ["No vendor data found"];
      }

      
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
    return res.status(500).json({ message: "Error Get Tasks", error: error.message });

  }
};

//  ############################# Task By ID Tenant End ############################################################



//  ############################# Profile Complete Start ############################################################

exports.ProfileCompleteTenant = async (req, res) => {
  try {
    const { userId } = req.user;
    // const { userId } = req.body;
    const tenantCheckResult = await queryRunner(selectQuery("tenants", "id"), [
      userId,
    ]);
    if (tenantCheckResult[0].length > 0) {
      count = 0;
      if (tenantCheckResult[0][0].image) {
        count += 10;
      }
      if (tenantCheckResult[0][0].firstName) {
        count += 10;
      }
      if (tenantCheckResult[0][0].lastName) {
        count += 10;
      }
      if (tenantCheckResult[0][0].email) {
        count += 10;
      }
      if (tenantCheckResult[0][0].phoneNumber) {
        count += 10;
      }
      if (tenantCheckResult[0][0].companyName) {
        count += 10;
      }
      if (tenantCheckResult[0][0].Address) {
        count += 10;
      }
      // if (tenantCheckResult[0][0].BusinessAddress) {
      //   count += 10;
      // }
      if (tenantCheckResult[0][0].city) {
        count += 10;
      }
      if (tenantCheckResult[0][0].state) {
        count += 10;
      }
      if (tenantCheckResult[0][0].zipcode) {
        count += 10;
      }
      res.status(200).json({
        // data : propertycheckresult,
        count: count,
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
//  ############################# Profile Complete End ############################################################


//  ############################# unpaid Amount Tenant Start ############################################################

exports.unpaidAmountTenant = async (req, res) => {
  try {
    const { userId } = req.user;
    // const { userId } = req.body;
    const tenantAmountResult = await queryRunner(unpaidAmountQuery, [userId]);
    // console.log(tenantAmountResult)
    if (tenantAmountResult[0][0].length > 0) {
      res.status(200).json({
        message : "Tenant unpaid Invoice Amount",
        data : tenantAmountResult[0][0].totalAmount,
      });
    }else{
      res.status(404).json({
        message : "Tenant unpaid Invoice : All invoices Paid Not found"
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
//  ############################# unpaid Amount Tenant End ############################################################
exports.updateAuthTenant = async (req, res) => {
  try {
    const { auth } = req.body;
    const {userId} = req.user
    const updateAuth= await queryRunner(updateAuthQueryTenant, [auth,userId]);
    if(updateAuth[0].affectedRows>0){
      res.status(200).json({message:`2 Factor Authentication ${auth==0?"turned off":"turned on"}`})
    }else{
      res.status(422).json({message:"Error in updating 2 Factor Authentication"})
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({
      message: error.message,
    });
  }
};
exports.getInvoiceCategoriesTenant = async (req, res) => {
  try {
    const { landlordID } = req.user;
   
    const invoiceImagecheckresult = await queryRunner(
      selectQuery("InvoiceCategories", "landLordId"),
      [landlordID]
    );
    if (invoiceImagecheckresult[0].length > 0) {
      res.status(200).json({
        data: invoiceImagecheckresult[0],
      });
    } else {
      res.status(404).json({
        message: "No data found",
      });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error from create invoice categories", error: error.message });
  }
};