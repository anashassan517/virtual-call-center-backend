const { selectQuery } = require("../constants/queries");
const { queryRunner } = require("./queryRunner");
// const {
//   selectQuery,
// } = require("../constants/queries");s

const verifyMailCheck = async (email) => {
  try {
    const selectTenantResult = await queryRunner(selectQuery("users", "Email"), [email]);
    if (selectTenantResult[0].length > 0) {
      const createdDate = new Date(selectTenantResult[0][0].created_at);
      const newDate = new Date(createdDate.getTime());
      newDate.setDate(newDate.getDate() + 7); // Adding 7 days to the createdDate

      const currentDate = new Date();
      
      if (currentDate <= newDate) {
        const differenceInMilliseconds = newDate - currentDate;
        const differenceInDays = Math.ceil(differenceInMilliseconds / (1000 * 60 * 60 * 24));

        if (differenceInDays === 0) {
          return {
            status: 200,
            message: `Today is your last day, so kindly verify your email.`,
            date: createdDate,
          };
        } else {
          return {
            status: 200,
            message: `Your remaining days to verify your email: ${differenceInDays}`,
            data: differenceInDays,
            createdDate: createdDate,
            newDate: newDate,
            currentDate: currentDate,
          };
        }
      } else {
        return {
          status: 200,
          message: `Your account is locked due to email verification. Please verify your email.`,
        };
      }
    } else {
      return {
        status: 400,
        message: 'landlord is not found',
      };
    }
  } catch (error) {
    return {
      status: 400,
      message: "Error occurred while verifying the landlord's email: " + error,
    };
  }
};

module.exports = {
  verifyMailCheck,
};
