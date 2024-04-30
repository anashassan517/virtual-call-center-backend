
const jwt = require("jsonwebtoken");
const { queryRunner } = require("../helper/queryRunner");
const { selectQuery, userPermissionProtected, userPermissionAuth, countTenantQuery, adminPermissionQuery } = require("../constants/queries");
// const { decryptJwtToken } = require("../helper/EnccryptDecryptToken");
const config = process.env;
const verifyToken = async (req, res, next) => {
try{
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).send("Access Denied");
  }
  const decoded = jwt.verify(token, config.JWT_SECRET);
  req.user = decoded;
  next();

}catch(err){
  console.log(err);
  return res.status(400).json({
    message: "Invalid Token",
    error: err.message
  });
}}

// sssssssssssssssssssssssssssssssss
const verifyTokenTenant = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  // if (!token) {
  //   return res.status(401).send("Access Denied");
  // }
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET_KEY);
    const result = await queryRunner(selectQuery("tenants", "id"), [
      decoded.id,
    ]);

    req.user = {
      email: decoded.email,
      userId: result[0][0].id,
      userType: "Tenant",
      userName: result[0][0].firstName + " " + result[0][0].lastName,
      landlordID: result[0][0].landlordID,
      propertyID: result[0][0].propertyID,
      firstName: result[0][0].firstName,
      lastName: result[0][0].lastName,
      phoneNumber: result[0][0].phoneNumber,
      city: result[0][0].city,
      state: result[0][0].state,
      zipCode: result[0][0].zipcode,
      state: result[0][0].state,
      address: result[0][0].Address,
      state: result[0][0].state,
      image: result[0][0].image,
      imageKey: result[0][0].imageKey,
      businessName: result[0][0].companyName,
      auth: result[0][0].auth
    };
    next();
  } catch (err) {
    console.error(err);

    return res.status(400).json({
      message: "Invalid Token",
      role: "Tenant",
      error: err.message
    });
  }
};



const verifySuperAdmin = async (req, res, next) => {
  const token = req?.headers?.authorization.split(" ")[1];
  // if (!token) {
  //   return res.status(401).send("Access Denied");
  // }
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
    const decoded = jwt.verify(token, config.JWT_SECRET_KEY);
    const result = await queryRunner(selectQuery("superAdmin", "id"), [decoded.id]);





    const selectResult = await queryRunner(adminPermissionQuery, [result[0][0].id]);
    let dataArray = [];
    if (selectResult[0].length > 0) {
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

    }




    req.user = {
      email: result[0][0].email,
      userId: result[0][0].id,
      userName: result[0][0].fName + " " + result[0][0].lName,
      firstName: result[0][0].fName,
      lastName: result[0][0].lName,
      AdminCreatedDate: result[0][0].created_at,
      phone: result[0][0].phone,
      image: result[0][0].images,
      imageKey: result[0][0].imageKey,
      address: result[0][0].address,
      city: result[0][0].city,
      state: result[0][0].state,
      zipCode: result[0][0].zipcode,
      userRole: result[0][0].roleId,
      userPeremission: dataArray
    };
    next();
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      message: "Invalid Token",
      role: "Admin",
      error: err.message
    });
  }
};
module.exports = {
  verifyToken,
  verifyTokenTenant,
  verifySuperAdmin
};
