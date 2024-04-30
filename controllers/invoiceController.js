const user = require("../models/user");
const sendMail = require("../sendmail/sendmail.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fs = require("fs");
const Path = require("path");
const imageToDelete = require("./../middleware/deleteImage.js");
const { serialize } = require("cookie");
const {
  selectQuery,
  deleteQuery,
  insertInvoice,
  insertLineItems,
  insertInvoiceImage,
  updateInvoiceStatus,
  getAllInvoicesquery,
  getByIdInvoicesQuery,
  updateInvoice,
  resendEmailQuery,
  createInvoiceCategories,
  delteImageForInvoiceImages,
  updateInvoiceCategories,
  getAmountByCategoriesID,
  deleteInvoiceCategories,
  deleteVendorCategories,
  invoiceAmountQuery,
  invoiceIdUpdate,
  invoiceCount,
  checkInvoiceId
} = require("../constants/queries");
const { hashedPassword } = require("../helper/hash");
const { queryRunner } = require("../helper/queryRunner");
const { deleteImageFromS3 } = require("../helper/S3Bucket");
const config = process.env;

//  ############################# Create Invoice Start ############################################################

exports.createInvoice = async (req, res) => {
  const {
    tenantID,
    invoiceType,
    startDate,
    endDate,
    frequency,
    dueDate,
    dueDays,
    repeatTerms,
    terms,
    additionalNotes,
    lineItems,
    sendmails,
    totalAmount,
    images,
    invoiceId,
  } = req.body;
  console.log(invoiceId)
  try {
    const { userId,userName,businessName,invoiceEmail } = req.user;
    // const { userId,userName,businessName,invoiceEmail } = req.body;
    const currentDate = new Date();
    const notify = 0;
    const invoiceResult = await queryRunner(insertInvoice, [userId, tenantID, invoiceType, startDate, endDate, frequency, dueDate, dueDays, repeatTerms, terms, additionalNotes, "Unpaid", currentDate, totalAmount,notify, startDate,invoiceId]);
    if (invoiceResult.affectedRows === 0) {
      res.status(400).send("Error occur in creating invoice");
    } else {
      // select tenants
      const invoiceID = invoiceResult[0].insertId;
      // const invoiceCountIdResult = await queryRunner(invoiceCount, [userId]);
      // let customInvoiceId = invoiceCountIdResult[0][0].count + 1;
      // customInvoiceId = "Invoice"+customInvoiceId;
      // const invoiceIdUpdateResult = await queryRunner(invoiceIdUpdate ,[customInvoiceId, invoiceID]);
      const selectTenantsResult = await queryRunner(
        selectQuery("tenants", "id"),
        [tenantID]
      );
      if (selectTenantsResult[0].length > 0) {
        const TenantEmail = selectTenantsResult[0][0].email;
        const propertyID = selectTenantsResult[0][0].propertyID;
        const TenantName = selectTenantsResult[0][0].firstName + " " + selectTenantsResult[0][0].lastName;
        // send mail to tenant from landlord company
        const mailSubject = "invoice From " + userName;
        const businessNames = businessName || "N/A";
        const selectpropertyResult = await queryRunner(
          selectQuery("property", "id"),
          [propertyID]
        );
        const propertyAddress = selectpropertyResult[0][0].address;

        sendMail.invoiceSendMail(
          TenantName,
          propertyAddress,
          dueDate,
          terms,
          additionalNotes,
          lineItems,
          totalAmount,
          mailSubject,
          TenantEmail,
          invoiceEmail,
          userId
        //// dueDate,
        //// invoiceID,
          //// userName,
          //// userId,
          //// businessNames,
          //// invoiceEmail
        );
      }

      if (lineItems) {
        // console.log(lineItems);
        for (let i = 0; i < lineItems.length; i++) {
          if (Object.keys(lineItems[i]).length >= 1) {
            const category = lineItems[i].category;
            // console.log(category);
            const memo = lineItems[i].memo;
            const amount = lineItems[i].amount;
            const lineItemTax = lineItems[i].tax;
            // console.log(invoiceID, category, memo, amount, lineItemTax);

            const invoiceLineItemsResult = await queryRunner(insertLineItems, [invoiceID, category, memo, amount, lineItemTax])
            if (invoiceLineItemsResult.affectedRows === 0) {
              res.send('Error2 in line item invoice');
              return;
            }
          }
        }
      }
      if (images) {
        for (let i = 0; i < images.length; i++) {
          const { image_url } = images[i];
          const { image_key } = images[i];
          const propertyImageResult = await queryRunner(insertInvoiceImage, [
            invoiceID,
            image_url,
            image_key,
          ]);
          // if property image data not inserted into property image table then throw error
          if (propertyImageResult.affectedRows === 0) {
            throw new Error("data doesn't inserted in property image table");
          }
        }
      }
      // if (req.files) {
      //   const fileNames = req.files.map((file) => file.filename);
      //   for (let i = 0; i < fileNames.length; i++) {
      //     const img = fileNames[i];
      //     const invoiceImageResult = await queryRunner(insertInvoiceImage, [invoiceID, img])
      //     if (invoiceImageResult.affectedRows === 0) {
      //       res.send('Error3');
      //       return;
      //     }
      //   } //sss
      // }

      res.status(200).json({
        invoiceID : invoiceID,
        message: " Invoice created successful",
        invoiceId:invoiceID
      });
    }
  } catch (error) {
    // console.log(error);
    return res.status(400).json({ message: "Error", error: error.message });
  }
 };
//  ############################# Create Invoice END ############################################################

//  ############################# update Invoice Status Start ############################################################
exports.putInvoiceStatusUpdates = async (req, res) => {
  try {
    const { id, status, note } = req.body;
    // console.log(req)
    // const { userId } = req.user;
    const { userId } = req.user;
    // console.log(req.body,userId)
    const currentDate = new Date();
    const invoiceUpdateStatusResult = await queryRunner(updateInvoiceStatus, [
      status,
      note,
      currentDate,
      id,
      userId,
    ]);
    if (invoiceUpdateStatusResult[0].affectedRows > 0) {
      res.status(200).json({
        data: invoiceUpdateStatusResult,
        message: "Invoice status updated successful",
      });
    } else {
      res.status(400).json({
        message: "No data found",
      });
    }
  } catch (error) {
   return res.status(500).json({ message: "Error", error: error.message });
  }
};
//  ############################# update Invoice Status End ############################################################

//  ############################# View All Invoices Start ############################################################
exports.getAllInvoices = async (req, res) => {
  try {

    const { userId,businessLogo } = req.user;
    const getAllInvoicesResult = await queryRunner(getAllInvoicesquery, [
      userId,
    ]);
    if (getAllInvoicesResult[0].length > 0) {
      for (let i = 0; i < getAllInvoicesResult[0].length; i++) {
        const invoiceID = getAllInvoicesResult[0][i].invoiceID;
        const invoicelineitemsResult = await queryRunner(
          selectQuery("invoicelineitems", "invoiceID"),
          [invoiceID]
        );
        // console.log(invoicelineitemsResult[0])

        if (invoicelineitemsResult[0].length > 0) {
          const memo = invoicelineitemsResult[0].map((desc) => ({ memo: desc.memo, category: desc.category, amount: desc.amount, property: desc.property, tax: desc.tax }))
          getAllInvoicesResult[0][i].memo = memo
        } else {
          getAllInvoicesResult[0][i].memo = ["No memo"];
        }
        
        getAllInvoicesResult[0][i].businessLogo = businessLogo;
      }
      res.status(200).json({
        data: getAllInvoicesResult,
        message: "All Invoice successful",
      });
    } else {
      res.status(404).json({
        message: "No data found",
      });
    }
  } catch (error) {
   return res.status(500).json({ message: "Error in All Invoice", error: error.message });
  }
};
//  ############################# View All Invoice  End ############################################################

//  #############################Invoice By ID Start ############################################################
exports.getByIdInvoices = async (req, res) => {
  try {
    const { invoiceId } = req.body;
    const getAllInvoicesResult = await queryRunner(getByIdInvoicesQuery, [
      invoiceId,
    ]);
    if (getAllInvoicesResult[0].length > 0) {
      const invoicelineitemsResult = await queryRunner(
        selectQuery("invoicelineitems", "invoiceID"),
        [invoiceId]
      );
      if (invoicelineitemsResult[0].length > 0) {
        const memo = invoicelineitemsResult[0].map((desc) => ({
          category: desc.category,
          property: desc.property,
          memo: desc.memo,
          amount: desc.amount,
        }));
        // const memo = invoicelineitemsResult[0].map((desc)=> desc.memo )
        getAllInvoicesResult[0][0].memo = memo;
      } else {
        getAllInvoicesResult[0][0].memo = ["No memo"];
      }

      const invoiceImagesResult = await queryRunner(
        selectQuery("invoiceimages", "invoiceID"),
        [invoiceId]
      );
      if (invoiceImagesResult[0].length > 0) {
        const Image = invoiceImagesResult[0].map((img) => img.InvoiceImage);
        // const memo = invoicelineitemsResult[0].map((desc)=> desc.memo )
        getAllInvoicesResult[0][0].image = Image;
      } else {
        getAllInvoicesResult[0][0].image = ["No Image"];
      }
      res.status(200).json({
        data: getAllInvoicesResult,
        message: " Invoice By ID successful",
      });
    } else {
      res.status(400).json({
        message: "No data found",
      });
    }
  } catch (error) {
   return res.status(400).json({ message: "Error occur in Invoice by ID", error: error.message });
  }
};
//  ############################# Invoice By ID End ############################################################

//  ############################# Update Invoice Start ############################################################

exports.UpdateInvoice = async (req, res) => {
  const {
    tenantID,
    invoiceID,
    invoiceType,
    startDate,
    endDate,
    frequency,
    dueDate,
    dueDays,
    repeatTerms,
    terms,
    totalAmount,
    additionalNotes,
    lineItems,
    sendmails,
    existingImages,
    images,
  } = req.body;
  try {
    const { userId,userName,businessName,invoiceEmail } = req.user;
    // const { userId,userName,businessName,invoiceEmail } = req.body;
    // console.log(req.body)
    const currentDate = new Date();
    const invoiceUpdatedResult = await queryRunner(updateInvoice, [
      tenantID,
      invoiceType,
      startDate,
      endDate,
      frequency,
      dueDate,
      dueDays,
      repeatTerms,
      terms,
      totalAmount,
      additionalNotes,
      currentDate,
      invoiceID,
      userId,
    ]);
    const selectTenantsResult = await queryRunner(
      selectQuery("tenants", "id"),
      [tenantID]
    );
    // if select tenants result is not empty then send mail to tenant
    if (selectTenantsResult[0].length > 0) {
      const tenantEmail = selectTenantsResult[0][0].email;
      const propertyID = selectTenantsResult[0][0].propertyID;
      const tenantName =
        selectTenantsResult[0][0].firstName +
        " " +
        selectTenantsResult[0][0].lastName;

      const mailSubject = "invoice From " + userName;
      let businessNames = businessName || "N/A";
      const selectpropertyResult = await queryRunner(
        selectQuery("property", "id"),
        [propertyID]
      );
      const propertyAddress = selectpropertyResult[0][0].address;
      sendMail.invoiceSendMail(

        tenantName,
        propertyAddress,
        dueDate,
        terms,
        additionalNotes,
        lineItems,
        totalAmount,
        mailSubject,
       tenantEmail,
       invoiceEmail,
          userId
      );
    }
    //  if line items is not empty then delete line items and insert new line items
    if (lineItems) {
      // delete line items
      const deleteLineItemsResult = await queryRunner(
        deleteQuery("invoicelineitems", "invoiceID"),
        [invoiceID]
      );

      if (deleteLineItemsResult[0].affectedRows > 0) {
        for (let i = 0; i < lineItems.length; i++) {
          const category = lineItems[i].category;
          const property = lineItems[i].property;
          const memo = lineItems[i].memo;
          const tax = lineItems[i].tax;
          const amount = lineItems[i].amount;
          const lineItemTax = lineItems[i].tax;

          const invoiceLineItemsResult = await queryRunner(insertLineItems, [invoiceID, category, memo, amount,tax]);

          if (invoiceLineItemsResult.affectedRows === 0) {
            return res.send(
              "Error occurred while inserting invoice line items"
            );
          }
        }
      } else {
        return res.send("Error occurred while deleting invoice line items");
      }
    }
    let invoiceCheckResult;
    // console.log(images);
    invoiceCheckResult = await queryRunner(
      selectQuery("invoiceimages", "invoiceID"),
      [invoiceID]
    );
    if(images){
    if (images.length === invoiceCheckResult[0].length) {
      res.json({ message: "Invoice updated successfully" });
    } else if (images.length !== invoiceCheckResult[0].length) {
      // console.log(images, propertycheckresult[0])

      // Extract the image keys from propertycheckresult
      const propertyImageKeys = invoiceCheckResult[0].map(
        (image) => image.ImageKey
      );
      // console.log(invoiceCheckResult[0])
      // console.log(propertyImageKeys)
      // Find the images to delete from S3 (present in propertycheckresult but not in images)
      const imagesToDelete = invoiceCheckResult[0].filter(
        (image) => !images.some((img) => img.imageKey === image.ImageKey)
      );
      // console.log(imagesToDelete);
      // Delete images from S3
      for (let i = 0; i < imagesToDelete.length; i++) {
        await deleteImageFromS3(imagesToDelete[i].ImageKey);
        await queryRunner(delteImageForInvoiceImages, [
          imagesToDelete[i].ImageKey,
        ]);
      }
      // Find the images to insert into the database (present in images but not in propertycheckresult)
      const imagesToInsert = images.filter(
        (image) => !propertyImageKeys.includes(image.imageKey)
      );

      for (let i = 0; i < imagesToInsert.length; i++) {
        const { image_url, image_key, Image, imageKey } = imagesToInsert[i];
        const imageUrl = image_url || Image;
        const imageKeyVal = image_key || imageKey;

        const propertyImageResult = await queryRunner(insertInvoiceImage, [
          invoiceID,
          imageUrl,
          imageKeyVal,
        ]);
        // if property image data not inserted into property image table then throw error
        if (propertyImageResult.affectedRows === 0) {
          throw new Error("data doesn't inserted in property image table");
        }
      }

      return res.status(200).json({
        message: "Invoice updated successfully",
      });
    } 
    } else {
      res.json({ message: "Invoice updated successfully" });
    }

  } catch (error) {
    // console.log(error);
    return res.status(400).json({ message: "Error occurred while updating invoice", error: error.message });
  }
};
//  ############################# Update Invoice END ############################################################
//  ############################# Delete invoice Start ############################################################
exports.invoiceDelete = async (req, res) => {
  try {
    const { id } = req.body;
    const invoiceDeleteResult = await queryRunner(
      deleteQuery("invoice", "id"),
      [id]
    );
    if (invoiceDeleteResult[0].affectedRows > 0) {
      const invoiceImagecheckresult = await queryRunner(
        selectQuery("invoiceimages", "invoiceID"),
        [id]
      );
      if (invoiceImagecheckresult[0].length > 0) {
        // console.log("asdfghjk");
        invoiceImages = invoiceImagecheckresult[0].map(
          (image) => image.InvoiceImage
        );
        // delete folder images
        // imageToDelete(invoiceImages);
        // delete folder images
        const invoiceDeleteresult = await queryRunner(
          deleteQuery("invoiceimages", "invoiceID"),
          [id]
        );
      }
      const DeletelineItemsResult = await queryRunner(
        deleteQuery("invoicelineitems", "invoiceID"),
        [id]
      );
      res.status(200).json({
        message: " Invoice deleted successfully",
      });
    } else {
      res.status(400).json({
        message: "No data found",
      });
    }
  } catch (error) {
    return res.status(400).json({ message: "Error from delete invoice ", error: error.message });
    // console.log(error);
  }
};
//  ############################# Delete invoice End ############################################################

//  ############################# Create Invoice Start ############################################################
exports.resendEmail = async (req, res) => {
  const { invoiceID } = req.query;
  // const { invoiceID } = req.body;
  // console.log(invoiceID);
  const { userId,userName,businessName,invoiceEmail } = req.user;
  // const { userId,userName,businessName,invoiceEmail } = req.body;
  try {
    const resendEmailResult = await queryRunner(resendEmailQuery, [invoiceID]);

    if (resendEmailResult[0].length > 0) {
      const tenantEmail = resendEmailResult[0][0].email;
      const dueDate = resendEmailResult[0][0].dueDate;
      const terms = resendEmailResult[0][0].terms;
      const note = resendEmailResult[0][0].note;
      const totalAmount = resendEmailResult[0][0].totalAmount;
      // const invoiceId = resendEmailResult[0][0].invoiceId;
      // console.log("invoiceId");
      // console.log(invoiceId);
      const frequency = resendEmailResult[0][0].frequency;
      const tenantName =
        resendEmailResult[0][0].firstName +
        " " +
        resendEmailResult[0][0].lastName;
      const mailSubject = "Invoice From " + userName;
      var businessNames = businessName || "N/A";
      console.log(tenantName,businessNames,tenantEmail);
      const propertyID = resendEmailResult[0][0].propertyID;
      const selectpropertyResult = await queryRunner(
        selectQuery("property", "id"),
        [propertyID]
        );
        const propertyAddress = selectpropertyResult[0][0].address;
      const selectLineItemResult = await queryRunner(
        selectQuery("invoicelineitems", "invoiceID"),
        [invoiceID]
      );
      const lineItem = selectLineItemResult[0];
      
      sendMail.invoiceSendMail(
        tenantName,
        propertyAddress,
        dueDate,
        terms,
        note,
        lineItem,
        totalAmount,
        mailSubject,
        tenantEmail,
        invoiceEmail,
        userId
        // userId,
      );
    }
    res.status(200).json({
      message: " Resend Email successful",
    });
  } catch (error) {
    
    return res.status(400).json({ message: "Error Resend email ", error: error.message });
    
  }
};
//  ############################# Resend Email Invoice END ############################################################
// ############################# create invoice categories ############################################################
// exports.createInvoiceCategories = async (req, res) => {
//   try {
//     const { category } = req.body;
//     const { userId } = req.user;
//     const createInvoiceCategoriesResult = await queryRunner(createInvoiceCategories, [userId, category]);
//     if (createInvoiceCategoriesResult[0].affectedRows > 0) {
//       res.status(200).json({
//         message: "Invoice Categories created successfully"
//       });
//     } else {
//       res.status(400).json({
//         message: "No data found"
//       });
//     }
//   } catch (error) {
//     console.log(error)
//     res.send("Error from create invoice categories");
//   }
// };
exports.createInvoiceCategories = async (req, res) => {
  try {
    const data = req.body;
    
    // console.log(data)
    const { userId } = req.user;
    let createInvoiceCategoriesResult;
    const categoriesFromDb = await queryRunner(
      selectQuery("InvoiceCategories", "landLordId"),
      [userId]
    );
    for (const category of data) {
      const matchingCategory = categoriesFromDb[0].find((categoryFromDb) => {
        return category.categoryId == categoryFromDb.id;
      });

      if (matchingCategory) {
        const isDifferent = Object.keys(category).some((key) => {
          return category[key] !== matchingCategory[key];
        });

        if (isDifferent) {
          const updateInvoiceCategoriesResult = await queryRunner(
            updateInvoiceCategories,
            [
              category.categoryName,
              category.taxAmount,
              category.taxable,
              matchingCategory.id,
              userId,
            ]
          );

          console.log(`Updating row for category ${category.categoryName}`);
        } else {
          console.log(
            `No difference found for category ${category.categoryName}`
          );
        }
      } else {
        console.log(
          `Category ${category.categoryName} not found in the database`
        );
      }
    }
    const filteredCategories = data.filter((category) => {
      return !categoriesFromDb[0].some((categoryFromDb) => {
        return category.categoryId == categoryFromDb.id;
      });
    });
    for (let item of filteredCategories) {
      const { categoryName, taxable, taxAmount } = item;
      createInvoiceCategoriesResult = await queryRunner(
        createInvoiceCategories,
        [categoryName, userId, taxAmount, taxable]
      );
    }
    if (
      (filteredCategories.length >= 1 &&
        createInvoiceCategoriesResult[0].affectedRows > 0) ||
      filteredCategories.length == 0
    ) {
      const categoriesFromDb = await queryRunner(
        selectQuery("InvoiceCategories", "landLordId"),
        [userId]
      );
      res.status(200).json({
        data: categoriesFromDb[0],
      });
    } else {
      res.status(400).json({
        message: "No data found",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error from create invoice categories ", error: error.message });
  }
};
// ############################# create invoice categories ############################################################

// update categories text
exports.updateInvoiceCategories = async (req, res) => {
  try {
    const { setTaxes, catId, category } = req.body;
    const { userId } = req.user;
    const updateInvoiceCategoriesResult = await queryRunner(
      updateInvoiceCategories,
      [category, setTaxes, catId, userId]
    );
    if (updateInvoiceCategoriesResult[0].affectedRows > 0) {
      res.status(200).json({
        message: "Invoice Categories updated successfully",
      });
    } else {
      res.status(400).json({
        message: "No data found",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error ", error: error.message });
  }
};

exports.getInvoiceCategories = async (req, res) => {
  try {
    const { userId } = req.user;
    const invoiceImagecheckresult = await queryRunner(
      selectQuery("InvoiceCategories", "landLordId"),
      [userId]
    );
    if (invoiceImagecheckresult[0].length > 0) {
      res.status(200).json({
        data: invoiceImagecheckresult[0],
      });
    } else {
      res.status(400).json({
        message: "No data found",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error ", error: error.message });
  }
};
exports.getInvoiceCategoriesText = async (req, res) => {
  try {
    const { catId } = req.query;
    const { userId } = req.user;
    // getAmountByCategoriesID
    const invoiceImagecheckresult = await queryRunner(getAmountByCategoriesID, [
      catId,
      userId,
    ]);
    if (invoiceImagecheckresult[0].length > 0) {
      res.status(200).json({
        data: invoiceImagecheckresult[0][0],
      });
    }
  } catch(error) {
    return res.status(400).json({ message: "Error ", error: error.message });

  }
};
exports.deleteInCategories = async (req, res) => {
  try {
    const { catId } = req.body;
    const { userId } = req.user;
    const deleteInvoiceCategoriesResult = await queryRunner(
      deleteInvoiceCategories,
      [catId, userId]
    );
    if (deleteInvoiceCategoriesResult[0].affectedRows > 0) {
      res.status(200).json({
        message: "Invoice Categories deleted successfully",
      });
    } else {
      res.status(400).json({
        message: "No data found",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error ", error: error.message });
  }
};

exports.deleteVendCategories = async (req, res) => {
  try {
    const { catId } = req.body;
    // const { userId } = req.body;
    const { userId } = req.user;

    const VendorCategoryCheckResult = await queryRunner(
      selectQuery("vendor", "categoryID"),
      [catId]
    );
    if (VendorCategoryCheckResult[0].length > 0) {
      res.status(422).json({
        Message: `Unable To Delete this Category`,
        Reason: `This Category is assign to ${VendorCategoryCheckResult[0][0].firstName} ${VendorCategoryCheckResult[0][0].lastName}`,
      });
    } else {
    const deleteInvoiceCategoriesResult = await queryRunner(
      deleteVendorCategories,
      [catId, userId]
    );
    if (deleteInvoiceCategoriesResult[0].affectedRows > 0) {
      res.status(200).json({
        message: "Vendor Categories deleted successfully",
      });
    } else {
      res.status(404).json({
        message: "No data found",
      });
    }
  }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error ", error: error.message });

  }
};



// ####################################### Invoice Amount Count ################################################

exports.invoiceAmountCount = async (req, res) => {
  try {
    const { userId } = req.user; 
    const {start, end } = req.params; 
    const invoiceAmountResult = await queryRunner(invoiceAmountQuery ,[userId, start, end]);
    if(invoiceAmountResult[0].length > 0){
      res.status(200).json({
        data : invoiceAmountResult
      });
    }else{
      res.status(404).json({
        Message : "No data Fond"
      });
    }
      
    // }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }

}
// ####################################### Invoice Amount Count ################################################

// ####################################### Invoice ID ################################################

exports.InvoiceID = async (req, res) => {
  try {
    const {userId, idPattern} = req.user
    const tenantIdCheckresult = await queryRunner(checkInvoiceId, [userId]);
    console.log(userId,tenantIdCheckresult[0])
    let tenantId;
    if (tenantIdCheckresult[0].length > 0) {
      tenantId = tenantIdCheckresult[0][0]?.cInvoiceId?.split("-");
      let lastPart = parseInt(tenantId[tenantId?.length - 1], 10) + 1;
      lastPart = lastPart?.toString()?.padStart(4, '0');
      tenantId = `SR-${idPattern}-INVO-${lastPart}`;
      res.status(200).json({ message: "InvoiceId",ID : tenantId });  
    } else {
      tenantId = `SR-${idPattern}-INVO-0001`;
      res.status(200).json({ message: "InvoiceId",ID : tenantId });
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error", error: error.message });
  }
};


// ####################################### Invoice ID ################################################




