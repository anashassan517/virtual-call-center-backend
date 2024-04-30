const { createLead } = require("../constants/queries");
const { queryRunner } = require("../helper/queryRunner");



const leadsClt = {
    createNewLead: async (req, res) => {
        try {
            const {
                firstName,
                middleName,
                lastName,
                phoneNum,
                email,
                propertyInfo,
                unitInfo,
                leadDetails,
                sourceCampaign
            } = req.body;
            const { userId } = req.user;
            const insertLead = await queryRunner(createLead, [
                firstName,
                middleName,
                lastName,
                phoneNum,
                email,
                propertyInfo,
                unitInfo,
                leadDetails,
                sourceCampaign,
                userId
            ]);
            if (insertLead[0].affectedRows > 0) {
                res.status(200).json({
                    message: "Lead created successfully",
                    data: insertLead[0]
                })
            }
        } catch (error) {
            res.status(400).json({
                message: error.message
            })
        }
    },

}

module.exports = leadsClt;