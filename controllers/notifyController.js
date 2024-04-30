const {
  selectQuery,
  getTenantNotify,
  getPropertyNotify,
  getTaskNotify,
  getInvoiceNotify,
  insertNotify,
  updateNotify,
  getTenantPropertyNotify,
  getTenantTaskNotify,
  getTenantInvoiceNotify,
  updatePropertyNotifyReadUnRead,
  updateTenantNotifyReadUnRead,
  updateTaskNotifyReadUnRead,
  updateUserTaskNotifyReadUnRead,
  updateInvoiceNotifyReadUnRead,
  updateAllNotifyReadQuery,
  updateTenantPropertyNotifyReadUnRead,
  updateTenantTaskNotifyReadUnRead,
  updateTenantInvoiceNotifyReadUnRead,
  updateAllTenantNotifyReadQuery,
  getUserTaskNotify
} = require("../constants/queries");
const { queryRunner } = require("../helper/queryRunner");

const notifyController = {
  updateNotifyData: async (req, res) => {
    const { isEmailNotify, isPushNotify, textNotification } = req.body;
    const { userId } = req.user;
    try {
      const getNotifyResult = await queryRunner(
        selectQuery("notification", "landlordID"),
        [userId]
      );
      if (getNotifyResult[0].length > 0) {
        // update notifTable
        const updateNotifyResult = await queryRunner(updateNotify, [
          isEmailNotify,
          isPushNotify,
          textNotification,
          userId,
        ]);
        if (updateNotifyResult[0].affectedRows > 0) {
          return res.status(200).json({
            email:
              isEmailNotify === "yes"
                ? "Email notifications enabled"
                : "Email notifications disabled",
            push:
              isPushNotify === "yes"
                ? "push notifications enabled"
                : "push notifications disabled",
          });
        }
      } else {
        // create notifTable and insert data
        const insertNotifyResult = await queryRunner(insertNotify, [
          userId,
          isEmailNotify,
          isPushNotify,
          textNotification,
        ]);
        if (insertNotifyResult[0].affectedRows > 0) {
          return res.status(200).json({
            email:
              isEmailNotify === "yes"
                ? "Email notifications enabled"
                : "Email notifications disabled",
            push:
              isPushNotify === "yes"
                ? "push notifications enabled"
                : "push notifications disabled",
          });
        }
      }
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  },
  getCheckedNotify: async (req, res) => {
    try {
      // find notifTable by userId
      const { userId } = req.user;
      const getNotifyResult = await queryRunner(
        selectQuery("notification", "landlordID"),
        [userId]
      );
      if (getNotifyResult[0].length > 0) {
        return res.status(200).json({
          email: getNotifyResult[0][0].emailNotification,
          push: getNotifyResult[0][0].pushNotification,
          text: getNotifyResult[0][0].textNotification,
        });
      }
      res.status(400).json({
        message: "No data found",
      });
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  },
  getNotify: async (req, res) => {
    //get property , tenants , task invoice from tables individually
    const { userId } = req.user;
    // const { userId } = req.body;
    try {
      // get data from property table
      const getTenantsNotify = await queryRunner(getTenantNotify, [userId]);
      const property = await queryRunner(getPropertyNotify, [userId]);
      // get data from task table
      const task = await queryRunner(getTaskNotify, [userId]);
      const user_task=await queryRunner(getUserTaskNotify,[userId]);
      // add all above steps on my video
      // get data from invoice table
      const invoice = await queryRunner(getInvoiceNotify, [userId]);
      res.status(200).json({
        tenantNotify: getTenantsNotify[0],
        propertyNotify: property[0],
        taskNotify: task[0],
        invoiceNotify: invoice[0],
        userTaskNotify: user_task[0],
      });
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  },
  getTenantNotify: async (req, res) => {
    //get property , tenants , task invoice from tables individually
    const { userId } = req.user;
    try {
      const property = await queryRunner(getTenantPropertyNotify, [userId]);
      // get data from task table
      const task = await queryRunner(getTenantTaskNotify, [userId]);
      // // get data from invoice table
      const invoice = await queryRunner(getTenantInvoiceNotify, [userId]);
      res.status(200).json({
        propertyNotify: property[0],
        taskNotify: task[0],
        invoiceNotify: invoice[0],
      });
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  },
  updateUserReadUnRead: async (req, res) => {
    try {
      const { notify, id, type } = req.body;
      const updateData = [notify, id];
      const updateFunctions = {
        property: updatePropertyNotifyReadUnRead,
        tenant: updateTenantNotifyReadUnRead,
        task: updateTaskNotifyReadUnRead,
        userTask: updateUserTaskNotifyReadUnRead,
        invoice: updateInvoiceNotifyReadUnRead,
      };
      const updateQueryFunction = updateFunctions[type];
      if (updateQueryFunction) {
        updateQueryReadUnRead(updateQueryFunction, updateData, res);
      } else {
        res.status(400).json({
          message: "Invalid type provided.",
        });
      }
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  },
  updateTenantReadUnRead: async (req, res) => {
    try {
      const { notify, id, type } = req.body;
      const updateData = [notify, id];
      const updateFunctions = {
        property: updateTenantPropertyNotifyReadUnRead,
        task: updateTenantTaskNotifyReadUnRead,
        invoice: updateTenantInvoiceNotifyReadUnRead,
      };
      const updateQueryFunction = updateFunctions[type];
      if (updateQueryFunction) {
        updateQueryReadUnRead(updateQueryFunction, updateData, res);
      } else {
        res.status(400).json({
          message: "Invalid type provided.",
        });
      }
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  },
updatetTenantAllReadNotify: async (req, res) => {
  try {
    const { userId } = req.user;
    const { notify , propertyID } = req.body;
    // console.log(req.body);
    const updateData = [notify, userId];

    const invoice = await queryRunner(
      updateAllTenantNotifyReadQuery.invoice,
      updateData
    );
    const property = await queryRunner(
      updateAllTenantNotifyReadQuery.property,
      [notify, propertyID]
    );
    const task = await queryRunner(updateAllTenantNotifyReadQuery.task, updateData);

    if (
      invoice[0].affectedRows ||
      property[0].affectedRows ||
      task[0].affectedRows 
    ) {
      res.status(200).json({
        message: "Updated Successfully!",
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
    }
  },
  updateUserAllReadNotify: async (req, res) => {
    try {
      const { userId } = req.user;
      const { notify } = req.body;
      const updateData = [notify, userId];

      const invoice = await queryRunner(
        updateAllNotifyReadQuery.invoice,
        updateData
      );
      const property = await queryRunner(
        updateAllNotifyReadQuery.property,
        updateData
      );
      const task = await queryRunner(updateAllNotifyReadQuery.task, updateData);
      const tenant = await queryRunner(
        updateAllNotifyReadQuery.tenants,
        updateData
      );
      if (
        invoice[0].affectedRows &&
        property[0].affectedRows &&
        task[0].affectedRows &&
        tenant[0].affectedRows
      ) {
        res.status(200).json({
          message: "Updated Successfully!",
        });
      }
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  },
};

module.exports = notifyController;

async function updateQueryReadUnRead(queryFun, updateData, res) {
  const updatedNotifyData = await queryRunner(queryFun, updateData);
  if (updatedNotifyData[0].affectedRows) {
    res.status(200).json({
      message: "Updated Successfully!",
    });
  } else {
    res.status(400).json({
      message: "Something went wrong!",
    });
  }
}
