const user = require("../models/user");
const {
  sendMail,
  taskSendMail,
  sendMailLandlord,
  propertyMail,
  welcomeEmailAgent,
  agentApprovalEmail,
  caseSubmissionEmail,
  assignCaseEmail,
  assignCaseToAgentEmail,
  caseStatusEmail
} = require("../sendmail/sendmail.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fs = require("fs");
const Path = require("path");
const imageToDelete = require("./../middleware/deleteImage.js");
const { serialize } = require("cookie");
const {

  selectQuery,
  deleteQuery,
  insertInUsers,
  addResetToken,
  insertInProperty,
  insertInPropertyImage,
  updateProperty,
  insertInPropertyUnits,
  updatePropertyUnits,
  selectPropertyTenant,
  getUnitsCount,
  insertMoreUnits,
  putUnitsUpdate,
  selectAllTenants,
  PropertyUnitsVacant,
  propertyTaskQuery,
  selectAllTenantsProperty,
  updateUser,
  updatePlanId,
  updateEmailQuery,
  updateVerifiedStatusQuery,
  delteImageFromDb,
  updateNotify,
  updatePasswordLandlord,
  getAllProperty,
  getPropertyReport,
  getTenantReport,
  getInvoiceReportData,
  getTaskReportData,
  getLeaseReport,
  getTotalAmount,
  getTotalAmountUnpaid,
  getTotalAmountPaid,
  getNumPropertyTenant,
  insertNotify,
  getPropertiesGraphData,
  getTaskGraphData,
  getInvoiceGraphData,
  updateUserActive,
  getUserById,
  getTenantById,
  updateTenantActive,
  getPropertyDashboardData,
  getPropertiesGraphDataBypropertyID,
  getInvoiceGraphDataByPropertId,

  getTaskGraphDataByPropertyId,
  getInvoiceGraphDataByPropertyId,
  updateUserAccountQuery,
  checkMyAllTenantsInvoicePaidQuery,
  updateAllTenantsAccountQuery,
  getAllTenantsQuery,
  deleteUserAccountData,
  updateAuthQuery,
  addResetTokenTenant,
  propertyUnitCount,
  getMessageCountByID,
  checkProperty,
  insertVendorCategory,
  insertProspectusSources,
  userPermissionLogin,
  addUserRoles,
  UpdatePropertyUnitCount,
  UnitCounts,
  UpdateUserNuveiIdQuery,
  InvoiceCategoriesQuery,
  adminNotificationQuery,
  propertyIdUpdate,
  propertyCount,
  updateActiveUser,
  messageDelete,
  checkPropertyUnitQuery,
  checkPropertyid,
  insertInAgent,
  getAgentLanguage,
  getAllUserswithAudiofiles,
  submittCase,
  getAllCases,
  getSpecificCaseQuery,
  assignAgent,
  updateAgentStatus,
  getAgentDashboardData,
  getAdminDashboardData,
  insertInCaseAudios,
  getNumberofCasesAdmin,
  getNumberofCasesAgent,
  getNumberofAgents,
  updatePassword,
  updateCaseStatus,
  getAllCasesAgents,
  addForm,
  insertFormFields,
  insertCaseFieldValues
  // updatePropertyBankAccountQuery
} = require("../constants/queries");

const { hashedPassword } = require("../helper/hash");
const { queryRunner } = require("../helper/queryRunner");
const { fileUpload, deleteImageFromS3 } = require("../helper/S3Bucket");
const { verifyMailCheck } = require("../helper/emailVerify");
const userServices = require("../Services/userServices");
const { log } = require("console");
const paragraphList=[
  {
    name:"English",
    text:`The sun rose slowly over the horizon, casting a warm golden glow across the landscape. Birds chirped happily in the trees, welcoming the new day with their cheerful melodies. A gentle breeze rustled through the leaves, carrying with it the scent of fresh flowers. As the world awakened, the streets began to bustle with activity as people went about their daily routines. It was a peaceful morning, filled with promise and possibility, as nature and humanity harmonized in the beauty of the dawn.`,

  },
  {
    name:"Urdu",
    text:  `روشنی آہستہ آہستہ زمین کے کنارے پر چمک اُٹھی، منظر کو گرم سونے کی روشنی سے بھر دیا۔ پرندے خوشی سے درختوں میں گانے گاتے رہے، نئے دن کا استقبال اپنی خوشیوں کے ساتھ کرتے ہوئے۔ ایک نرم ہوا پتوں کے ساتھ گزر گئی، جس کے ساتھ تازہ پھولوں کی خوشبو بھی چمکی۔ جب دنیا نیا ہوتی تھی، راستے حرکت میں آگئے جب لوگ اپنی روزمرہ کی فعالیتوں کے ساتھ مصروف ہونے لگے۔ یہ ایک پرامن صبح تھی، جس میں وعدہ اور امکانات کی خوبصورتی میں قوتِ مدنظر کا تصور تھا، جب طبیعت اور انسانیت سویرے کی خوبصورتی میں ہم آہنگ ہوتی ہیں۔`
  },
  {
    name:"Sindhi",
    text:`سج افق جي مٿان آهستي آهستي اڀريو، سڄي منظرنامي تي هڪ گرم سونا چمڪ اڇلائي. پکين وڻن تي خوشيءَ سان ڀاڪر پائي، نئين ڏينهن کي خوشيءَ سان خوشيءَ سان ڀليڪار ڪري رهيا هئا. هوائن جي هلڪي هلڪي ڦلڪي پنن مان وهي رهي هئي، جيڪا پاڻ سان تازن گلن جي خوشبوءِ کڻي رهي هئي. جيئن دنيا جاڳي پئي، گهٽيون سرگرميءَ سان ڀريل ٿيڻ لڳيون جيئن ماڻهو پنهنجي روزمره جي معمولن تي هليا ويا. اها هڪ پرامن صبح هئي، واعدو ۽ امڪان سان ڀريل، جيئن فطرت ۽ انسانيت صبح جي حسن ۾ هموار ٿي وئي.`,

  }
]
// const { encryptJwtToken } = require("../helper/EnccryptDecryptToken");
// const { NotificationSocket } = require("../app.js");
const config = process.env;
exports.createUser = async function (req, res) {
  const { firstName, lastName, email, contact, password, language_id } = req.body;
  const isApproved=false;
  const currentDate = new Date();
  try {
    const selectResult = await queryRunner(selectQuery("agent", "email","contact"), [
      email,
      contact
    ]);
    if (selectResult[0].length > 0) {
      return res.status(400).json({
        message: "Email or Contact already exists",
        isApproved:selectResult[0][0].isApproved==0?false:true
      });
    }
    const hashPassword = await hashedPassword(password);
    
    const insertResult = await queryRunner(insertInAgent, [
      firstName,
      lastName,
      email,
      contact,
      hashPassword,
      currentDate,
      isApproved,
      language_id,
      
    ]);
    // const random = Math.floor(100000 + Math.random() * 900000);
    // const mailSubject = "verify Email";
    if(insertResult[0].affectedRows > 0){
      welcomeEmailAgent(email,"Welcome to Virtual Call Center",null,`${firstName} ${lastName}`);
      return res.status(200).json({
        message:"User created Successfully",
        "isApproved":isApproved
      })
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message : "Failed to add user",
      message: error.message 
      });
  }
};
exports.addAdmin = async function (req, res) {
  const { firstName, lastName, email, contact, password, language_id } = req.body;
  const isAdmin=1;
  const isApproved=1;
  const currentDate = new Date();
  try {
    const selectResult = await queryRunner(selectQuery("agent", "email","contact"), [
      email,
      contact
    ]);
    if (selectResult[0].length > 0) {
      return res.status(400).json({
        message: "Email or Contact already exists",
        isApproved:selectResult[0][0].isApproved==0?false:true
      });
    }
    const hashPassword = await hashedPassword(password);
    
    const insertResult = await queryRunner(insertInAgent, [
      firstName,
      lastName,
      email,
      contact,
      hashPassword,
      currentDate,
      isApproved,
      language_id,
      isAdmin
    ]);
    const userId=insertResult[0].insertId;
    const updateAdmin=await queryRunner("UPDATE agent SET language_audio_present=? WHERE id=?",[1,userId]);
    
    // const random = Math.floor(100000 + Math.random() * 900000);
    // const mailSubject = "verify Email";
    if(insertResult[0].affectedRows > 0){
      welcomeEmailAgent(email,"Welcome to Virtual Call Center",null,`${firstName} ${lastName}`);
      return res.status(200).json({
        message:"Admin created Successfully",
        "isApproved":isApproved
      })
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message : "Failed to add user",
      message: error.message 
      });
  }
}
exports.Signin = async function (req, res) {
  const {email,password}=req.body;
  try {
    const selectResult = await queryRunner(selectQuery("agent", "email"), [
      email,
    ]);
    if (selectResult[0].length === 0) {
      return res.status(404).json({
        message: "Email not found",
      });
    }
    const user = selectResult[0][0];
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }
    
    const token = jwt.sign(
      { userId: user.id, email: user.email},
      config.JWT_SECRET,
      { expiresIn: "7d" }
    );
    user.role=user?.isAdmin==1?"admin":"agent"
    res.status(200).json({
      token,
      ...user,
      isApproved:user.isApproved==0?false:true,
      audio:user.language_audio_present==0?false:true,
      message:"Successfully Logged In"
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
exports.changePasssword = async function (req, res) {
  // const {currentPassword, NewPassword } = req.query;
  const {currentPassword, newPassword } = req.body;

  const {userId}=req.user


  try {
      const selectResult = await queryRunner(selectQuery("agent", "id"), [userId]);
      if (selectResult[0].length === 0) {
        return res.status(404).json({
          message: "User not found",
        });
      } else if (
        await bcrypt.compare(currentPassword, selectResult[0][0].password)
      ) {
          const hashPassword = await hashedPassword(newPassword);
          const updateResult = await queryRunner(updatePassword, [hashPassword,userId]);
            if (updateResult[0].affectedRows === 0) {
              return res.status(400).json({
                message: "Failed to update password",
              });
            } else {
              const email = selectResult[0][0].email;
              const token = jwt.sign({ userId:userId,emial:email }, config.JWT_SECRET, {
                expiresIn: "7d"
              });
              return res.status(200).json({
                token,
      ...selectResult[0][0],
      role:selectResult[0][0].isAdmin==1?"admin":"agent",
      isApproved:selectResult[0][0].isApproved==0?false:true,
      audio:selectResult[0][0].language_audio_present==0?false:true,
      message:"Password updated Successfully"
              });
            }
      } else {
        return res.status(400).json({
          message: "Invalid Password",
        });
      }  
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
exports.generateParagraphs= async function (req, res){
  const {email}=req.user;
  const selectResult = await queryRunner(selectQuery("agent", "email"), [email]);
  if(selectResult[0].length > 0){
    const languages=selectResult[0][0];
    const paragraph=languages.language_id.split(",").map((id)=>paragraphList[parseInt(id)-1]);
    return res.status(200).json({
      paragraph
    })
  }else{
    return res.status(404).json({
      message:"User not found"
    })
  }
}
exports.getAllLanguages= async function (req, res){
  const selectResult = await queryRunner(selectQuery("languages"));
  if(selectResult[0].length > 0){
    const data=selectResult[0];
    return res.status(200).json({
      data
    })
  }else{
    return res.status(404).json({
      message:"No data found"
    })
  }

}
exports.getUser = (req, res) => {
  const { userId } = req.user;
  try {
    queryRunner(selectQuery("agent", "id"), [userId]).then((result) => {
      if (result[0].length > 0) {
        let data = result[0][0];
        data.role=data?.isAdmin==1?"admin":"agent";
        data.isApproved=data.isApproved==0?false:true;
        data.audio=data.language_audio_present==0?false:true;
        res.status(200).json({
          ...data,
          message: "User",
        });
        
        
      } else {
        res.status(400).json({
          message: "No data found",
        });
      }
    });
  } catch (error) {
    res.send("Error Get User By ID");
    console.log(error);
  }
};
exports.getAllUsersWithAudios = async (req, res) => {
  try {
    const agentResult = await queryRunner(selectQuery("agent", "isAdmin"), [0]);
    
    const result = await Promise.all(agentResult[0].map(async (agent) => {
      const audios = await queryRunner(selectQuery("audio_files", "agentId"), [agent.id]);
      agent.language_names_with_audios = agent.language_id.split(",").map((id, index) => {
        return {
          language_name: paragraphList[parseInt(id) - 1].name,
          audio_key: audios[0].length > 0 ? audios[0][index].audio_key : null,
          audio_url: audios[0].length > 0 ? audios[0][index].audio_url : null,
        };
      });
      return agent;
    }));
    
    console.log(result);
    
    if (agentResult[0].length > 0) {
      res.status(200).json({
        result,
        message: "All Users",
      });
    } else {
      res.status(400).json({
        message: "No data found",
      });
    }
  } catch (error) {
    res.status(500).send("Error fetching all users");
    console.log(error);
  }
};

exports.addCase = async (req, res)=> {
  try{
    const {userId,email:reporter}=req.user
    const { name, city, engineering_field, pec_registration_number, question,contact,audios,email,isAdmin } = req.body;
    let emailsTo=[];
    const getResult=await queryRunner(selectQuery("cases",'contact','email','question'),[
      contact,
      email,
      question
    ])
    const dataToInsert= [
      name,
      city,
      engineering_field,
      pec_registration_number,
      question,
      contact,
      email
    ]
    if(!isAdmin){
      dataToInsert.push(
        userId
      )
      emailsTo.push(reporter)
    }else{
      dataToInsert.push(
        null
      )
    }
    if(getResult[0].length>0){
      throw new Error("Already exist")
    }else{
      const insertResult = await queryRunner(submittCase,dataToInsert);
      if(insertResult[0].affectedRows > 0){
        
        const caseId=insertResult[0].insertId;
        for(let i=0;i<audios.length;i++){
          const { audio_url, audio_key } = audios[i];
          const insertResult = await queryRunner(insertInCaseAudios, [
            audio_url,
            audio_key,
            caseId
          ]);
          if(insertResult[0].affectedRows === 0){
            throw new Error("Failed to submit case")
          }
        }
        emailsTo.push(email)
        emailsTo.forEach((email)=>{
          caseSubmissionEmail(email,"Case Submission",caseId,name)
        })
        return res.status(200).json({
          message:"Case submitted Successfully"
        })
      }
      else{
        throw new Error("Failed to submit case")
      }
    }
  }catch(error){
    res.status(400).json({
      message: error.message,
    });
  }
}
exports.addCaseFieldValues = async (req, res)=> {
  try{
    const {userId,email:reporter}=req.user
    const { audios,isAdmin,fields,form_id } = req.body;
    console.log("fields",fields)
    // let insertResult;
    let emailsTo=[];
    fields.forEach(async (field)=>{
      const {id,value,name}=field;
      console.log("id",id,'value',value,"name",name)
      const insertResult = await queryRunner(insertCaseFieldValues, [
        id,
        value,
        userId
      ]);
      if(name.toLowerCase=="email"){
        emailsTo.push(value)
      }
      
    })
    const insertResult=await queryRunner('INSERT INTO test_cases (caseeform_id,agentId,status) VALUES (?,?,?)',[form_id,isAdmin?null:userId,"Pending"]);
    
    if(!isAdmin){
      emailsTo.push(reporter)
    }
    

      if(insertResult[0].affectedRows > 0){
        
        const caseId=insertResult[0].insertId;
        for(let i=0;i<audios.length;i++){
          const { audio_url, audio_key } = audios[i];
          const insertResult = await queryRunner(insertInCaseAudios, [
            audio_url,
            audio_key,
            caseId
          ]);
          if(insertResult[0].affectedRows === 0){
            throw new Error("Failed to submit case")
          }
        }
       
        emailsTo.forEach((email)=>{
          caseSubmissionEmail(email,"Case Submission",caseId,"Applicant")
        })
        return res.status(200).json({
          message:"Case submitted Successfully"
        })
      }
      else{
        throw new Error("Failed to submit case")
      }
  }catch(error){
    res.status(400).json({
      message: error.message,
    });
  }
}
exports.getAllCases= async function (req, res){
  try {
    const {userId}=req.user
    const selectResult =await queryRunner(selectQuery("agent","id"),[userId]);
    let cases;
    if(selectResult[0][0].isAdmin){
      cases = await queryRunner(getAllCases);
    }else{
      cases = await queryRunner(selectQuery("cases","agentId"),[userId]);

    }
    
    
    if (selectResult[0].length > 0) {
      const data = cases[0];
      res.status(200).json({
        data,
        message: "All Cases",
      });
    } else {
      res.status(400).json({
        message: "No data found",
      });
    }
  } catch (error) {
    res.send("Error Get All Cases");
    console.log(error);
  }
}

exports.getAllCasesTest= async function (req, res){
  try {
    const {userId}=req.user
    const selectResult =await queryRunner(selectQuery("agent","id"),[userId]);
    let cases;
    if(selectResult[0][0].isAdmin){
      cases = await queryRunner(getAllCases);
    }else{
      cases = await queryRunner(selectQuery("cases","agentId"),[userId]);

    }
    
    
    if (selectResult[0].length > 0) {
      const data = cases[0];
      res.status(200).json({
        data,
        message: "All Cases",
      });
    } else {
      res.status(400).json({
        message: "No data found",
      });
    }
  } catch (error) {
    res.send("Error Get All Cases");
    console.log(error);
  }
}

exports.getspecificCase = async function (req, res) {
  const { caseId } = req.params; // Retrieve caseId from req.params
  try {
    // Query the database with the provided caseId
    const caseDetails = await queryRunner(getSpecificCaseQuery, [caseId]);
    if (caseDetails.length > 0) {
      res.status(200).json({
        message: "Case found",
        case: caseDetails[0], // Assuming the first row is the case details
      });
    } else {
      res.status(404).json({
        message: "Case not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



exports.getApprovedAgents= async function (req, res){
  try {
    const selectResult = await queryRunner(selectQuery("agent","isApproved","isAdmin"),[1,0]);
    if (selectResult[0].length > 0) {
      const data = selectResult[0];
      res.status(200).json({
        data,
        message: "All Approved Agents",
      });
    } else {
      res.status(400).json({
        message: "No data found",
      });
    }
  } catch (error) {
    res.send("Error Get All Approved Agents");
    console.log(error);
  }

}
exports.assignAgent= async function (req, res){
  try{
    const { agent_id, case_id } = req.body;

    const insertResult = await queryRunner(assignAgent, [
      agent_id,
      case_id
    ]);
    if(insertResult[0].affectedRows > 0){
      const selectResult = await queryRunner(selectQuery("agent","id"),[agent_id]);
      const selectCase=await queryRunner(selectQuery("cases","id"),[case_id]);
      assignCaseEmail(selectCase[0][0].email,"Case Assigned",case_id,`${selectResult[0][0].firstname} ${selectResult[0][0].lastname}`)
      assignCaseToAgentEmail(selectResult[0][0].email,"Case Assigned",case_id,`${selectResult[0][0].firstname} ${selectResult[0][0].lastname}`)
      return res.status(200).json({
        message:"Agent assigned Successfully"
      })
    }
    else{
      throw new Error("Failed to assign agent")
    }
  }catch(error){
    res.status(400).json({
      message: error.message,
    });
  }

}
exports.getDashboardData = async (req, res) => {
  try {
    const { userId } = req.user;
    console.log(userId);
    const selectResult=await queryRunner(selectQuery("agent","id"),[userId]);
    if(selectResult[0].length > 0){
      const user=selectResult[0][0];
      if(!user.isAdmin){
        const selectResult = await queryRunner(getAgentDashboardData, [userId,userId,userId,userId]);
        let selectcasesresult = await queryRunner(getNumberofCasesAgent, [userId]);
       console.log(selectcasesresult[0]);
       let selectcases = selectcasesresult[0].map(item => item.month_year);

const months = [1,2,3,4,5,6,7,8,9,10,11,12];
const caseCounts = months.map(month => {
  console.log(selectcases, month, selectcases.indexOf(month));
  const index = selectcases.indexOf(month);
  return index !== -1 ? selectcasesresult[0][index]?.case_count : 0;
});

        if (selectResult[0].length > 0) {
          let data = selectResult[0][0];
          data.cases=caseCounts;
          res.status(200).json({
            data,
            message: "Dashboard Data",
          });
        } else {
          res.status(400).json({
            message: "No data found",
          });
        }
      }else{
        const selectResult = await queryRunner(getAdminDashboardData,[0]);
        const selectcases=await queryRunner(getNumberofCasesAdmin,[0]);
        const selectagents=await queryRunner(getNumberofAgents);
        console.log(selectcases[0]);
        if (selectResult[0].length > 0) {
          let data = selectResult[0][0];
          data.cases=selectcases[0].map((item)=>item.case_count);
          data.agents=selectagents[0].map((item)=>item.agent_count);
          res.status(200).json({
            data,
            message: "All Users",
          });
        } else {
          res.status(400).json({
            message: "No data found",
          });
        }
      
      }
    }else{
      res.status(404).json({
        message: "Unauthorized User",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: error.message,
    });
  }
};
exports.checkemail = async function (req, res) {
  const { email } = req.query;
  // const { email } = req.body;
  try {
    const selectResult = await queryRunner(selectQuery("userPUsers","UEmail"), [ 
      email,
  ]);
  const LandlordSelectResult = await queryRunner(selectQuery("users", "Email"), [
      email,
    ]);
    if (selectResult[0].length > 0 && LandlordSelectResult[0].length > 0) {
      return res.status(409).json({
          message: "Email already exists ",
      });
    }else if(selectResult[0].length > 0 ){
      return res.status(409).json({
          message: "Email already exists ",
      });
    }else if (LandlordSelectResult[0].length > 0){
      return res.status(409).json({
          message: "Email already exists ",
      });
    } 
    else {
      res.status(200).json({
                 message: "New user",
      });
    }
  } catch (error) {
    // res.status(500).send("Error");
    res.status(400).json({
      message: error.message,
    });
  }
};
exports.updateUserProfile = async function (req, res) {
  const {
    firstname,
    lastname,
    email,
    contact,
    address,
    image_url,
    image_key,
    
    city,
    state,
    zipCode
  } = req.body;
  const { userId } = req.user;
  
  try {
    const selectResult = await queryRunner(selectQuery("agent", "id"), [
      userId,
    ]);
    // current date
    const now = new Date();
    // const created_at = now.toISOString().slice(0, 19).replace("T", " ");

    const isUserExist = selectResult[0][0];
    if (!isUserExist) {
      // throw new Error("User not found");
      res.status(404).json({
        message: "User not found",
      });
    }
    if (isUserExist) {
      const updateUserParams = [
        firstname,
        lastname,
        email,
        contact,
        address,
        image_url,
        image_key,
        city,
        state,
        zipCode,
        userId,
      ];
      const updateResult = await queryRunner(updateUser, updateUserParams);
      if (updateResult[0].affectedRows > 0) {
        res.status(200).json({
          message: "User updated successfully",
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: error.message,
    });
  }
};
exports.updateAgentStatus = async function (req, res) {
  const { agent_id, status } = req.body;
  try {
    const selectResult = await queryRunner(selectQuery("agent", "id"), [
      agent_id,
    ]);
    if (selectResult[0].length > 0) {
      const updateResult = await queryRunner(updateAgentStatus, [
        status,
        agent_id,
      ]);
      if(status==1){
        agentApprovalEmail(selectResult[0][0].email,"Agent Approval","Approved",`${selectResult[0][0].firstname} ${selectResult[0][0].lastname}`)
      }
      if (updateResult[0].affectedRows > 0) {
        res.status(200).json({
          message: "Agent status updated successfully",
        });
      }
    } else {
      res.status(404).json({
        message: "Agent not found",
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }

}


exports.updateCaseStatus = async function (req, res) {
  const { case_id, status } = req.body;
  try {
    let selectAgent;
    const selectResult = await queryRunner(selectQuery("cases", "id"), [
      case_id,
    ]);
    
    const updateResult = await queryRunner(updateCaseStatus, [status, case_id]);
    if (updateResult[0].affectedRows > 0) {
      if(selectResult[0][0].agentId){
        selectAgent=await queryRunner(selectQuery("agent","id"),[selectResult[0][0].agentId]);
        caseStatusEmail(selectAgent[0][0].email,"Case Status",case_id,status)
      }
      caseStatusEmail(selectResult[0][0].email,"Case Status",case_id,status)
      res.status(200).json({
        message: "Case status updated successfully",
      });
    } else {
      res.status(404).json({
        message: "Case not found",
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
}

exports.addForm = async function (req, res) {
  try{
    const {userId}=req.user;
    const {
      name="Case",
      fields
    }=req.body;
    const selectUser=await queryRunner(selectQuery("agent","id"),[userId]);
    if(selectUser[0].length === 0){
      return res.status(404).json({
        message:"User not found"
      })
    }
    if(!selectUser[0][0].isAdmin){
      return res.status(401).json({
        message:"Unauthorized User"
      })
    }
    let formId;
    let createFormResult;
    const selectForm=await queryRunner(selectQuery("case_form","adminId"),[userId]);
    if(selectForm[0].length > 0){
      formId=selectForm[0][0].id;
      
    }else{
      createFormResult = await queryRunner(addForm, [
        name,
        userId
      ]);
      if(createFormResult[0].affectedRows > 0){
        formId=createFormResult[0].insertId;
        const defaultFields=[{
          fieldName:"Email",
          fieldType:"email",
        },{
          fieldName:"Contact",
          fieldType:"number",
        }]
      for(let i=0;i<defaultFields.length;i++){
        const createFieldResult = await queryRunner(insertFormFields,[formId,defaultFields[i].fieldName,defaultFields[i].fieldType,1,12,null,null,null,null,null]);
        if(createFieldResult[0].affectedRows === 0){
          throw new Error("Failed to add form")
        }
      
      }
      }
      
      else{
        throw new Error("Failed to add form")
      }
    }
   
    
      for(let i=0;i<fields.length;i++){
        const {fieldName,
          fieldType,
          options,
          required,
          size,
          fieldOrder,
          description,
          placeholder,
          tooltip,
          id
        }=fields[i];
        if(!id){
          const createFieldResult = await queryRunner(insertFormFields,[
            formId,
            fieldName,
            fieldType,
            required,
            size,
            
            fieldOrder??null,
            
            placeholder??null,
            tooltip??null,
            description??null,
            options??null,
          ]);
          if(createFieldResult[0].affectedRows === 0){
            throw new Error("Failed to add form")
          }
        }
      }
      return res.status(200).json({
        message:"Form added Successfully"
      })
    
  }catch(error){
    res.status(400).json({
      message: error.message,
    });
  }
}
exports.getForm = async function (req, res) {
  try{
    const {userId}=req.user;
    const selectUser=await queryRunner(selectQuery("agent","id"),[userId]);
    if(selectUser[0].length === 0){
      return res.status(404).json({
        message:"User not found"
      })
    }
    if(!selectUser[0][0].isAdmin){
      return res.status(401).json({
        message:"Unauthorized User"
      })
    }
    const selectForm=await queryRunner(selectQuery("case_form","adminId"),[userId]);
    if(selectForm[0].length === 0){
      return res.status(404).json({
        message:"Form not found"
      })
    }
    const selectFields=await queryRunner(selectQuery("form_fields","form_id"),[selectForm[0][0].id]);
    if(selectFields[0].length > 0){
      return res.status(200).json({
        form:selectForm[0][0],
        fields:selectFields[0]
      })
    }else{
      return res.status(404).json({
        message:"Fields not found"
      })
    }
  }catch(error){
    res.status(400).json({
      message: error.message,
    });
  }

}
exports.updatePlanId = async function (req, res) {
  // const { userId } = req.body;
  const { userId } = req.user;
  console.log(userId);
  try {
    const selectResult = await queryRunner(selectQuery("users", "id"), [
      userId,
    ]);
    // current date
    const isUserExist = selectResult[0][0];
    if (!isUserExist) {
      // throw new Error("User not found");
      res.status(404).json({
        message: "User not found",
      });
    }
    if (isUserExist) {
      const updateUserParams = [req.body.planID, userId];
      const updateResult = await queryRunner(updatePlanId, updateUserParams);
      if (updateResult[0].affectedRows > 0) {
        res.status(200).json({
          message: "planID updated successfully",
        });
      }
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

//  ############################# Reset Email ############################################################
exports.createResetEmail = async (req, res) => {
  const { email } = req.body;
  // console.log(email);
  const mailSubject = "Spade Reset Email";
  const random = Math.floor(100000 + Math.random() * 900000);
  try {
    const selectResult = await queryRunner(selectQuery("users", "Email"), [
      email,
    ]);
    if (selectResult[0].length > 0) {
      const userid = selectResult[0][0].id;
      const name =
        selectResult[0][0].FirstName + " " + selectResult[0][0].LastName;
      sendMail(email, mailSubject, random, name);
      const now = new Date();
      const formattedDate = now.toISOString().slice(0, 19).replace("T", " ");
      const updateResult = await queryRunner(addResetToken, [
        random,
        formattedDate,
        userid,
      ]);
      if (updateResult[0].affectedRows === 0) {
        res.status(400).send("Error");
      } else {
        res.status(200).json({ message: "Sended", id: userid });
      }
    } else if (selectResult[0].length === 0) {
      res.status(400).send("Email not found");
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error", error: error.message });
  }
};
//  ############################# Reset Email ############################################################

//  ############################# Verify Reset Email Code ############################################################
exports.verifyResetEmailCode = async (req, res) => {
  const { id, token } = req.body;
  // console.log(req.body)

  try {
    const selectResult = await queryRunner(
      selectQuery("users", "id", "token"),
      [id, token]
    );
    if (selectResult[0].length > 0) {
      const now = new Date(selectResult[0][0].updated_at);
      const now2 = new Date();
      const formattedDate = now2.toISOString().slice(0, 19).replace("T", " ");
      const time = new Date(formattedDate) - now;
      const time2 = time / 1000;
      if (time2 >= 120) {
        res.status(408).send("Time out");
      } else {
        res.status(200).json({
          message: "Successful",
          id: id,
          token: token,
        });
      }
    } else {
      res.status(404).json({
        message: "Cannot Validate!",
      });
    }
  } catch (error) {
    res.status(400).json({ message: "Error", error: error.message });
  }
};

exports.verifyAuthCode = async (req, res) => {
  const { id, token, tenant } = req.body;
  var selectResult;
  try {
    if(tenant == "tenant"){
      selectResult = await queryRunner(
        selectQuery("tenants", "id", "token"),
        [id, token]
      );
    }else{

      selectResult = await queryRunner(
        selectQuery("users", "id", "token"),
        [id, token]
      );
      
    }
    if (selectResult[0].length > 0) {
      const now = new Date(selectResult[0][0].updated_at);
      const now2 = new Date();
      const formattedDate = now2.toISOString().slice(0, 19).replace("T", " ");
      const time = new Date(formattedDate) - now;
      const time2 = time / 1000;
      if (time2 >= 300) {
        res.status(400).json({
          message: "OTP expired",
        });
      } else {
        res.status(200).json({
          message: "Successful",
          id: id,
          token: token,
        });
      }
    } else {
      res.status(404).json({
        message: "Cannot Validate!!!",
      });
    }
  } catch (error) {
    res.status(400).json({ message: "Error", error: error.message });
  }
};
//  ############################# Verify Reset Email Code ############################################################

//  ############################# Update Password ############################################################

exports.updatePassword = async (req, res) => {
  const { id, password, confirmpassword, token } = req.body;
  // const currentDate = new Date();

  try {
    if (password === confirmpassword) {
      const hashPassword = await hashedPassword(password);
      const currentDate = new Date();
      const selectResult = await queryRunner(updatePasswordLandlord, [
        hashPassword,
        currentDate,
        id,
        token,
      ]);
      if (selectResult[0].affectedRows > 0) {
        res.status(200).json({
          message: "Successful password saved",
        });
      } else {
        console.log("here");
        res.status(500).send("Error");
      }
    } else {
      res.status(401).send("Password Does not match ");
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error", error: error.message });
  }
};
//  ############################# Update Password ############################################################

//  ############################# resend Code ############################################################
exports.resendCode = async (req, res) => {
  const { id } = req.body;
  console.log(req.body);
  const mailSubject = "Spade Reset Email";
  const random = Math.floor(100000 + Math.random() * 900000);
  try {
    const selectResult = await queryRunner(selectQuery("users", "id"), [id]);
    if (selectResult[0].length > 0) {
      const userid = selectResult[0][0].id;
      const name =
        selectResult[0][0].FirstName + " " + selectResult[0][0].LastName;
      // console.log(selectResult[0][0])
      sendMail(selectResult[0][0].Email, mailSubject, random, name);
      const now = new Date();
      const formattedDate = now.toISOString().slice(0, 19).replace("T", " ");
      const updateResult = await queryRunner(addResetToken, [
        random,
        formattedDate,
        userid,
      ]);
      if (updateResult[0].affectedRows === 0) {
        res.status(400).send("Error");
      } else {
        res.status(200).json({ message: "Sended" });
      }
    }
  } catch (error) {
    res.status(400).json({ message: "Error", error: error.message });
    // console.log(error);
  }
};
//  ############################# resend Code ############################################################

//  ############################# Get Pricing Plan Start ############################################################
exports.pricingPlan = async (req, res) => {
  try {
    const pricingPlanResult = await queryRunner(selectQuery("plan"));
    if (pricingPlanResult.length > 0) {
      const data = JSON.parse(JSON.stringify(pricingPlanResult));
      res.status(200).json({
        data: data[0],
        message: "property By ID",
      });
    } else {
      res.status(400).json({
        message: "No data found",
      });
    }
  } catch (error) {
    res.send("Error Get Property By ID");
    console.log(error);
  }
};
//  ############################# Get Pricing Plan End ############################################################

//  ############################# Property Start ############################################################

// exports.property = async (req, res) => {
//   const {
//     // landlordID,
//     propertyName,
//     address,
//     city,
//     state,
//     zipCode,
//     propertyType,
//     propertySQFT,
//     units,
//     images,

//   } = req.body;
//   try {
//     // const { userId } = req.user;
//     const { userId, email } = req.user;
//     // if (
//     //   !propertyName ||
//     //   !address ||
//     //   !city ||
//     //   !state ||
//     //   !zipCode ||
//     //   !propertyType ||
//     //   !propertySQFT ||
//     //   !units

//     // ) {
//     //   // throw new Error("Please fill all the fields");
//     //   res.status(200).json({
//     //     message: "Please fill all the fields",
//     //   });
//     // }
//     const currentDate = new Date();
//     // this line check property already exist or not
//     const propertycheckresult = await queryRunner(
//       selectQuery("property", "propertyName", "address"),
//       [propertyName, address]
//     );
//     if (propertycheckresult[0].length > 0) {
//       // throw new Error("Property Already Exist");
//       res.status(200).json({
//         message: "Property Already Exist",
//       });
//     }
//     // console.log("1");
//     const status = "Non-active";
//     console.log(userId);
//     // this line insert data into property table
//     const propertyResult = await queryRunner(insertInProperty, [
//       userId,
//       propertyName,
//       address,
//       city,
//       state,
//       zipCode,
//       propertyType,
//       propertySQFT,
//       status,
//       units,
//       currentDate
//     ]);
//     // console.log("2");
//     // if property data not inserted into property table then throw error
//     if (propertyResult.affectedRows === 0) {
//       // throw new Error("Data doesn't inserted in property table");
//       res.status(200).json({
//         message: "Data doesn't inserted in property table",
//       });
//     }
//     if (propertyResult[0].affectedRows > 0) {
//       const mailSubject = "Property Maintenance: " + propertyName;
//       const landlordUser = await queryRunner(selectQuery("users", "id"), [
//         userId,
//       ]);
//       const FullName =
//         landlordUser[0][0].FirstName + " " + landlordUser[0][0].LastName;
//       // await taskSendMail("tenantName", mailSubject, "dueDate", FullName, "property", "assignedTo", "priority", "companyName", "contactLandlord", userId, email);
//     }
//     const { insertId } = propertyResult[0];
//     // we are using loop to send images data into

//     for (let i = 0; i < images.length; i++) {
//       const { image_url } = images[i];
//       const { image_key } = images[i];
//       const propertyImageResult = await queryRunner(insertInPropertyImage, [
//         insertId,
//         image_url,
//         image_key,
//       ]);

//       if (propertyImageResult.affectedRows === 0) {
//         return res.status(400).json({
//           message: "data doesn't inserted in property image table",
//         });
//       }
//     }

//     // we are using loop to send units data into database
//     for (let i = 0; i < units; i++) {
//       const propertyResult = await queryRunner(insertInPropertyUnits, [
//         insertId,
//         "",
//         "",
//         "",
//         "Vacant",
//       ]);
//       // if property units data not inserted into property units table then throw error
//       if (propertyResult.affectedRows === 0) {
//         // throw new Error("data doesn't inserted in property units table");
//         res.status(200).json({
//           message: "data doesn't inserted in property units table",
//         });
//       }
//     }
//     // if everything is ok then send message and property id
//     res.status(200).json({
//       message: "Property created successful",
//       propertyId: propertyResult[0].insertId,
//     });
//   } catch (error) {
//     res.status(400).json({
//       message: "Error",
//       error: error.message,
//     });
//   }
// };
exports.property = async (req, res) => {
  const {
    propertyName,
    address,
    city,
    state,
    zipCode,
    propertyType,
    propertySQFT,
    units,
    images,
  } = req.body;
  try {
    const { userId, email,paidUnits,userName, idPattern } = req.user;
    // const { userId, email,paidUnits,userName } = req.body;
    if (
      !propertyName ||
      !address ||
      !city ||
      !state ||
      !zipCode ||
      !propertyType ||
      !propertySQFT ||
      !units
    ) {
      throw new Error("Please fill all the fields");
    }
    const currentDate = new Date();
    // this line check property already exist or not
    const propertycheckresult = await queryRunner( checkProperty,[propertyName, address,userId]);
    if (propertycheckresult[0].length > 0) {
      throw new Error("Property Already Exist");
    }
    const status = "Non-active";
    const propertyIdCheckresult = await queryRunner(checkPropertyid, [userId]);
    let propertyId;
    if (propertyIdCheckresult[0].length > 0) {
      propertyId = propertyIdCheckresult[0][0].cPropertyId.split("-");
      let lastPart = parseInt(propertyId[propertyId.length - 1], 10) + 1;
      lastPart = lastPart.toString().padStart(4, '0');
      propertyId = `SR-${idPattern}-PROP-${lastPart}`;
    } else {
      propertyId = `SR-${idPattern}-PROP-0001`;
    }
    // this line insert data into property table
    const propertyResult = await queryRunner(insertInProperty, [
      userId,
      propertyName,
      address,
      city,
      state,
      zipCode,
      propertyType,
      propertySQFT,
      status,
      units,
      currentDate,
      propertyId
    ]);
    // console.log("2");
    // if property data not inserted into property table then throw error
    if (propertyResult.affectedRows === 0) {
      throw new Error("Data doesn't inserted in property table");
    }
    const { insertId } = propertyResult[0];
    // we are using loop to send images data into
    for (let i = 0; i < images.length; i++) {
      const { image_url } = images[i];
      const { image_key } = images[i];
      const propertyImageResult = await queryRunner(insertInPropertyImage, [
        insertId,
        image_url,
        image_key,
      ]);
      // if property image data not inserted into property image table then throw error
      if (propertyImageResult.affectedRows === 0) {
        throw new Error("data doesn't inserted in property image table");
      }
    }
    // we are using loop to send units data into database
    for (let i = 0; i < units; i++) {
      const propertyResult = await queryRunner(insertInPropertyUnits, [
        insertId,
        "",
        "",
        "",
        "Vacant",
        userId,
      ]);
      // paidUnits
      // if property units data not inserted into property units table then throw error
      if (propertyResult.affectedRows === 0) {
        throw new Error("data doesn't inserted in property units table");
      }
    }
    const unitCount = paidUnits + units;
    const propertyUnitCountResult = await queryRunner(UpdatePropertyUnitCount, [unitCount,userId]);
    const pAddress = address+","+city+","+state+","+zipCode;
    const mailSubject = "New Property Added";
    await propertyMail(propertyName,pAddress,propertyType,propertySQFT,units,userName,mailSubject,email )
    
    // const propertyCountIdResult = await queryRunner(propertyCount, [userId]);
    // let customPropertyId = propertyCountIdResult[0][0].count + 1;
    // customPropertyId = propertyName+customPropertyId;
    // const propertyIdUpdateResult = await queryRunner(propertyIdUpdate ,[customPropertyId, propertyResult[0].insertId]);
    res.status(200).json({
      message: "Property created successful!!!",
      propertyId: propertyResult[0].insertId,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error",
      error: error.message,
    });
    console.log(error);
  }
};

//  ############################# Property End ############################################################

//  ############################# Get Property Start ############################################################

exports.getproperty = async (req, res) => {
  const { userId, userName } = req.user;
  try {
    const allPropertyResult = await queryRunner(
      selectQuery("property", "landlordID"),
      [userId]
    );
    if (allPropertyResult.length > 0) {
      for (var i = 0; i < allPropertyResult[0].length; i++) {
        const propertyID = allPropertyResult[0][i].id;
        // Retrieve property images for the current property ID

        const propertyUnitCountResult = await queryRunner(propertyUnitCount , [propertyID]);
        if (propertyUnitCountResult[0].length > 0) {
        
        allPropertyResult[0][i].NumberCount = propertyUnitCountResult[0][0];
        }else{
          allPropertyResult[0][i].NumberCount = ["no unit"];
        }
        const allPropertyImageResult = await queryRunner(
          selectQuery("propertyimage", "propertyID"),
          [propertyID]
        );
        if (allPropertyImageResult.length > 0) {
          const propertyImages = allPropertyImageResult[0].map((image) => {
            return { imageURL: image.Image, imageKey: image.ImageKey };
          });
          // Extract image URLs from the result
          allPropertyResult[0][i].images = propertyImages; // Add property images to the current property object
        } else {
          allPropertyResult[0][i].images = ["no Image"]; // Set empty array if no property images found
        }
      }

      res.status(200).json({
        // data: length,
        user: userName,
        data: allPropertyResult,
        user: userName,
        message: "All properties",
      });
      // }
    } else {
      res.status(404).json({
        message: "No Property data found",
      });
    }
  } catch (error) {
    res.send("Error Get Property "+ error );
  }
};

//  ############################# Get Property End ############################################################

//  ############################# Get Property ByID Start ############################################################
exports.getpropertyByID = async (req, res) => {
  try {
    const { userId } = req.user;
    // const propertycheckresult = await queryRunner(selectQuery("property","propertyName","address"),[propertyName,address])
    const PropertyByIDResult = await queryRunner(
      selectQuery("property", "id"),
      [id]
    );
    if (PropertyByIDResult.length > 0) {
      const data = JSON.parse(JSON.stringify(PropertyByIDResult));
      res.status(200).json({
        data: data,
        message: "property By ID",
      });
    } else {
      res.status(400).json({
        message: "No data found",
      });
    }
  } catch (error) {
    res.send("Error Get Property By ID");
    // console.log(req.body)
    console.log(error);
  }
};
//  ############################# Get Property ByID End ############################################################

//  ############################# Delete Property Start ############################################################
exports.propertyDelete = async (req, res) => {
  const { id } = req.body;
  const { userId } = req.user;
  // const { userId } = req.body;
  try {
    const propertyUnitscheckresult = await queryRunner(
      selectQuery("propertyunits", "propertyID","status"),
      [id, "Occupied"]
    );
    if (propertyUnitscheckresult[0].length > 0) {
      res.status(403).json({
        message: " You are not able to delete Property (your unit is occupied)",
        units : propertyUnitscheckresult[0],
      });
      } else{
    const PropertyDeleteResult = await queryRunner(
      deleteQuery("property", "id"),
      [id]
    );
    if (PropertyDeleteResult[0].affectedRows > 0) {
      const PropertyUnitDeleteResult = await queryRunner(
        deleteQuery("propertyunits", "propertyID"),
        [id]
      );
      const propertycheckresult = await queryRunner(
        selectQuery("propertyimage", "propertyID"),
        [id]
      );
      // console.log(propertycheckresult);
      if (propertycheckresult[0].length > 0) {
        propertyimages = propertycheckresult[0].map((image) => image.Image);
        // delete folder images
        imageToDelete(propertyimages);
        const propertyImageDeleteresult = await queryRunner(
          deleteQuery("propertyimage", "propertyID"),
          [id]
        );
        const propertyUnitsCountResult = await queryRunner(UnitCounts,[userId]);
        const count = propertyUnitsCountResult[0][0].count;
        const propertyUnitCountResult = await queryRunner(UpdatePropertyUnitCount, [count,userId]);
        // if (propertyDeleteresult[0].affectedRows > 0) {
          
        // }
      } 
      res.status(200).json({
        message: " Property deleted successfully",
      });
    } else {
      res.status(400).json({
        message: "No data found",
      });
      // console.log(PropertyDeleteResult)
    }
  }
  } catch (error) {
    res.send("Error from delete Property ");
    // console.log(req.body)
    console.log(error);
  }
};
//  ############################# Delete Property End ############################################################

//  ############################# Update Property Start ############################################################

exports.propertyUpdate = async (req, res) => {
  try {
    const {
      propertyName,
      address,
      city,
      state,
      zipCode,
      propertyType,
      propertySQFT,
      status,
      id,
      units,
      images,
    } = req.body;
    const { userId } = req.user;
    // const { userId } = req.body;
    const updateData = [
      userId,
      propertyName,
      address,
      city,
      state,
      zipCode,
      propertyType,
      propertySQFT,
      "Active",
      units,
      id,
    ];
    const updatedPropertyData = await queryRunner(updateProperty, updateData);

    if (updatedPropertyData[0].affectedRows) {
      // Get property images from the database
      const propertycheckresult = await queryRunner(
        selectQuery("propertyimage", "propertyID"),
        [id]
      );
      // console.log(images, propertycheckresult[0])
      // Extract the image keys from propertycheckresult
      const propertyImageKeys = propertycheckresult[0].map(
        (image) => image.ImageKey
      );
      console.log(propertyImageKeys);
      // Find the images to delete from S3 (present in propertycheckresult but not in images)
      const imagesToDelete = propertycheckresult[0].filter(
        (image) => !images.some((img) => img.imageKey === image.ImageKey)
      );
      // Delete images from S3
      for (let i = 0; i < imagesToDelete.length; i++) {
        deleteImageFromS3(imagesToDelete[i].ImageKey);
        await queryRunner(delteImageFromDb, [imagesToDelete[i].ImageKey]);
      }
      // Find the images to insert into the database (present in images but not in propertycheckresult)
      const imagesToInsert = images.filter(
        (image) => !propertyImageKeys.includes(image.imageKey)
      );
      // Delete images from the database
      // Insert new images into the database
      await userServices.addImagesInDB(imagesToInsert, id);

      res.status(200).json({
        message: "Property Updated Successfully!",
      });
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({
      message: error.message,
    });
  }
};

// try {
//   const {
//     // existingImages,
//     propertyName,
//     address,
//     city,
//     state,
//     zipCode,
//     propertyType,
//     propertySQFT,
//     status,
//     id,
//     units,
//     images,
//   } = req.body;
//   const { userId } = req.user;
//   // console.log(`step : 2 send all values data into database`);
//   // const propertyUpdateResult = await queryRunner(updateProperty, [
//   //   userId,
//   //   propertyName,
//   //   address,
//   //   city,
//   //   state,
//   //   zipCode,
//   //   propertyType,
//   //   propertySQFT,
//   //   "Active",
//   //   units,
//   //   id,
//   // ]);

//   console.log(propertycheckresult , "propertycheckresult")
//   if (propertyUpdateResult[0].affectedRows > 0) {
//     // console.log(`step : 3 check property images into database propertyid = ${id}`);
//     // check property images into database propertyid = ${id}
//     const propertycheckresult = await queryRunner(
//       selectQuery("propertyimage", "propertyID"),
//       [id]
//     );

//     if (propertycheckresult.length > 0) {
//       // propertyimages = propertycheckresult[0].map((image) => image.Image);
//       // let existingImg = existingImages.split(",");
//       // const imagesToDelete = propertyimages.filter(
//       //   (element) => !existingImg.includes(element)
//       // );

//       // // Combine the common elements with array2

//       // imageToDelete(imagesToDelete);
//       // let propertyDeleteresult = [{ affectedRows: 0 }];
//       // // delete images Data into database
//       // if (imagesToDelete.length > 0) {
//       for (let i = 0; i < images.length; i++) {
//         const image = images[i].image_url;
//         propertyDeleteresult = await queryRunner(
//           deleteQuery("propertyimage", "Image"), [image]);
//         // console.log(propertyDeleteresult)
//       }
//       // }

//       // console.log(`step : 4 delete previous images data into database propertyid = ${id}`);
//       // console.log(propertyDeleteresult)
//       // if (propertyDeleteresult[0].affectedRows > 0) {

//       const fileNames = images;
//       // existingImg = [...fileNames];
//       // using loop to send new images data into database
//       for (let i = 0; i < fileNames.length; i++) {
//         // const img = existingImg[i];
//         const image = images[i].image_url;
//         const key = images[i].image_key;
//         const propertyImageResult = await queryRunner(insertInPropertyImage, [
//           id,
//           image,
//           key
//         ]);
//         if (propertyImageResult.affectedRows === 0) {
//           return res.send("Error2");
//         }
//       }

//       return res.status(201).json({
//         message: "Form Submited",
//       });
//     } else {
//       return res.status(400).json({
//         message: "No Property data found",
//       });
//     }
//   } else {
//     return res.status(400).json({
//       message: "No Property",
//     });
//   }

// } catch (error) {
//   console.log(error);
//   return res.send("Error from Updating Property");
// }

//  ############################# Update Property End ############################################################

//  ############################# View Property Start ############################################################
exports.propertyView = async (req, res) => {
  try {
    const { propertyId } = req.query;
    // const { propertyId } = req.body;
    const propertyViewResult = await queryRunner(
      selectQuery("property", "id"),
      [propertyId]
    );
    if (propertyViewResult.length > 0) {



      const propertyUnitCountResult = await queryRunner(propertyUnitCount , [propertyId]);
        if (propertyUnitCountResult[0].length > 0) {
        propertyViewResult[0][0].NumberCount = propertyUnitCountResult[0][0];
        }else{
          propertyViewResult[0][0].NumberCount = ["no unit"];
        }
      // check property Images in database
      const propertyViewImageResult = await queryRunner(
        selectQuery("propertyimage", "propertyID"),
        [propertyId]
      );
      if (propertyViewImageResult.length > 0) {
        // Property Data
        const propertyData = propertyViewResult[0];

        // Property Image Data
        const imageData = propertyViewImageResult[0];

        const propertiesWithImages = propertyData.map((property) => {
          const matchingImages = imageData.filter(
            (image) => image.propertyID === property.id.toString()
          );
          const images = matchingImages.map((image) => ({
            propertyID: image.propertyID,
            image_url: image.Image,
            image_key: image.ImageKey,
          }));
          return {
            ...property,
            images,
          };
        });
        // console.log(propertiesWithImages[0].images)
        const finalResult = propertiesWithImages[0];
        res.status(200).json({
          data: finalResult,
        });
      } else {
        res.status(400).json({
          message: "No Image data found",
        });
      }
    } else {
      res.status(400).json({
        message: "No Property data found",
      });
    }
  } catch (error) {
    res.send("Error from Viewing Property "+ error);
    // console.log(req.body)
    console.log(error);
  }
};
//  ############################# View Property End ############################################################

//  ############################# Get Property Units Start ############################################################
// exports.getpropertyUnits = async (req, res) => {
//   try {
//     const { id } = req.body
//     const propertyUnitsResult = await queryRunner(selectQuery("propertyunits", "propertyID"), [id]);
//     if (propertyUnitsResult.length > 0) {
//       res.status(200).json({
//         data: propertyUnitsResult,
//         message: "property Units"
//       })
//     } else {
//       res.status(400).json({
//         message: "No data found"
//       })
//     }
//   } catch (error) {
//     res.send("Error Get Property Units");
//     console.log(req.body)
//     console.log(error)
//   }
// }
//  ############################# Get Property Units End ############################################################

//  ############################# Update Property Units Start ############################################################
exports.putPropertyUnitsUpdates = async (req, res) => {
  try {
    const { id, propertyId, unitNumber, Area, unitDetails } = req.body;
    // console.log(id, propertyID, unitNumber, Area, unitDetails)
    // let status = "Vacant";
    const propertyUnitsResult = await queryRunner(updatePropertyUnits, [
      unitNumber,
      Area,
      unitDetails,
      // status,
      id,
      propertyId,
    ]);
    if (propertyUnitsResult[0].affectedRows > 0) {
      res.status(200).json({
        data: propertyUnitsResult,
        message: "property Units updated successful",
      });
    } else {
      res.status(400).json({
        message: "No data found",
      });
    }
  } catch (error) {
    console.log(error);
    res.send("Error Get Property Units update");
  }
};
//  ############################# update Property Units End ############################################################

//  #############################  Property Units End Start ############################################################
exports.getPropertyUnitsTenant = async (req, res) => {
  // console.log(req,res)
  try {
    const { userId, userName } = req.user;
    // console.log(userName)
    const getPropertyUnitsTenantResult = await queryRunner(
      selectQuery("property", "landlordID"),
      [userId]
    );
    if (getPropertyUnitsTenantResult[0].length > 0) {
      for (let item of getPropertyUnitsTenantResult[0]) {
        if (item.units > 0) {
          const getPropertyUnitsVacantResult = await queryRunner(
            PropertyUnitsVacant,
            [item.id, "Vacant"]
          );
          const getPropertyUnitsOccupiedResult = await queryRunner(
            selectQuery("propertyunits", "propertyID", "status"),
            [item.id, "Occupied"]
          );

          item.vacantUnits = getPropertyUnitsVacantResult[0];
          item.occupiedUnits = getPropertyUnitsOccupiedResult[0];
        } else {
          item.vacantUnits = [];
          item.occupiedUnits = [];
        }
      }

      res.status(200).json({
        data: getPropertyUnitsTenantResult[0],
        user: userName,
        message: "Get Property Units Tenant",
      });
    } else {
      res.status(404).json({
        message: "No data found",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error occurred while getting property units tenant",
     error: error.message
    });
  }
};
//  #############################  Property Units End ############################################################

//  ############################# View Property End ############################################################
// exports.getpropertyUnits = async (req, res) => {
//   try {
//     const { propertyId } = req.query;
//     // console.log(req.body,req.query,1)
//     const property = await queryRunner(selectQuery("property", "id"), [
//       propertyId,
//     ]);
//     const propertyUnitsResult = await queryRunner(
//       selectQuery("propertyunits", "propertyID"),
//       [propertyId]
//     );
//     // console.log(propertyUnitsResult)
//     if (propertyUnitsResult.length > 0) {
//       // propertyUnitsResult.append(property[0][0])
//       // console.log(property[0][0].propertyName);
//       res.status(200).json({
//         data: propertyUnitsResult,
//         propertyName: property[0][0]?.propertyName,
//         propertyAddress: property[0][0].address,
//         message: "property Units",
//       });
//     } else {
//       res.status(400).json({
//         message: "No data found",
//       });
//     }
//   } catch (error) {
//     res.send("Error Get Property Units");
//     // console.log(req.body);
//     console.log(error);
//   }
// };
//  ############################# Get Property Units End ############################################################

//  ############################# Get Property and tenant data Start ############################################################
exports.getPropertyTenant = async (req, res) => {
  try {
    const { userId } = req.user;

    const getPropertyUnitsTenantResult = await queryRunner(
      selectQuery("property", "landlordID"),
      [userId]
    );

    if (getPropertyUnitsTenantResult[0].length > 0) {
      for (let item of getPropertyUnitsTenantResult[0]) {
        if (item.units > 0) {
          const getPropertyUnitsVacantResult = await queryRunner(
            selectQuery("propertyunits", "propertyID", "status"),
            [item.id, "Vacant"]
          );
          const getPropertyUnitsOccupiedResult = await queryRunner(
            selectQuery("propertyunits", "propertyID", "status"),
            [item.id, "Occupied"]
          );

          item.vacantUnits = getPropertyUnitsVacantResult[0];
          item.occupiedUnits = getPropertyUnitsOccupiedResult[0];
        } else {
          item.vacantUnits = [];
          item.occupiedUnits = [];
        }
      }

      res.status(200).json({
        data: getPropertyUnitsTenantResult[0],
        message: "Get Property Units Tenant",
      });
    } else {
      res.status(400).json({
        message: "No data found",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error occurred while getting property units tenant",
      error: error.message
    });
  }
};

//  #############################  Property Units End ############################################################

//  ############################# View Property End ############################################################
exports.getpropertyUnits = async (req, res) => {
  try {
    const { propertyId } = req.query;
    // const { propertyId } = req.body;
    // console.log(req.body,req.query,1)
    const property = await queryRunner(selectQuery("property", "id"), [
      propertyId,
    ]);
    const propertyUnitsResult = await queryRunner(
      selectQuery("propertyunits", "propertyID"),
      [propertyId]
    );
    if (propertyUnitsResult.length > 0) {
      res.status(200).json({
        data: propertyUnitsResult,
        propertyName: property[0][0]?.propertyName,
        propertyAddress: property[0][0].address,
        message: "property Units",
      });
    } else {
      res.status(404).json({
        message: "No data found",
      });
    }
  } catch (error) {
    res.send("Error Get Property Units");
    // console.log(req.body);
    console.log(error);
  }
};
//  ############################# Get Property Units End ############################################################

//  ############################# Get Property and tenant data Start ############################################################
exports.viewPropertyTenant = async (req, res) => {
  try {
    const { userId, userName } = req.user;
    const { id } = req.query;
    // const { id } = req.body;
    let PropertyTenantResult;
    PropertyTenantResult = await queryRunner(selectAllTenantsProperty, [id]);
    if (PropertyTenantResult[0].length > 0) {
      for (let i = 0; i < PropertyTenantResult[0].length; i++) {
        const tenantID = PropertyTenantResult[0][i].tenantID;
        const tenantIncreaseResult = await queryRunner(
          selectQuery("tenantincreaserent", "tenantID"),
          [tenantID]
        );
        if (tenantIncreaseResult[0].length > 0) {
          const tenantIncrease = tenantIncreaseResult[0].map((data) => ({
            date: data.date,
            increaseRentAmount: data.increaseRentAmount,
          }));
          PropertyTenantResult[0][i].increaseRentAmount = tenantIncrease;
        } else {
          PropertyTenantResult[0][i].increaseRentAmount = [
            "No tenant Increase",
          ];
        }
      }
      res.status(200).json({
        data: PropertyTenantResult,
        message: "Property Tenant ",
        user: userName,
      });
    } else {
      res.status(404).json({
        message: "No data found",
      });
    }
  } catch (error) {
    res.send("Error Get Property Tenant data");
    console.log(error);
  }
};

exports.viewAllPropertyTenant = async (req, res) => {
  try {
    const { userId, userName } = req.user;
    // const { userId, userName } = req.body;
    let PropertyTenantResult;
    // console.log(id)
    PropertyTenantResult = await queryRunner(selectAllTenants, [userId]);
    // console.log(PropertyTenantResult[0]);
    if (PropertyTenantResult[0].length > 0) {
      for (let i = 0; i < PropertyTenantResult[0].length; i++) {
        const tenantID = PropertyTenantResult[0][i].tenantID;
        const tenantIncreaseResult = await queryRunner(
          selectQuery("tenantincreaserent", "tenantID"),
          [tenantID]
        );
        if (tenantIncreaseResult[0].length > 0) {
          const tenantIncrease = tenantIncreaseResult[0].map((data) => ({
            date: data.date,
            increaseRentAmount: data.increaseRentAmount,
          }));
          PropertyTenantResult[0][i].increaseRentAmount = tenantIncrease;
        } else {
          PropertyTenantResult[0][i].increaseRentAmount = [
            "No tenant Increase",
          ];
        }
        // Unread messages is start 
        // const chatCount = 0;
        const chatCountResult = await queryRunner(getMessageCountByID ,[userId, tenantID]);
        // console.log(userId, tenantID);
        if (chatCountResult[0].length > 0) {
          PropertyTenantResult[0][i].messageCount = chatCountResult[0][0];
      }
      // else{
      //   PropertyTenantResult[0][i].messageCount = chatCount;
      // }
      }
      //  ddddd
      res.status(200).json({
        data: PropertyTenantResult,
        message: "Property Tenant ",
        user: userName,
      });
    } else {
      res.status(404).json({
        message: "No data found",
      });
    }
  } catch (error) {
    res.send("Error Get Property Tenant data" + error);
    // console.log(error);
  }
};
//  ############################# Get Property and tenant data End ############################################################

//  ############################# Add more property units Start ############################################################
exports.addMoreUnits = async (req, res) => {
  const { propertyID } = req.body;
  const { userId,paidUnits } = req.user;
 
  try {
    const checkPropertyUnitResult = await queryRunner(checkPropertyUnitQuery,[propertyID]);
    console.log(checkPropertyUnitResult[0])
    if (checkPropertyUnitResult[0].length > 0){
      const propertyUnitResult = await queryRunner(insertInPropertyUnits, [
        propertyID,
        "",
        "",
        "",
        "Vacant",
        userId
      ]);
      if (propertyUnitResult[0].affectedRows > 0) {
        const selectaddMoreUnitsResult = await queryRunner(getUnitsCount, [
          propertyID,
        ]);
        if (selectaddMoreUnitsResult[0].length > 0) {
          const unitCount = selectaddMoreUnitsResult[0][0].unitCount;
          const updateaddMoreUnitsResult = await queryRunner(putUnitsUpdate, [
            unitCount,
            propertyID,
          ]);
          const unitCountLandlord = paidUnits + 1;
          const propertyUnitCountResult = await queryRunner(UpdatePropertyUnitCount, [unitCountLandlord,userId]);
          
          if (updateaddMoreUnitsResult[0].affectedRows > 0) {
            res.status(200).json({
              data: unitCount,
              message: "total unit",
            });
          } else {
            res.status(400).json({
              message: "Error occurs in Updating unit in database",
            });
          }
        }
      } else {
        res.status(400).json({
          message: "Unit not inserted",
        });
      }
    }else{
      res.status(200).json({
        message: "Your property type is Single Family",
      });
    }

    


  } catch (error) {
    // console.error("Error:", error);
    res.status(500).json({ message: "Error", error: error.message });;
  }
};

//  ############################# Add more property units End ############################################################

//  ############################# Delete property units Start ############################################################
exports.deleteMoreUnits = async (req, res) => {
  const { unitID, propertyID } = req.body;
  const { userId,paidUnits } = req.user;
  try {
    // const propertyUnitResult = await queryRunner(insertInPropertyUnits, [propertyID, "", "", "", "Vacant"]);
    const unitDeleteResult = await queryRunner(
      deleteQuery("propertyunits", "id"),
      [unitID]
    );

    if (unitDeleteResult[0].affectedRows > 0) {
      const selectaddMoreUnitsResult = await queryRunner(getUnitsCount, [
        propertyID,
      ]);
      if (selectaddMoreUnitsResult[0].length > 0) {
        const unitCount = selectaddMoreUnitsResult[0][0].unitCount;
        const updateaddMoreUnitsResult = await queryRunner(putUnitsUpdate, [
          unitCount,
          propertyID,
        ]);
        const unitCountLandlord = paidUnits - 1;
        const propertyUnitCountResult = await queryRunner(UpdatePropertyUnitCount, [unitCountLandlord,userId]);
        
        // console.log(updateaddMoreUnitsResult);
        if (updateaddMoreUnitsResult[0].affectedRows > 0) {
          res.status(200).json({
            data: unitCount,
            message: "total unit",
          });
        } else {
          res.status(400).json({
            message: "Error occurs in Updating unit in database",
          });
        }
      }
    } else {
      res.status(400).json({
        message: "Unit not inserted",
      });
    }
  } catch (error) {
    // console.error("Error:", error);
    res.status(500).json({ message: "Error", error: error.message });
  }
};
//  ############################# Delete property units End ############################################################

//  ############################# Get property States End ############################################################
exports.getStates = async (req, res) => {
  try {
    const statesResult = await queryRunner(selectQuery("propertystates"));
    console.log(statesResult[0]);
    if (statesResult[0].length > 0) {
      res.status(200).json({
        data: statesResult[0],
        message: "ALL USA STATES",
      });
    } else {
      res.status(400).json({
        message: "No States data found",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
    // console.log(error);
  }
};
//  ############################# Get Property States End ############################################################

//  ############################# Task property ############################################################
exports.propertyTask = async (req, res) => {
  const { Id } = req.query;
  // const { Id } = req.body;
console.log(Id)
  try {
    const taskByIDResult = await queryRunner(propertyTaskQuery, [Id]);
    if (taskByIDResult[0].length > 0) {
      for (let j = 0; j < taskByIDResult[0].length; j++) {
        const taskID = taskByIDResult[0][j].id;
        const TaskImagesResult = await queryRunner(
          selectQuery("taskimages", "taskID"),
          [taskID]
        );
        // this is for task images
        if (TaskImagesResult[0].length > 0) {
          const taskImages = TaskImagesResult[0].map(
            (image) => image
          );
          taskByIDResult[0][j].taskImages = taskImages;
        } else {
          taskByIDResult[0][j].taskImages = [];
        }
        const TaskAssignToResult = await queryRunner(
          selectQuery("taskassignto", "taskId"),
          [taskID]
        );
        const vendorIDs = TaskAssignToResult[0].map(
          (vendorID) => vendorID.vendorId
        );
        const vendorData = [];
        for (let i = 0; i < vendorIDs.length; i++) {
          const vID = vendorIDs[i];
          const vendorResult = await queryRunner(selectQuery("vendor", "id"), [
            vID,
          ]);
          console.log(vendorResult[0])
          if (vendorResult[0].length > 0) {
            const categoryIDs = vendorResult[0] [0].categoryID;
            const VendorCategoryResult = await queryRunner(
              selectQuery("vendorcategory", "id"),
              [categoryIDs]
            );
            if (VendorCategoryResult[0].length > 0) {
              const vendorDataObject = {
                name:
                  vendorResult[0][0].firstName +
                  " " +
                  vendorResult[0][0].lastName,
                businessName: vendorResult[0][0].businessName,
                streetAddress: vendorResult[0][0].streetAddress,
                workNumber: vendorResult[0][0].workNumber,
                mobileNumber: vendorResult[0][0].mobileNumber,
                email: vendorResult[0][0].email,
                category: VendorCategoryResult[0][0].category,
                ID: vendorResult[0][0].id,
              };
              vendorData.push(vendorDataObject);
            } else {
              vendorData.push(["No Vendor Data Found"]);
            }
          }
        }
        taskByIDResult[0][j].vendor = vendorData;
      }
      res.status(200).json({
        data: taskByIDResult,
        message: "Task data retrieved successfully",
      });
    } else {
      res.status(404).json({
        message: "No property Task data found",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
}
};

//  ############################# Task property ############################################################

//  ############################# Tenant verify Mail Check Start  ############################################################

exports.verifyMailCheck = async (req, res) => {
  const { email } = req.user;
  console.log(email);
  try {
    const selectTenantResult = await queryRunner(
      selectQuery("users", "Email"),
      [email]
    );
    if (selectTenantResult[0].length > 0) {
      const createdDate = new Date(selectTenantResult[0][0].created_at);
      const newDate = new Date(createdDate.getTime());
      newDate.setDate(newDate.getDate() + 7); // Adding 7 days to the createdDate

      const currentDate = new Date();
      if (selectTenantResult[0][0].userVerified == "Email Verified") {
        res.status(200).json({
          message: "Email is verified",
        });
      } else {
        if (currentDate <= newDate) {
          const differenceInMilliseconds = newDate - currentDate;
          const differenceInDays = Math.ceil(
            differenceInMilliseconds / (1000 * 60 * 60 * 24)
          );

          if (differenceInDays === 0) {
            return res.status(200).json({
              message: `Today is your last day, so kindly verify your email.`,
              date: createdDate,
            });
          } else {
            return res.status(200).json({
              message: `Your remaining days to verify your email: ${differenceInDays}`,
              data: differenceInDays,
              createdDate: createdDate,
              newDate: newDate,
              currentDate: currentDate,
            });
          }
        } else {
          return res.status(423).json({
            message: `Your account is locked due to email verification. Please verify your email.`,
          });
        }
      }
    } else {
      return res.status(400).send("landlord is not found");
    }
  } catch (error) {
    res.status(500).json({ message: "Error occurred while verifying the landlord's email", error: error.message });
  }
};

//  ############################# Tenant verify Mail Check END  ############################################################

//  ############################# Email Start ############################################################
exports.emailUpdate = async (req, res) => {
  const { id, email } = req.body;
  try {
    const userCheckResult = await queryRunner(selectQuery("users", "id"), [id]);

    if (userCheckResult[0].length > 0) {
      const emailExist = userCheckResult[0][0].Email;
      // console.log(userCheckResult[0]);
      console.log(emailExist);
      const emailResult = await queryRunner(updateEmailQuery, [
        email,
        emailExist,
      ]);
      if (emailResult[0].affectedRows > 0) {
        return res.status(200).json({
          message: " Email updated successful ",
        });
      } else {
        return res.status(400).send("Error1");
      }
    } else {
      return res.send("User is not found");
    }
  } catch (error) {
    res.status(500).json({ message: "Error Get Email updated landlord", error: error.message });
    console.log(error);
  }
};
//  ############################# Email End ############################################################

//  ############################# verify Email Update Start ############################################################
//  ############################# verify Email Update Start ############################################################
exports.verifyEmailUpdate = async (req, res) => {
  const { id, token, email, password } = req.body;
  const status = "Email Verified";
  try {
    const userCheckResult = await queryRunner(selectQuery("users", "id"), [id]);

    if (userCheckResult[0].length > 0) {
      const emailExist = userCheckResult[0][0].Email;
      const existToken = userCheckResult[0][0].token;
      if (token == existToken) {
        const emailResult = await queryRunner(updateVerifiedStatusQuery, [
          status,
          id,
        ]);
        if (emailResult.affectedRows === 0) {
          return res.status(400).send("Email Verified status is not updated");
        } else {
          const id=userCheckResult[0][0].id
          const token = jwt.sign({ email, id }, config.JWT_SECRET_KEY, {
            expiresIn: "3h",
          });

          return res.status(200).json({
            token: token,
            message: " Email verified successful ",
          });
        }
      } else {
        return res.status(401).json({
          message: " token code is not match ",
        });
      }
    } else {
      return res.send("User is not found");
    }
  } catch (error) {
    res.status(500).json({ message: "Error Get Email Verified updated landlord", error: error.message });
  }
};
//  ############################# verify Email Update End ############################################################
//  ############################# verify Email Update End ############################################################
exports.updatedNotification = async (req, res) => {
  const { isEmailNotify, isPushNotify } = req.body;
  const { userId } = req.user;
  try {
    const updateNotifyResult = await queryRunner(updateNotify, [
      isEmailNotify,
      isPushNotify,
      userId,
    ]);
    if (updateNotifyResult[0].affectedRows > 0) {
      return res.status(200).json({
        email:
          isEmailNotify === "yes"
            ? "Email notifications enabled"
            : "Email notifications disabled",
        push:
          isPushNotify === "yes"
            ? "push notifications enabled"
            : "push notifications disabled",
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
// get All property data
exports.getAllProperty = async (req, res) => {
  try {
    const { userId } = req.user;
    // const { userId } = req.body;
    const getAllPropertyData = await queryRunner(getPropertyReport, [userId]);
    const getTenantsReport = await queryRunner(getTenantReport, [userId]);
    const getLeaseReportData = await queryRunner(getLeaseReport, [userId]);
    res.status(200).json({
      property: getAllPropertyData[0],
      tenants: getTenantsReport[0],
      lease: getLeaseReportData[0],
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
// getLeaseReport getInvoiceReportData getTaskReportData getTenantReport  getPropertyReport

exports.getTaskReportData = async (req, res) => {
  try {
    const { userId } = req.user;
    // const { userId } = req.body;
    const getAllPropertyData = await queryRunner(getTaskReportData, [userId]);
    // console.log(getAllPropertyData);
    res.status(200).json({
      property: getAllPropertyData,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
exports.getInvoiceReportData = async (req, res) => {
  try {
    const { userId } = req.user;
    const getAllPropertyData = await queryRunner(getInvoiceReportData, [
      userId,
    ]);

    res.status(200).json({
      property: getAllPropertyData[0],
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
// exports.checkAllTenantsPaid = async (req, res) => {
//   try {
//     const { userId, email } = req.user;
//     const { password } = req.query;
//     console.log(req.query);

//     const selectResult = await queryRunner(selectQuery("users", "Email"), [
//       email,
//     ]);
//     const isMatchPwd = await bcrypt.compare(
//       password,
//       selectResult[0][0].Password
//     );
//     console.log(Boolean());
//     if (isMatchPwd) {
//       // Check if tenant has any unpaid invoices
//       const tenantAllPaidInvoiceResult = await queryRunner(
//         checkMyAllTenantsInvoicePaidQuery,
//         [userId]
//       );
//       const tenantData = await queryRunner(getAllTenantsQuery, [userId]);
//       // console.log(tenantData[0]);
//       // No un-paid invoices found, update tenant account
//       if (tenantAllPaidInvoiceResult[0].length === 0) {
//         const tenantAllPaid = await queryRunner(updateUserAccountQuery, [
//           0,
//           userId,
//         ]);
//         await queryRunner(updateAllTenantsAccountQuery, [0, userId]);
//         const mailSubject = "Your account has been deactivated";
//         for (let i = 0; i < tenantData[0].length; i++) {
//           // console.log(tenantData[i].emai);
//           await sendMail(
//             tenantData[0][i].email,
//             mailSubject,
//             "as",
//             `${tenantData[0][i].firstName} ${tenantData[0][i].lastName}`
//           );
//         }
//         if (tenantAllPaid[0].affectedRows > 0) {
//           res.status(200).json({
//             message: "Tenant has paid invoices",
//           });
//         }
//       } else {
//         res.status(200).json({
//           message: "Tenant has unpaid invoices",
//         });
//       }
//     } else {
//       res.status(400).json({
//         message: "Password is incorrect",
//       });
//     }
//   } catch (error) {
//     res.status(400).json({
//       message: error.message,
//     });
//   }
// };
exports.checkAllTenantsPaid = async (req, res) => {
  try {
    const { userId, email } = req.user;
    // const { password } = req.body;
    const { password } = req.query;
    // console.log(req.query);

    const selectResult = await queryRunner(selectQuery("users", "Email"), [
      email,
    ]);
    const isMatchPwd = await bcrypt.compare(
      password,
      selectResult[0][0].Password
    );
    if (isMatchPwd) {
      console.log(isMatchPwd);
      // Check if tenant has any unpaid invoices
      const tenantAllPaidInvoiceResult = await queryRunner(
        checkMyAllTenantsInvoicePaidQuery,
        [userId]
      );
      const tenantData = await queryRunner(getAllTenantsQuery, [userId]);
      // console.log(tenantData[0]);
      // No un-paid invoices found, update tenant account
      if (tenantAllPaidInvoiceResult[0].length === 0) {
        const tenantAllPaid = await queryRunner(updateUserAccountQuery, [
          0,
          userId,
        ]);
        await queryRunner(updateAllTenantsAccountQuery, [0, userId]);
        const mailSubject = "Your account has been deactivated";
        for (let i = 0; i < tenantData[0].length; i++) {
          // console.log(tenantData[i].emai);
          await sendMail(
            tenantData[0][i].email,
            mailSubject,
            "as",
            `${tenantData[0][i].firstName} ${tenantData[0][i].lastName}`
          );
        }
        // deleteUserAccountData
        await queryRunner(deleteUserAccountData.task, [userId]);//
        await queryRunner(deleteUserAccountData.invoice, [userId]);  //
        await queryRunner(deleteUserAccountData.tenants, [userId]);   //
        await queryRunner(deleteUserAccountData.deletePropertyImages, [userId]); //
        await queryRunner(deleteUserAccountData.deletePropertyUnits, [userId]); //
        await queryRunner(deleteUserAccountData.deleteUserData, [userId]);  //
        await queryRunner(deleteUserAccountData.property, [userId]);  //

      
        if (tenantAllPaid[0].affectedRows > 0) {
          res.status(200).json({
            message: "Tenant has paid invoices",
          });
        }
      } else {
        res.status(200).json({
          message: "Tenant has unpaid invoices",
        });
      }
    } else {
      res.status(400).json({
        message: "Password is incorrect",
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.getPropertyDashboardData = async (req, res) => {
  try {
    const { userId } = req.user;
    const { start, end } = req.params;
    const getAllPropertyData = await queryRunner(getPropertiesGraphData, [
      userId,
      start,
      end,
    ]);
    res.status(200).json({
      property: getAllPropertyData[0],
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
exports.getTaskDashboardData = async (req, res) => {
  try {
    const { userId } = req.user;
    const { start, end, propertyId } = req.params;

    if (propertyId) {
      const getAllTaskData = await queryRunner(getTaskGraphDataByPropertyId, [
        propertyId,
        userId,
        start,
        end,
      ]);
      res.status(200).json({
        property: getAllTaskData[0],
      });
    } else {
      const getAllTaskData = await queryRunner(getTaskGraphData, [
        userId,
        start,
        end,
      ]);
      res.status(200).json({
        property: getAllTaskData[0],
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
exports.getInvoiceDashboardData = async (req, res) => {
  try {
    const { userId } = req.user;
    const { start, end, propertyId } = req.params;
    if (propertyId) {
      console.log(propertyId);
      const getAllInvoiceData = await queryRunner(
        getInvoiceGraphDataByPropertyId,
        [propertyId, userId, start, end]
      );
      res.status(200).json(getAllInvoiceData[0]);
    } else {
      const getAllInvoiceData = await queryRunner(getInvoiceGraphData, [
        userId,
        start,
        end,
      ]);
      res.status(200).json(getAllInvoiceData[0]);
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};


// inactive user
exports.inactiveUser = async (req, res) => {
  try {
    const { email } = req.user;
    console.log(email);
    const inactiveUserResult = await queryRunner(updateUserActive, [0, email]);
    // if (inactiveUserResult[0].affectedRows > 0) {
      console.log(inactiveUserResult);
    res.status(200).json({
      message: "User is inactive",
    });
    // }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
exports.inactiveTenant = async (req, res) => {
  try {
    const { email } = req.user;
    const inactiveUserResult = await queryRunner(updateTenantActive, [
      0,
      email,
    ]);
    // if (inactiveUserResult[0].affectedRows > 0) {
    res.status(200).json({
      message: "User is inactive",
    });
    // }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
exports.activeTenant = async (req, res) => {
  try {
    const { email } = req.user;
    const inactiveUserResult = await queryRunner(updateTenantActive, [
      1,
      email,
    ]);
    // if (inactiveUserResult[0].affectedRows > 0) {
    res.status(200).json({
      message: "User is active",
    });
    // }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
exports.activeUser = async (req, res) => {
  try {
    const { email } = req.user;
    const inactiveUserResult = await queryRunner(updateActiveUser, [
      1,
      email,
    ]);
    // if (inactiveUserResult[0].affectedRows > 0) {
    res.status(200).json({
      message: "User is active",
    });
    // }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
// getUserById
exports.getUserByIdData = async (req, res) => {
  try {
    const { id, type } = req.params;
    console.log(id, type);
    if (type === "tenant") {
      const getUserByIdResult = await queryRunner(getTenantById, [id]);
      res.status(200).json({
        data: getUserByIdResult[0][0],
      });
    } else if (type === "landlord") {
      const getUserByIdResult = await queryRunner(getUserById, [id]);
      res.status(200).json({
        data: getUserByIdResult[0][0],
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
// Profile Complete
exports.ProfileComplete = async (req, res) => {
  try {
    const { userId } = req.user;
    const propertycheckresult = await queryRunner(selectQuery("users", "id"), [
      userId,
    ]);
    if (propertycheckresult[0].length > 0) {
      count = 0;
      if (propertycheckresult[0][0].image) {
        count += 10;
      }
      if (propertycheckresult[0][0].FirstName) {
        count += 5;
      }
      if (propertycheckresult[0][0].LastName) {
        count += 5;
      }
      if (propertycheckresult[0][0].Email) {
        count += 10;
      }
      if (propertycheckresult[0][0].Phone) {
        count += 10;
      }
      if (propertycheckresult[0][0].BusinessName) {
        count += 10;
      }
      if (propertycheckresult[0][0].streetAddress) {
        count += 10;
      }

      if (propertycheckresult[0][0].PACity) {
        count += 5;
      }
      if (propertycheckresult[0][0].PAState) {
        count += 5;
      }
      if (propertycheckresult[0][0].PAZipcode) {
        count += 5;
      }
      if (propertycheckresult[0][0].BACity) {
        count += 5;
      }
      if (propertycheckresult[0][0].BAState) {
        count += 5;
      }
      if (propertycheckresult[0][0].BAZipcode) {
        count += 5;
      }
      
      if (propertycheckresult[0][0].BusinessAddress) {
        count += 10;
      }
      res.status(200).json({
        // data : propertycheckresult,
        count: count,
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// exports.filterOutDashbordDataByProperty = async (req, res) => {
//   try {
//     const { propertyId } = req.params;
//     const getAllPropertyData = await queryRunner(getPropertyDashboardData, [
//       propertyId,
//     ]);
//     res.status(200).json({
//       property: getAllPropertyData[0],
//     });
//   } catch (error) {
//     res.status(400).json({
//       message: error.message,
//     });
//   }
// };
// check property etc
exports.checkSystem = async (req, res) => {
  try {
    // const { userId } = req.user;
    const { userId } = req.body;
    // Property
    const propertycheckresult = await queryRunner(
      selectQuery("property", "landlordID"),
      [userId]
    );
    if (propertycheckresult[0].length > 0) {
      property = "true";
    } else {
      property = "false";
    }
    // Tenant
    const tenantcheckresult = await queryRunner(
      selectQuery("tenants", "landlordID"),
      [userId]
    );
    if (tenantcheckresult[0].length > 0) {
      tenant = "true";
    } else {
      tenant = "false";
    }

    //Invoice
    const invoicecheckresult = await queryRunner(
      selectQuery("invoice", "landlordID"),
      [userId]
    );
    if (invoicecheckresult[0].length > 0) {
      invoice = "true";
    } else {
      invoice = "false";
    }

    //Task
    const taskcheckresult = await queryRunner(
      selectQuery("task", "landlordID"),
      [userId]
    );
    if (taskcheckresult[0].length > 0) {
      task = "true";
    } else {
      task = "false";
    }

    //vendors
    const vendorscheckresult = await queryRunner(
      selectQuery("vendor", "LandlordID"),
      [userId]
    );
    if (vendorscheckresult[0].length > 0) {
      vendors = "true";
    } else {
      vendors = "false";
    }
    res.status(200).json({
      property: property,
      tenant: tenant,
      invoice: invoice,
      task: task,
      vendors: vendors,
      // data : propertycheckresult,
    });
    // }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.filterOutDashbordDataByProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const getAllPropertyData = await queryRunner(getPropertyDashboardData, [
      propertyId,
    ]);
    res.status(200).json({
      property: getAllPropertyData[0],
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
exports.updateAuth = async (req, res) => {
  try {
    const { auth } = req.body;
    const {userId} = req.user
    const updateAuth= await queryRunner(updateAuthQuery, [auth,userId]);
    if(updateAuth[0].affectedRows>0){
      res.status(200).json({message:`2 Factor Authentication ${auth==0?"turned off":"turned on"}`})
    }else{
      res.status(400).json({message:"Error in updating 2 Factor Authentication"})
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({
      message: error.message,
    });
  }
};


exports.deleteUser=async(req,res)=>{
  const {userId}=req.body;
  try {
    const deleteUserResult=await queryRunner(deleteQuery("users","id"),[userId]);
    if(deleteUserResult[0].affectedRows>0){
      res.status(200).json({message:"User Deleted"})
    }else{
      res.status(400).json({message:"Error in deleting user"})
    }
  }catch(error){
    res.status(500).json({ message: "Error", error: error.message });

  }
}


exports.UpdateUserNuveiId = async(req,res)=>{
  const {userId, nuveiId}=req.body;
  
  try {
    const updateUserResult=await queryRunner(UpdateUserNuveiIdQuery,[nuveiId, userId]);
    if(updateUserResult[0].affectedRows > 0){
      res.status(200).json({message:"User updated"})
    }else{
      res.status(400).json({message:"Error in update user"})
    }
  }catch(error){
    console.log(error);
    res.status(500).json({ message: "Error", error: error.message });

  }
}

exports.DMNS=async(req,res)=>{
    console.log(req)
}

exports.ACHLogCheck = async(req,res)=>{
  try {
    // console.log("ACHLogCheck");
      res.status(200).json({message:"ACH Log Check"})
  }catch(error){
    console.log(error);
    res.status(500).json({ message: "Error", error: error.message });

  }
}









// exports.UserCheckName = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     console.log(userId);
//     const userResult = await queryRunner(selectQuery("users", "id"), [userId]);

//     if (userResult[0].length > 0) {
//       console.log(userResult[0][0].BusinessName);

//       if (userResult[0][0].BusinessName !== null && userResult[0][0].BusinessName !== "") {
//         const BusinessName = userResult[0][0].BusinessName.substring(0, 3);
//         return res.status(200).json({ BusinessName: BusinessName });
//       } else {
//         const userName =
//           (userResult[0][0].FirstName.substring(0, 2) || "") +
//           (userResult[0][0].LastName.substring(0, 1) || "");
//         return res.status(200).json({ userName });
//       }
//     } else {
//       res.status(400).json({ message: "Error in deleting user" });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Error", error: error.message });
//   }
// };

