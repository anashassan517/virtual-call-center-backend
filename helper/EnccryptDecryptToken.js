// const CryptoJS = require('crypto-js');


// const secretKey = process.env.SECRETE_KEYENCRYPT ; // Replace with your actual secret key

// function encryptJwtToken(payload) {
//     return CryptoJS.AES.encrypt(payload, secretKey).toString();
// }

// function decryptJwtToken(encryptedPayload) {
//     const bytes = CryptoJS.AES.decrypt(encryptedPayload, secretKey);
//     const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
//     return decryptedData;
// }

// module.exports = {
//     encryptJwtToken,
//     decryptJwtToken,
// }