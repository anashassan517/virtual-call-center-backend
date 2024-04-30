// const mysql = require('mysql');
const bcrypt=require('bcrypt')
// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'spaid'
// });

// db.connect((err) => {
//   if (err) {
//     throw err;
//   }
//   console.log('Connected to database');
// });

module.exports = {
  createUser: function(firstName, lastName, email, phone, password,planID, callback) {
    const sql = 'INSERT INTO signups (FirstName, LastName, Email, Phone, Password,planID) VALUES (?, ?, ?, ?, ?,?)';
    db.query(sql, [firstName, lastName, email, phone, password, planID], (err, result) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, result);
    });
  }, 
  Signin: function( email, password ,callback) {
    // const sql = 'SELECT * FROM signups WHERE Email = ? AND Password = ?';
    const sql = 'SELECT * FROM signups WHERE Email = ?';
      db.query(sql,email, async(err, result) => {
        
        if (err) {
          return callback(err, null);
        }
        else if(!result[0]){
          return callback("Email not exist!!", null);
        }
        else if(await bcrypt.compare(password,result[0].password)){
          callback(null, result);
        }
        else{
          return callback("Wrong Password!!!", null);
        }
      });
    // db.query(sql, [ email, password], (err, result) => {
    //     if (err) {
    //       return callback(err, null);
    //     }
    //     callback(null, result);
    //   });
  },
  Signinall: function(callback) {
    const sql = 'SELECT * FROM signups ';
    db.query(sql, (err, result) => {
        if (err) {
          return callback(err, null);
        }
        callback(null, result);
      });
  }, 
  sendmail: function(email, callback) {
    const sql = 'SELECT * FROM signups WHERE Email = ?'; 
    db.query(sql, [email], (err,result) => {
        if (err) {
          return callback(err, null);
        }
        callback(null, result);
      });
  },

insertPasswordCode : function(token,userid, callback) {
    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ');
    const sql = 'UPDATE signups SET token = ?, updated_at = ? where id = ?';
    // db.query(sql,[token, formattedDate, userid]);
    db.query(sql,[token, formattedDate, userid] ,(err,result)=>{
      if(err){
        return callback(err, null);
      }
      return callback(null,result);
    });
  },


//  ############################# Verify Reset Email Code ############################################################
verifyResetEmailCode: (id,token,callback)=>{
  const sql = "SELECT * FROM signups where id = ? and token = ?";
  db.query(sql,[id,token], (err,result)=>{
    if(err){
      return callback(err,null);
    }else{
         return callback(null,result);
    }
  });
},
//  ############################# Verify Reset Email Code ############################################################




//  ############################# Update Password ############################################################
updatePassword : (id,password,token,callback)=>{
const sql = "UPDATE signups SET Password = ? where id = ? and token = ?";
db.query(sql,[password, id, token],(err,result)=>{
  if(err){
    return callback (err,null);
  }else{
    return callback (null,result);
  }
})
}, 
//  ############################# Update Password ############################################################



//  ############################# resend Code ############################################################
resendCodeselect : (id, callback)=>{
  const sql = 'SELECT * FROM signups where id = ?';
  db.query(sql,[id] ,(err,result)=>{
    if(err){
      return callback(err, null);
    }
    return callback(null,result);
  });
}
//  ############################# resend Code ############################################################
//  ############################# resend Code ############################################################
// resendCode : (id, token,callback)=>{
//   const now = new Date();
//   const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ');
//   const sql = 'UPDATE signups SET token = ?, updated_at = ? where id = ?';
//   db.query(sql,[token, formattedDate, id] ,(err,result)=>{
//     if(err){
//       return callback(err, null);
//     }
//     return callback(null,result);
//   });
// }
//  ############################# resend Code ############################################################







};
