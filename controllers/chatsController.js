const {
  insertChat,
  selectQuery,
  getFullChat,
  getChatUsers,
  getChatTenants,
  checkChatQuery,
  checkTenantsChatQuery,
} = require("../constants/queries");
const { queryRunner } = require("../helper/queryRunner");

const chatsController = {
  accessChats: async (req, res) => {
    const senderId = req.user.userId;
    const { recieverId } = req.body;
    try {
      // check if chat already exists
      const isChat = await queryRunner(checkChatQuery, [recieverId , senderId, senderId ,recieverId]);
        console.log(isChat[0])
      // const isChat = await queryRunner(
      //     selectQuery("chats", "senderId", "receiverID"),
      //     [senderId, recieverId]
      // );
      const created_at = new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
      if (isChat[0].length > 0) {
        res.send(isChat[0]);
      } else {
        // insert into chats table if chat does not exist
        await queryRunner(insertChat, [senderId, recieverId, created_at]);
        const isChat = await queryRunner(
          selectQuery("chats", "senderId", "receiverID"),
          [senderId, recieverId]
        );
        res.send(isChat[0]);
      }
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  },
  accessTenantsChats: async (req, res) => {
    const senderId = req.user.userId;
    const { recieverId } = req.body;
    try {
      // check if chat already exists
      // const isChat = await queryRunner(checkChatQuery, [recieverId , senderId, senderId ,recieverId]);
      const isChat = await queryRunner(checkTenantsChatQuery, [recieverId , senderId, senderId ,recieverId]);

        console.log(isChat[0])
      const created_at = new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
      if (isChat[0].length > 0) {
        res.send(isChat[0]);
      } else {
        // insert into chats table if chat does not exist
        await queryRunner(insertChat, [senderId, recieverId, created_at]);
        const isChat = await queryRunner(
          selectQuery("chats", "senderId", "receiverID"),
          [senderId, recieverId]
        );
        res.send(isChat[0]);
      }
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  },
  fetchUsersChats: async (req, res) => {
    const senderId = req.user.userId;
    try {
      const getChatsData = await queryRunner(getChatUsers, [senderId]);
      res.status(200).json({
        message: "Chats fetched successfully",
        data: getChatsData[0],
      });
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  },
  fetchUsersTenants: async (req, res) => {
    const senderId = req.user.userId;
    try {
      const getChatsData = await queryRunner(getChatTenants, [senderId]);
      res.status(200).json({
        message: "Chats fetched successfully",
        data: getChatsData[0],
      });
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  },
};
exports.chatsController = chatsController;
