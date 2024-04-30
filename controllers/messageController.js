const { insertMessage, selectQuery, getMessages, getMessageCount, updateMessageCount, updateMessageCountLandlord } = require("../constants/queries");
const { queryRunner } = require("../helper/queryRunner");




const messageClt = {
    createNewMessage: async (req, res) => {
        try {
            const sender = req.user.userId;
            const { chatId, message, messageType,userType, receiverID } = req.body;
            const isRead = 1;
            const created_at = new Date()
            if (!chatId || !message || !messageType) {
                throw new Error("Please provide all required fields");
            }
            // message,chatId,messageType, created_at
            const sendMessage = await queryRunner(
                insertMessage, [message, chatId, messageType, created_at,sender,userType, receiverID,isRead ]
            );
            if (sendMessage[0].affectedRows > 0) {
                // const updateAllMessagesCount = await queryRunner(updateMessageCountLandlord, [receiverID,sender])
                // if (updateAllMessagesCount[0].affectedRows > 0) {
                    res.status(200).json({
                        message: "Message sent successfully",
                        data: sendMessage[0]
                    })
                // }

            }
        } catch (error) {
            res.status(400).json({
                message: error.message
            })
        }
    },
    createNewMessageTenant: async (req, res) => {
        try {
            const sender = req.user.userId;
            const { chatId, message, messageType ,userType, receiverID } = req.body;
            const isRead = 1;
            const created_at = new Date()
            if (!chatId || !message || !messageType) {
                throw new Error("Please provide all required fields");
            }
            // message,chatId,messageType, created_at
            const sendMessage = await queryRunner(
                insertMessage, [message, chatId, messageType, created_at,sender,userType, receiverID,isRead ]
            );
            if (sendMessage[0].affectedRows > 0) {
                res.status(200).json({
                    message: "Message sent successfully",
                    data: sendMessage[0]
                })
            }
        } catch (error) {
            res.status(400).json({
                message: error.message
            })
        }
    },
    getAllMessages: async (req, res) => {
        try {
            const { chatId } = req.params;
            if (!chatId) {
                throw new Error("Please provide all required fields");
            }
            // const getMessages = await queryRunner(selectQuery("messages", "chatId"), [chatId]);
            const  getAllMessages = await queryRunner(getMessages, [chatId])
            if (getMessages[0].length > 0) {
                res.status(200).json({
                    message: "Messages fetched successfully",
                    data: getAllMessages[0]
                })
            }
        } catch (error) {
            res.status(400).json({
                message: error.message
            })
        }

    },

    // get (Message) Number of count landlord
    getMessagesCountLandlord : async (req, res) => {
        try {
            const { userId } = req.user;
            if (!userId) {
                throw new Error("Please provide all required fields");
            }
            // const getMessages = await queryRunner(selectQuery("messages", "chatId"), [chatId]);
            const  getAllMessagesCount = await queryRunner(getMessageCount, [userId])
            console.log(getAllMessagesCount[0])
            if (getAllMessagesCount[0].length > 0) {
                res.status(200).json({
                    message: "Messages fetched successfully",
                    Count: getAllMessagesCount[0][0]
                })
            }else{
                res.status(200).json({
                    message: "Messages fetched successfully",
                    Count: "0"
                })
            }
        } catch (error) {
            res.status(400).json({
                message: error.message
            })
        }

    },


    // get (Message) Number of count Tenant
    getMessagesCountTenant : async (req, res) => {
        try {
            const { userId } = req.user;
            if (!userId) {
                throw new Error("Please provide all required fields");
            }
            // const getMessages = await queryRunner(selectQuery("messages", "chatId"), [chatId]);
            const  getAllMessagesCount = await queryRunner(getMessageCount, [userId])
            if (getAllMessagesCount[0].length > 0) {
                res.status(200).json({
                    message: "Messages fetched successfully",
                    Count: getAllMessagesCount[0][0]
                })
            }else{
                res.status(200).json({
                    message: "Messages fetched successfully",
                    Count: "0"
                })
            }
        } catch (error) {
            res.status(400).json({
                message: error.message
            })
        }

    },

     // get update Messages Count Landlord
     updateMessagesCountLandlord : async (req, res) => {
        try {
            const { sender } = req.body;
            const { userId } = req.user;
            // console.log(req);
            // const isread = 0;
            if (!sender) {
                throw new Error("Please provide all required fields");
            }
            // const getMessages = await queryRunner(selectQuery("messages", "chatId"), [chatId]);
            const  updateAllMessagesCount = await queryRunner(updateMessageCountLandlord, [userId, sender])
            if (updateAllMessagesCount[0].affectedRows > 0) {
                res.status(200).json({
                    message: "Messages Updated successfully",
                    // Count: getAllMessagesCount[0][0]
                })
            }
        } catch (error) {
            res.status(400).json({
                message: error.message
            })
        }

    },
    
     // get update Messages Count Tenant 
     updateMessagesCountTenant : async (req, res) => {
        try {
            const { userId } = req.user;
            // const isread = 0;
            if (!userId) {
                throw new Error("Please provide all required fields");
            }
            // const getMessages = await queryRunner(selectQuery("messages", "chatId"), [chatId]);
            const  updateAllMessagesCount = await queryRunner(updateMessageCount, [userId])
            console.log(updateAllMessagesCount[0])
            if (updateAllMessagesCount[0].affectedRows > 0) {
                res.status(200).json({
                    message: "Messages Updated successfully",
                    // Count: getAllMessagesCount[0][0]
                })
            }else{
                res.status(200).json({
                    message: "No messages to update",
                    // Count: getAllMessagesCount[0][0]
                })
            }
        } catch (error) {
            res.status(400).json({
                message: error.message
            })
        }

    } 
}


module.exports = messageClt;