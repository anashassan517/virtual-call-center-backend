const config = process.env;
const safecharge = require('safecharge');
const { request } = require('https'); // Use the built-in https module for HTTPS requests
const sha256 = require('js-sha256');
const utf8 = require('utf8');
const { query } = require('express');
// const { queryRunner } = require('./queryRunner');
const { selectQuery, updateUserBank, insertUserBankFuture,paymentACHQuery,paymentACHRequestQuery } = require('../constants/queries');
safecharge.initiate(config.merchantId, config.merchantSiteId, config.Secret_Key);
const { paymentMail } = require("../sendmail/sendmail");
const { queryRunner } = require('./queryRunner')
const { updateUser } = require("./../constants/queries")

// ############################ timestamp #################################
function getTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}
const timestamp = getTimestamp();
// ############################ timestamp #################################

exports.saveCard = async (req, res) => {
  const { currency, amount } = req.body;
  const apiUrl = config.APIKey;
  const requestData = {
    merchantId: config.merchantId,
    merchantSiteId: config.merchantSiteId,
    clientRequestId: config.clientRequestId,
    clientUniqueId: config.clientUniqueId,
    currency: currency,
    amount: amount,
    timeStamp: timestamp,
    checksum: sha256(config.merchantId + config.merchantSiteId + config.clientRequestId + amount + currency + timestamp + config.Secret_Key)

  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  };

  const reqq = request(apiUrl, requestOptions, (response) => {
    let responseData = '';
    response.on('data', (chunk) => {
      responseData += chunk;
    });
    response.on('end', () => {
      try {
        const data = JSON.parse(responseData);
        // console.log(data);
        res.status(200).json({
          // data
          sessionToken: data.sessionToken,
          clientUniqueId: data.clientUniqueId,
          merchantId: data.merchantId,
          merchantSiteId: data.merchantSiteId,
        })
      } catch (error) {
        console.error('Error parsing response:', error);
        res.status(400).json({
          message: "Error parsing response",
          error,
        })
      }
    });
  });
  reqq.on('error', (error) => {
    console.error('Error sending request:', error);
    res.status(400).json({
      message: "Error sending request",
      error,
    })
  });
  // Send the request body
  reqq.write(JSON.stringify(requestData));
  reqq.end();
};

exports.openOrder = async (req, res) => {
  console.log(req.body)
  const { currency, amount, userId } = req.body;
  const apiUrl = config.APIKey;
  const requestData = {
    merchantId: config.merchantId,
    merchantSiteId: config.merchantSiteId,
    clientRequestId: config.clientRequestId,
    clientUniqueId: config.clientUniqueId,
    currency: currency,
    amount: amount,
    transactionType: "Auth",
    userTokenId: userId,
    timeStamp: timestamp,
    checksum: sha256(config.merchantId + config.merchantSiteId + config.clientRequestId + amount + currency + timestamp + config.Secret_Key)
  };
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  };

  const reqq = request(apiUrl, requestOptions, (response) => {
    let responseData = '';
    response.on('data', (chunk) => {
      responseData += chunk;
    });
    response.on('end', () => {
      try {
        const data = JSON.parse(responseData);
        // console.log(data);
        res.status(200).json({
          // data
          sessionToken: data.sessionToken,
          clientUniqueId: data.clientUniqueId,
          merchantId: data.merchantId,
          merchantSiteId: data.merchantSiteId,
        })
      } catch (error) {
        console.error('Error parsing response:', error);
        res.status(400).json({
          message: "Error parsing response",
          error,
        })
      }
    });
  });
  reqq.on('error', (error) => {
    console.error('Error sending request:', error);
    res.status(400).json({
      message: "Error sending request",
      error,
    })
  });
  // Send the request body
  reqq.write(JSON.stringify(requestData));
  reqq.end();
};

// ###################################### CREATE USER #############################################################
exports.createUserPayment = async (req, res) => {
  const { userId, firstName, lastName, address, state, city, zip, countryCode, phone, locale, email, county } = req.body;
  const requestData = {
    // merchantId: "6400701569295268447",
    // merchantSiteId: "244298",
    // clientRequestId: "561ccf70-336b-11ee-a309-4f00ef0ed1ad",
    merchantId: config.merchantId,
    merchantSiteId: config.merchantSiteId,
    userTokenId: userId,
    clientRequestId: config.clientRequestId,
    firstName: firstName,
    lastName: lastName,
    address: address,
    state: state,
    city: city,
    zip: zip,
    countryCode: countryCode,
    phone: phone,
    locale: "en_US",
    email: email,
    // dateOfBirth: "01-01998",
    county: "USA",
    timeStamp: timestamp,
    checksum: sha256(config.merchantId + config.merchantSiteId + userId + config.clientRequestId + firstName + lastName + address + state + city + zip + countryCode + phone + "en_US" + email + "USA" + timestamp + config.Secret_Key),
    // checksum: sha256("6400701569295268447"+"244298"+"123"+"561ccf70-336b-11ee-a309-4f00ef0ed1ad"+"John"+ "Smith"+"US"+"john.smith@test.com"+timestamp+"xp8GrYWC6n9wHbxWuDwRPtAPICRLbBvvY2DuLYVRu8v5ip4GHPNymd0MA8KsEpbU"),
    // checksumConcatenation: config.merchantId+config.merchantSiteId+"123"+config.clientRequestId+"John"+ "Smith"+timestamp+config.Secret_Key 
  };
  // 90547429
  // Console checksum
  // console.log(requestData.checksumConcatenation);
  console.log(requestData.checksum);

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  };
  const reqq = request("https://ppp-test.nuvei.com/ppp/api/v1/createUser.do", requestOptions, (response) => {
    // const reqq = request("https://secure.safecharge.com/ppp/api/v1/createUser.do", requestOptions, (response) => {
    let responseData = '';
    response.on('data', (chunk) => {
      responseData += chunk;
    });
    response.on('end', () => {
      try {

        const data = JSON.parse(responseData);

        res.status(200).json({
          data
        })
      } catch (error) {
        console.error('Error parsing response:', error);
        res.status(400).json({
          message: "Error parsing response",
          error,
        })
      }
    });
  });
  reqq.on('error', (error) => {
    console.error('Error sending request:', error);
    res.status(400).json({
      message: "Error sending request",
      error,
    })
  });
  reqq.write(JSON.stringify(requestData));
  reqq.end();
};
// ###################################### CREATE USER #############################################################

// ###################################### Get USER Details #############################################################
exports.getUserDetailsPayment = async (req, res) => {
  const requestData = {
    merchantId: config.merchantId,
    merchantSiteId: config.merchantSiteId,
    userTokenId: "1234",
    clientRequestId: config.clientRequestId,
    timeStamp: timestamp,
    checksum: sha256(config.merchantId + config.merchantSiteId + "1234" + config.clientRequestId + timestamp + config.Secret_Key),
  };
  console.log(requestData.checksum);
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  };
  const reqq = request("https://ppp-test.nuvei.com/ppp/api/v1/getUserDetails.do", requestOptions, (response) => {
    // const reqq = request("https://secure.safecharge.com/ppp/api/v1/getUserDetails.do", requestOptions, (response) => {
    let responseData = '';
    response.on('data', (chunk) => {
      responseData += chunk;
    });
    response.on('end', () => {
      try {
        console.log(responseData);
        const data = JSON.parse(responseData);
        res.status(200).json({
          data
        })
      } catch (error) {
        console.error('Error parsing response:', error);
        res.status(400).json({
          message: "Error parsing response",
          error,
        })
      }
    });
  });
  reqq.on('error', (error) => {
    console.error('Error sending request:', error);
    res.status(400).json({
      message: "Error sending request",
      error,
    })
  });
  reqq.write(JSON.stringify(requestData));
  reqq.end();
};
// ###################################### Get USER Details #############################################################

// ###################################### Create Plan #############################################################
exports.createPlanPayment = async (req, res) => {
  const { name, initialAmount, recurringAmount, currency } = req.body;
  const requestData = {
    merchantId: config.merchantId,
    merchantSiteId: config.merchantSiteId,
    name: name,
    initialAmount: initialAmount,
    recurringAmount: recurringAmount,
    currency: currency,
    startAfter: {
      day: "0",
      month: "0",
      year: "0"
    },
    recurringPeriod: {
      day: "0",
      month: "1",
      year: "0"
    },
    // endAfter: {
    //     day: "0",
    //     month: "0",
    //     year: "0"
    // },
    timeStamp: timestamp,
    // clientRequestId: config.clientRequestId,
    // timeStamp: timestamp,
    checksum: sha256(config.merchantId + config.merchantSiteId + name + initialAmount + recurringAmount + currency + timestamp + config.Secret_Key),
  };
  // console.log(requestData.checksum);
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  };
  const reqq = request("https://ppp-test.nuvei.com/ppp/api/createPlan.do", requestOptions, (response) => {
    // const reqq = request("https://secure.safecharge.com/ppp/api/createPlan.do", requestOptions, (response) => {
    let responseData = '';
    response.on('data', (chunk) => {
      responseData += chunk;
    });
    response.on('end', () => {
      try {
        console.log(responseData);
        const data = JSON.parse(responseData);
        res.status(200).json({
          data
        })
      } catch (error) {
        console.error('Error parsing response:', error);
        res.status(400).json({
          message: "Error parsing response",
          error,
        })
      }
    });
  });
  reqq.on('error', (error) => {
    console.error('Error sending request:', error);
    res.status(400).json({
      message: "Error sending request",
      error,
    })
  });
  reqq.write(JSON.stringify(requestData));
  reqq.end();
};



exports.editPlanPayment = async (req, res) => {
  const { planId, initialAmount, recurringAmount, currency } = req.body;
  const requestData = {
    merchantId: config.merchantId,
    merchantSiteId: config.merchantSiteId,
    planId: planId,
    initialAmount: initialAmount,
    recurringAmount: recurringAmount,
    currency: currency,
    startAfter: {
      day: "0",
      month: "0",
      year: "0"
    },
    recurringPeriod: {
      day: "0",
      month: "1",
      year: "0"
    },
    // endAfter: {
    //     day: "0",
    //     month: "0",
    //     year: "0"
    // },
    timeStamp: timestamp,
    // clientRequestId: config.clientRequestId,
    // timeStamp: timestamp,
    checksum: sha256(config.merchantId + config.merchantSiteId + planId + initialAmount + recurringAmount + currency + timestamp + config.Secret_Key),
  };
  // console.log(requestData.checksum);
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  };
  // const reqq = request("https://ppp-test.nuvei.com/ppp/api/createPlan.do", requestOptions, (response) => {
  const reqq = request("https://ppp-test.nuvei.com/ppp/api/createPlan.do", requestOptions, (response) => {
    let responseData = '';
    response.on('data', (chunk) => {
      responseData += chunk;
    });
    response.on('end', () => {
      try {
        console.log(responseData);
        const data = JSON.parse(responseData);
        res.status(200).json({
          data
        })
      } catch (error) {
        console.error('Error parsing response:', error);
        res.status(400).json({
          message: "Error parsing response",
          error,
        })
      }
    });
  });
  reqq.on('error', (error) => {
    console.error('Error sending request:', error);
    res.status(400).json({
      message: "Error sending request",
      error,
    })
  });
  reqq.write(JSON.stringify(requestData));
  reqq.end();
};
// ###################################### Create Plan #############################################################

// ###################################### Create Subsription #############################################################
exports.createSubscriptionPayment = async (req, res) => {
  const { initialAmount, recurringAmount, currency, planId, userTokenId, upoId, userNuveiId } = req.body;
  const subscriptionDate = new Date();
  const requestData = {
    merchantId: config.merchantId,
    merchantSiteId: config.merchantSiteId,
    // planId: planId,
    userTokenId: userTokenId,
    userPaymentOptionId: upoId,
    initialAmount: initialAmount,
    recurringAmount: recurringAmount,
    currency: currency,
    startAfter: {
      day: "0",
      month: "0",
      year: "0"
    },


    timeStamp: timestamp,

    // checksum: sha256(config.merchantId+config.merchantSiteId+userTokenId+planId+upoId+initialAmount+recurringAmount+currency+timestamp+config.Secret_Key),
  };
  console.log(config.merchantId, config.merchantSiteId, userTokenId, planId, upoId, initialAmount, recurringAmount, currency, timestamp, config.Secret_Key)
  console.log(config.merchantId + config.merchantSiteId + userTokenId + planId + upoId + initialAmount + recurringAmount + currency + timestamp + config.Secret_Key);
  var correctPlanId;
  if (planId >= 8) {
    correctPlanId = planId / 4;
  } else {
    correctPlanId = planId;
  }
  const result = await queryRunner(selectQuery("plan", "id"), [
    correctPlanId
  ]);
  const { nuveiId, monthlyAnnual, planName } = result[0][0];
  console.log(monthlyAnnual)
  if (monthlyAnnual == "Monthly") {
    requestData.recurringAmount = initialAmount;
    requestData.recurringPeriod = {
      day: "0",
      month: "1",
      year: "0"
    }
    requestData.endAfter = {
      day: "0",
      month: "0",
      year: "20"
    }

  } else {
    requestData.initialAmount=initialAmount*12;
    requestData.recurringAmount = initialAmount*12;
    requestData.recurringPeriod = {
      day: "0",
      month: "0",
      year: "1"
    }
    requestData.endAfter = {
      day: "0",
      month: "0",
      year: "20"
    }
  }
  console.log(requestData)
  requestData.planId = nuveiId;
  requestData.checksum = sha256(config.merchantId + config.merchantSiteId + userTokenId + nuveiId + upoId + requestData.initialAmount + requestData.recurringAmount + currency + timestamp + config.Secret_Key)
  
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  };
  const reqq = request("https://ppp-test.nuvei.com/ppp/api/createSubscription.do", requestOptions, (response) => {
    // const reqq = request("https://secure.safecharge.com/ppp/api/createSubscription.do", requestOptions, (response) => {
    let responseData = '';
    response.on('data', (chunk) => {
      responseData += chunk;
    });
    response.on('end', async () => {
      try {
        console.log(responseData);

        const data = JSON.parse(responseData);
        const result = await queryRunner(updateUserBank, [
          userNuveiId,
          data.subscriptionId,
          subscriptionDate,
          userTokenId
        ]);

        const selectUserResult = await queryRunner(selectQuery('users', 'id'), [userTokenId]);
            const Name = selectUserResult[0][0].FirstName + " "+ selectUserResult[0][0].LastName;
            const email = selectUserResult[0][0].Email;
            const mailSubject = "Thank You for Subscribing to Spade Rent";
        paymentMail(Name,subscriptionDate,requestData.initialAmount,email,planName, mailSubject); 
        if (result[0].affectedRows == 1) {
          res.status(200).json({
            data,
          })
        }

      } catch (error) {
        console.error('Error parsing response:', error);
        res.status(400).json({
          message: "Error parsing response",
          error,
        })
      }
    });
  });

  reqq.on('error', (error) => {
    console.error('Error sending request:', error);
    res.status(400).json({
      message: "Error sending request",
      error,
    })
  });
  reqq.write(JSON.stringify(requestData));
  reqq.end();
};

// ###################################### Create Subsription #############################################################























// ###################################### Create Subsription Setting #############################################################
exports.createSubscriptionPaymentSetting = async (req, res) => {
 
  const {
    initialAmount,
    recurringAmount,
    currency,
    planId,
    userTokenId,
    upoId,
    userNuveiId,
    userId,
    existPlanAmount
  } = req.body;
  const subscriptionDate = new Date();
  const requestData = {
    merchantId: config.merchantId,
    merchantSiteId: config.merchantSiteId,
    userTokenId: userTokenId,
    userPaymentOptionId: upoId,
    initialAmount: initialAmount,
    recurringAmount: recurringAmount,
    currency: currency,
    startAfter: {
      day: "0",
      month: "0",
      year: "0"
    },
    timeStamp: timestamp,
  };

// Format the subscriptionCreatedDate as "YYYY-MM-DD HH:MM:SS"
function formatDateForSQL(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
const currentDate = new Date();
function dayDifference(datee) {
const timeDifference = currentDate.getTime() - datee.getTime();
let daysDiff = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
return daysDiff;
}
  var correctPlanId;
  if (planId >= 8) {
    correctPlanId = planId / 4;
  } else {
    correctPlanId = planId;
  }
  const result = await queryRunner(selectQuery("plan", "id"), [correctPlanId]);
  const { nuveiId, monthlyAnnual, plantotalAmount, planName } = result[0][0];
  // Additional code block (if userId is defined)
  const UserResult = await queryRunner(selectQuery("users", "id"), [userTokenId]);
  console.log(UserResult[0][0])
  const { subscriptionCreated_at, PlanID } = UserResult[0][0];
  console.log("PlanID : ", PlanID);
  const currentPlanResult = await queryRunner(selectQuery("plan", "id"), [PlanID]);
  console.log(currentPlanResult[0][0])
  const { monthlyAnnual : currentPlanMonthlyAnnual } = currentPlanResult[0][0];



  // Move Annually to Monthly
// if(planId > PlanID && currentPlanMonthlyAnnual != monthlyAnnual){
//   return res.status(200).json({
//     Message : "unable to downgrade",
//     Reason : "you want to switch Annually to monthly kindly contact to support team"
//   });
// }


  // Annually Downgrade
  if (planId < PlanID && monthlyAnnual == "Annually" && PlanID >= 2 && PlanID <= 4 ){
    return res.status(403).json({
      Message : "unable to downgrade",
      Reason : "you want to switch Annually Upgrade to downgrade kindly contact to support team"
    });
  }
  // Monthly
  let daysDifference;
  if (monthlyAnnual == "Monthly") {
    console.log(UserResult[0][0]);
    const subscriptionDate = new Date();
    const currentDate = {
      day: subscriptionDate.getDate(),
      month: subscriptionDate.getMonth() + 1,
      year: subscriptionDate.getFullYear(),
    };
    const createdDate = {
      day: subscriptionCreated_at.getDate(),
      month: subscriptionCreated_at.getMonth() + 1,
      year: subscriptionCreated_at.getFullYear(),
    };

    // Calculate the difference in days
    daysDifference = (subscriptionDate - subscriptionCreated_at) / (1000 * 60 * 60 * 24);
    // daysDifference = dayDifference(subscriptionCreated_at);
    daysDifference = Math.max(0, Math.round(daysDifference));

    // Calculate the difference in months
    let monthsDifference = (currentDate.year - createdDate.year) * 12 + (currentDate.month - createdDate.month);
    monthsDifference = Math.max(0, monthsDifference);

    // Calculate the difference in years
    let yearsDifference = currentDate.year - createdDate.year;
    yearsDifference = Math.max(0, yearsDifference);
    // Monthly Upgrade
    if (
      currentDate.month == createdDate.month &&
      currentDate.year == createdDate.year &&
      planId > PlanID &&
      monthlyAnnual == "Monthly"
    ) {
      // console.log("Monthly if in")
      let remainingDays = daysDifference;
      // console.log(remainingDays)
      remainingDays = 30 - remainingDays;
      // console.log(remainingDays)
      let initialAmountChange = existPlanAmount / 30;
      // console.log(initialAmountChange)
      initialAmountChange = remainingDays * initialAmountChange;
      // console.log(initialAmountChange)
      // console.log(requestData.initialAmount)
      initialAmountChange = requestData.initialAmount - initialAmountChange;
      // console.log(initialAmountChange)
      requestData.initialAmount = initialAmountChange;
    }
  }
  // let daysDifferenceAnnually;
  if (planId < PlanID && monthlyAnnual == "Annually") {
 
const currentDate = new Date();
const timeDifference = currentDate.getTime() - subscriptionCreated_at.getTime();
daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
const monthsDifference = (currentDate.getMonth() + 1) - (subscriptionCreated_at.getMonth() + 1) + (currentDate.getFullYear() - subscriptionCreated_at.getFullYear()) * 12;
//
      let remainingDays = daysDifference;
      remainingDays = 365 - remainingDays;
      let initialAmountChange = existPlanAmount / 365;
      initialAmountChange = remainingDays * initialAmountChange;
      initialAmountChange = requestData.initialAmount - initialAmountChange;
      requestData.initialAmount = initialAmountChange;
  }

  if (monthlyAnnual == "Monthly") {
    // requestData.recurringAmount = initialAmount;
    requestData.recurringPeriod = {
      day: "0",
      month: "1",
      year: "0"
    };
    requestData.endAfter = {
      day: "0",
      month: "0",
      year: "20"
    };
  } else {
    requestData.recurringPeriod = {
      day: "0",
      month: "0",
      year: "1"
    };
    requestData.endAfter = {
      day: "0",
      month: "0",
      year: "20"
    };
  }
  // Monthly Downgrade 
  if (planId < UserResult[0][0].PlanID && monthlyAnnual == "Monthly") {
    let AddDays = 30 - daysDifference;
    subscriptionDate.setDate(subscriptionDate.getDate() + AddDays);
  
    requestData.startAfter = {
      day: AddDays,
      month: "0",
      year: "0"
    };
    requestData.recurringPeriod = {
      day: AddDays,
      month: "0",
      year: "0"
    };
    requestData.endAfter = {
      day: "0",
      month: "0",
      year: "20"
    };
  }
// Move Monthly to Annually
let daysDifferenceMtoA; 
if(planId < PlanID && currentPlanMonthlyAnnual == "Monthly" && monthlyAnnual == "Annually" && PlanID >= 5 && PlanID <= 7 && planId >= 2 && planId <= 4 ){
  const currentDate = new Date();
const timeDifference = currentDate.getTime() - subscriptionCreated_at.getTime();
daysDifferenceMtoA = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  daysDifferenceMtoA = Math.max(0, Math.round(daysDifferenceMtoA));
  let remainingDays = 30 - daysDifferenceMtoA;
  subscriptionDate.setDate(subscriptionDate.getDate() + remainingDays); 
  requestData.startAfter = {
    day: remainingDays,
    month: "0",
    year: "0"
  };
  requestData.recurringPeriod = {
    day: remainingDays,
    month: "1",
    year: "0"
  };
  requestData.endAfter = {
    day: "0",
      month: "0",
      year: "20"
  };
}
if(planId > PlanID && PlanID==1){
  
    requestData.initialAmount = initialAmount;
  
}
  console.log("requestData.endAfter : ", requestData.startAfter);
  requestData.planId = nuveiId;
  console.log(requestData);
  requestData.checksum = sha256(
    config.merchantId +
    config.merchantSiteId +
    userTokenId +
    nuveiId +
    upoId +
    (Math.round(requestData.initialAmount * 10) / 10) +
    requestData.recurringAmount +
    currency +
    timestamp +
    config.Secret_Key
  );


  requestData.initialAmount = Math.round(requestData.initialAmount * 10) / 10;
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };
  console.log("responseData");
  const reqq = request(
    "https://ppp-test.nuvei.com/ppp/api/createSubscription.do",
    requestOptions,
    (response) => {
      let responseData = "";
      response.on("data", (chunk) => {
        responseData += chunk;
      });
      response.on("end", async () => {
        try {
          console.log(planId + " " + UserResult[0][0].PlanID);
          const data = JSON.parse(responseData);
          console.log(data);
          // if (planId < UserResult[0][0].PlanID && monthlyAnnual == "Monthly" || monthlyAnnual == "Annually") {
            const selectUserResult = await queryRunner(selectQuery('users', 'id'), [userTokenId]);
            const Name = selectUserResult[0][0].FirstName + " "+ selectUserResult[0][0].LastName;
            const email = selectUserResult[0][0].Email;
            const mailSubject = "Thank You for Subscribing to Spade Rent";
            if (
              planId < UserResult[0][0].PlanID || planId < PlanID
              //  && currentPlanMonthlyAnnual !== monthlyAnnual
            ) {
              const subscriptionDate = new Date();
              let subscriptionCreatedDateFormatted;
            
              // Get user data

                AddDays = 30 - daysDifference;
                subscriptionDate.setDate(subscriptionDate.getDate() + AddDays);
                subscriptionCreatedDateFormatted = formatDateForSQL(subscriptionDate);
            
              const result = await queryRunner(insertUserBankFuture, [
                userTokenId,
                userNuveiId,
                planId,
                data.subscriptionId,
                userTokenId,
                subscriptionCreatedDateFormatted,
              ]);
            
              paymentMail(Name, subscriptionCreatedDateFormatted, requestData.initialAmount, email,planName , mailSubject);
            
              if (result[0].affectedRows === 1) {
                res.status(200).json({
                  data,
                });
              }
            }
            
           // For Yearly
          else {
            const subscriptionDateQuery = new Date();
            // console.log(userNuveiId + " " + data.subscriptionId + " " + subscriptionDate + " " + userTokenId);
            const result = await queryRunner(updateUserBank, [userNuveiId, data.subscriptionId, subscriptionDateQuery, userTokenId]);
            paymentMail(Name,subscriptionDateQuery,requestData.initialAmount,email,planName, mailSubject); 
            if (result[0].affectedRows == 1) {
              res.status(200).json({
                data,
              });
            }
          }
          //
        } catch (error) {
          console.error("Error parsing response:", error);
          res.status(400).json({
            message: "Error parsing response",
            error,
          });
        }
      });
    }
  );
  reqq.on("error", (error) => {
    console.error("Error sending request:", error);
    res.status(400).json({
      message: "Error sending request",
      error,
    });
  });
  reqq.write(JSON.stringify(requestData));
  reqq.end();
};
// ###################################### Create Subsription #############################################################


// ###################################### Cancel Subscription #############################################################
exports.cancelSubscription = async (req, res) => {
  const { subscriptionId } = req.body;
  const requestData = {
    subscriptionId: subscriptionId,
    merchantId: config.merchantId,
    merchantSiteId: config.merchantSiteId,
    timeStamp: timestamp,
    checksum: sha256(config.merchantId + config.merchantSiteId + subscriptionId + timestamp + config.Secret_Key),
  };
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  };
  const reqq = request("https://ppp-test.nuvei.com/ppp/api/cancelSubscription.do", requestOptions, (response) => {
    // const reqq = request("https://secure.safecharge.com/ppp/api/cancelSubscription.do", requestOptions, (response) => {
    let responseData = '';
    response.on('data', (chunk) => {
      responseData += chunk;
    });
    response.on('end', () => {
      try {
        console.log(responseData);
        const data = JSON.parse(responseData);
        res.status(200).json({
          data
        })
      } catch (error) {
        console.error('Error parsing response:', error);
        res.status(400).json({
          message: "Error parsing response",
          error,
        })
      }
    });
  });
  reqq.on('error', (error) => {
    console.error('Error sending request:', error);
    res.status(400).json({
      message: "Error sending request",
      error,
    })
  });
  reqq.write(JSON.stringify(requestData));
  reqq.end();
};
// ###################################### Cancel Subscription #############################################################



// ###################################### Payment 2 Payment #############################################################
exports.Payment2Payment = async (req, res) => {
  const { sessionToken, amount, currency, senderDetails, recipientDetails } = req.body;
  console.log(req.body)
  const requestData = {
    sessionToken: sessionToken,
    merchantId: config.merchantId,
    merchantSiteId: config.merchantSiteId,
    clientRequestId: config.clientRequestId,
    amount: amount,
    currency: currency,
    clientUniqueId: config.clientUniqueId,
    senderDetails: senderDetails,
    recipientDetails: recipientDetails,
    timeStamp: timestamp,
    checksum: sha256(config.merchantId + config.merchantSiteId + config.clientRequestId + amount + currency + timestamp + config.Secret_Key),
  }
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  };
  const reqq = request("https://ppp-test.nuvei.com/ppp/api/v1/p2pPayment.do", requestOptions, (response) => {
    let responseData = '';
    response.on('data', (chunk) => {
      responseData += chunk;
    });
    response.on('end', () => {
      try {
        console.log(responseData);
        const data = JSON.parse(responseData);
        res.status(200).json({
          data
        })
      } catch (error) {
        console.error('Error parsing response:', error);
        res.status(400).json({
          message: "Error parsing response",
          error,
        })
      }
    });
  });
  reqq.on('error', (error) => {
    console.error('Error sending request:', error);
    res.status(400).json({
      message: "Error sending request",
      error,
    })
  });
  reqq.write(JSON.stringify(requestData));
  reqq.end();
};
// ###################################### Payment 2 Payment #############################################################













// ###################################### Payment 2 Payment #############################################################
exports.paymentACHVerification = async (req, res) => {
  const { ppp_status, ppp_TransactionID, TransactionId, userid, merchant_unique_id,email, totalAmount, currency, Status } = req.body;
  console.log("req.body");
  console.log(req.body);
  console.log("req.query")
  console.log(req.query)
  console.log("req.params")
  console.log(req.params)
  const currentDate = new Date();
  try {
    const updateRequestResult = await queryRunner(paymentACHRequestQuery,[userid,req.body,req.query,req.params,currentDate,Status]);
    if(ppp_status == "OK"){
      const updateUserResult=await queryRunner(paymentACHQuery,[userid, merchant_unique_id,totalAmount, Status,TransactionId, ppp_TransactionID]);
      if(updateUserResult[0].affectedRows > 0){
        res.status(200).json({message:"transaction status updated"})
      }else{
        res.status(422).json({message:"Error in update user"})
      }
    }else{
      res.status(422).json({message:"transaction is not saved"})
    }
   
  }catch(error){
    console.log(error);
    res.status(200).send(error.message);

  }
      }

// ###################################### Payment 2 Payment #############################################################
