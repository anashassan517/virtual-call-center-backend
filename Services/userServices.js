const { insertInPropertyImage } = require("../constants/queries");
const { queryRunner } = require("../helper/queryRunner");

class UserServices {
    constructor() {

    }
    async addImagesInDB(Images, id) {
        for (let i = 0; i < Images.length; i++) {
            const { image_url } = Images[i];
            const { image_key } = Images[i];
            const propertyImageResult = await queryRunner(insertInPropertyImage, [
                id,
                image_url,
                image_key
            ]);
            // if property image data not inserted into property image table then throw error
            if (propertyImageResult.affectedRows === 0) {
                throw new Error("data doesn't inserted in property image table");
            }
        }
    }
}
const userServices = new UserServices
module.exports = userServices