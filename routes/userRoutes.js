const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const tenantController = require("../controllers/tenantController");
const invoiceController = require("../controllers/invoiceController");
const tenantPortalController = require("../controllers/tenantPortalController");
const userPermissionController = require("../controllers/userPermissionController");
const settingController = require("../controllers/settingController");
const bankAccountController = require("../controllers/bankAccountController");
const superAdmin = require("../controllers/superAdmin");
const { verifyToken, verifyTokenTenant, verifySuperAdmin } = require("../middleware/authenticate");
const taskController = require("../controllers/taskController");
const usersTaskController = require("../controllers/usersTaskController");
const prospectus = require("../controllers/prospectusController");
const fileUpload = require("../helper/S3Bucket");
const notifyController = require("../controllers/notifyController");
const { chatsController } = require("../controllers/chatsController");
const messageClt = require("../controllers/messageController");
const leadsClt = require("../controllers/Leads");
const paymentIntegration = require("../helper/paymentIntegration");
const { upload } = require("../middleware/imageUploads");

router.post("/Signup", userController.createUser);
router.post('/addAgent', userController.addAdmin);
router.post("/Signin", userController.Signin);
router.get('/dashboard/data',verifyToken ,userController.getDashboardData);
router.put('/changePasssword', verifyToken, userController.changePasssword);
router.post("/upload",verifyToken, fileUpload.audioUpload);
router.post('/uploadImage',verifyToken, fileUpload.fileUpload);
router.get('/generateParagraph',verifyToken ,userController.generateParagraphs);
router.get('/getAllLanguages', userController.getAllLanguages);
router.get('/getUser',verifyToken, userController.getUser);
router.get('/getAllUsers', userController.getAllUsersWithAudios);
router.post('/addCase',verifyToken,userController.addCase);

router.post('/addCaseFields',verifyToken,userController.addCaseFieldValues);
router.get('/getCases',verifyToken,userController.getAllCases);
router.get('/getCasesTest',verifyToken,userController.getAllCasesTest);
router.get('/cases/:caseId', verifyToken, userController.getspecificCase);

router.get('/getApprovedAgents',userController.getApprovedAgents);
router.put('/assignAgent',userController.assignAgent);
router.put('/UpdateAgentStatus',userController.updateAgentStatus);
router.put('/UpdateCaseStatus',userController.updateCaseStatus);
router.post("/addcaseForm", verifyToken, userController.addForm);
router.get('/getCaseForm', verifyToken, userController.getForm);
router.post("/DMNS", userController.DMNS);
router.get("/tenantAllPaidInvoice", verifyTokenTenant, tenantController.tenantAllPaidInvoice);
router.get("/userCheckTenantPaidInvoice", verifyToken, userController.checkAllTenantsPaid);
router.get("/protected", verifyToken, userController.getUser);
router.get("/protectedTenant", verifyTokenTenant, userController.getUser);
router.get("/checkemail", userController.checkemail);

// router.get("/Signinall", userController.Signinall);


router.post("/uploadTenant", verifyTokenTenant, fileUpload.fileUpload);
router.post("/uploadAdmin", verifySuperAdmin, fileUpload.fileUpload); 
// router.delete("/delete/:key", fileUpload.fileDelete);
router.put("/updatePlanId", verifyToken, userController.updatePlanId);
// router.get('/Signinall', userController.Signinall);
router.put("/updatePlanIdByAdmin", verifySuperAdmin, superAdmin.updatePlanIdByAdmin);

router.post("/resetEmail", userController.createResetEmail);
router.post("/verifyResetEmailCode", userController.verifyResetEmailCode);
router.post("/verifyAuthCode",userController.verifyAuthCode)
router.post("/updatePassword", userController.updatePassword);
router.post("/resendCode", userController.resendCode);
router.get("/pricingPlan", userController.pricingPlan);
router.post("/property", verifyToken, userController.property);
// router.post("/property",userController.property);
router.get("/getDashPropertyData/:start/:end", verifyToken, userController.getPropertyDashboardData);
router.get('/getDashTaskData/:start/:end/:propertyId?', verifyToken, userController.getTaskDashboardData);
router.get("/getDashInvoiceData/:start/:end/:propertyId?", verifyToken, userController.getInvoiceDashboardData);
router.put("/inactiveUser", verifyToken, userController.inactiveUser);
router.put("/inactiveTenant", verifyTokenTenant, userController.inactiveTenant);
router.put("/activeTenant", verifyTokenTenant, userController.activeTenant);
router.put("/activeUser", verifyToken, userController.activeUser);

router.get("/getUserById/:id/:type", userController.getUserByIdData);
// router.post("/property" ,verifyToken, userController.property);
router.put("/updateUserProfile", verifyToken, userController.updateUserProfile);
router.put("/updateTenantProfile", verifyTokenTenant, tenantController.updateTenantProfile);
// router.post('/property', upload , userController.property);
// start, end 
router.get("/allProperty", verifyToken, userController.getproperty);
// router.get('/allProperty', userController.getproperty);
router.get("/PropertyUnits", verifyToken, userController.getpropertyUnits);
router.put(
  "/PropertyUnitsUpdates",
  verifyToken,
  userController.putPropertyUnitsUpdates
);
router.delete("/propertyDelete", verifyToken, userController.propertyDelete);
// router.delete("/propertyDelete",userController.propertyDelete);
// router.put("/updateProperty",userController.propertyUpdate);
router.put("/updateProperty", verifyToken, userController.propertyUpdate);
// router.get('/viewProperty' ,userController.propertyView);
router.get("/viewProperty", verifyToken, userController.propertyView);
// router.get('/resendEmail', invoiceController.resendEmail);
router.get('/resendEmail', verifyToken,invoiceController.resendEmail);
// router.get("/PropertyUnits", verifyToken, userController.getpropertyUnits);
router.post("/addMoreUnits", verifyToken,userController.addMoreUnits);
router.delete("/deleteMoreUnits", verifyToken,userController.deleteMoreUnits);
router.put(
  "/PropertyUnitsUpdates",
  verifyToken,
  userController.putPropertyUnitsUpdates
);
router.get(
  "/getPropertyUnitsTenant",
  verifyToken,
  userController.getPropertyUnitsTenant
);
router.get(
  "/viewPropertyTenant",
  verifyToken,
  userController.viewPropertyTenant
);
router.get(
  "/viewAllPropertyTenant",
  verifyToken,
  userController.viewAllPropertyTenant
);
// router.post('/tenants',tenantController.createTenants);

router.post("/tenants", verifyToken, tenantController.createTenants);
router.post("/sendInvitationLink", verifyToken, tenantController.sendInvitationLink);
// router.post("/sendInvitationLink" , tenantController.sendInvitationLink);
// router.post('/tenantIncreaseRent' , userController.tenantIncreaseRent);
// router.get('/ ',verifyToken,  userController.verifyMailCheck);
router.get('/verifyMailCheck', verifyToken, userController.verifyMailCheck);
router.post('/resetEmailTenant', tenantController.createResetEmailTenant);
router.post('/verifyResetEmailCodeTenant', tenantController.verifyResetEmailCodeTenant);
router.put('/updatePasswordTenant', tenantController.updatePasswordTenant);
router.put('/resendCodeTenants', tenantController.resendCodeTenants);
router.post('/addAlternateEmailPhone', verifyToken, tenantController.addAlternateEmailPhone);
// router.post('/addAlternateEmailPhone' , tenantController.addAlternateEmailPhone);
router.post('/tenantAttachFile', verifyToken, tenantController.tenantAttachFile); 
router.delete('/tenantAttachFileDelete', verifyToken, tenantController.tenantAttachFileDelete);
router.get('/GettenantAttachFile', verifyToken, tenantController.GettenantAttachFile);
// router.get('/GettenantAttachFile', tenantController.GettenantAttachFile);
router.delete('/tenantDelete', verifyToken, tenantController.tenantDelete);
// router.delete('/tenantDelete', tenantController.tenantDelete);
router.get('/getTenantsByID', verifyToken, tenantController.getTenantsByID);
// router.get('/getTenantsByID', tenantController.getTenantsByID);
router.post('/createInvoice', verifyToken, invoiceController.createInvoice);
// router.post('/createInvoice', invoiceController.createInvoice);
router.put('/putInvoiceStatusUpdates', verifyToken, invoiceController.putInvoiceStatusUpdates);
router.get('/getAllInvoices', verifyToken, invoiceController.getAllInvoices);
router.get('/getByIdInvoices', verifyToken, invoiceController.getByIdInvoices);
router.put('/UpdateInvoice', verifyToken, invoiceController.UpdateInvoice);
// router.put('/UpdateInvoice', invoiceController.UpdateInvoice);
router.delete('/invoiceDelete', verifyToken, invoiceController.invoiceDelete);
router.post("/addVendor", verifyToken, taskController.addVendors);  
router.put("/updateVendor", verifyToken, taskController.updateVendor); //=> **********  update vendor
router.delete("/deleteVendor/:vendorID", verifyToken, taskController.deleteVendor); //=> **********  delete vendor
router.post("/addVendorCategory", verifyToken, taskController.addVendorCategory);
// router.post("/addVendorCategory", taskController.addVendorCategory);
// router.get("/getAllVendors",verifyToken ,taskController.getAllVendors);
router.get("/getAllVendors", verifyToken, taskController.getAllVendors);
router.post("/addTasks", verifyToken, taskController.addTasks);
router.post("/addUsersTask",verifyToken, usersTaskController.addUsersTask);
// router.get("/getAllTask", verifyToken, taskController.getAllTask);
router.get("/getAllTask",verifyToken ,taskController.getAllTask);
router.get("/getAllTaskTenantRequest", verifyToken, taskController.getAllTaskTenantRequest);
// router.get("/getAllTask", taskController.getAllTask);
router.get("/taskByID", verifyToken, taskController.taskByID);
router.put("/updateTenants", verifyToken, tenantController.updateTenants);
router.get("/getStates",userController.getStates);
router.get("/getVendorCategory", verifyToken,taskController.getVendorCategory);
router.get("/getVendorAssignTo", verifyToken, taskController.getVendorAssignTo);
router.put("/updateTasks", verifyToken, taskController.updateTasks);
router.delete("/deleteTask", verifyToken, taskController.deleteTask);
// router.get("/propertyTask", verifyToken, userController.propertyTask);
router.get("/propertyTask", verifyToken, userController.propertyTask);
router.get("/tenantTask", verifyToken, tenantController.tenantTask);
// router.get("/getAllInvoicesTenant", verifyTokenTenant, tenantPortalController.getAllInvoicesTenant);
router.get("/getAllInvoicesTenant",verifyTokenTenant,tenantPortalController.getAllInvoicesTenant);
router.get("/getAllTaskTenant", verifyTokenTenant, tenantPortalController.getAllTaskTenant);
// router.get("/getAllTaskTenant", tenantPortalController.getAllTaskTenant);
// router.get("/getAllTaskLoggedInTenant", verifyTokenTenant, tenantPortalController.getAllLoggedInTenantTask);
// get tenante dashboard
router.get("/getTenantDashData", verifyTokenTenant, tenantPortalController.getTenantDashboardData);
router.get('/getTenantByID', verifyTokenTenant, tenantPortalController.getTenantByID);
// router.get('/getTenantByID', tenantPortalController.getTenantByID);
router.put('/changePasssword', verifyToken, settingController.changePasssword);
router.put('/changePasswordTenant', verifyTokenTenant, settingController.changePasswordTenant);
router.put('/emailUpdate', userController.emailUpdate);
router.put('/verifyEmailUpdate', userController.verifyEmailUpdate);
// updated category route
router.post("/addInvoiceCategory", verifyToken, invoiceController.createInvoiceCategories);
router.put("/updatedInvoiceCategory", verifyToken, invoiceController.updateInvoiceCategories);
router.get("/invoiceCategory", verifyToken, invoiceController.getInvoiceCategories);
router.post("/invoiceCategoryTenant", verifyTokenTenant, tenantPortalController.getInvoiceCategoriesTenant);
router.get("/getInvoiceCategoriesText", verifyToken, invoiceController.getInvoiceCategoriesText);
router.get("/dashboard", verifyToken, userController.getDashboardData);
router.get("/checkNotify", verifyToken, notifyController.getCheckedNotify);
router.put("/updateAllNotifyRead", verifyToken, notifyController.updateUserAllReadNotify);
// updated notification route
router.put("/notify", verifyToken, notifyController.updateNotifyData);
router.get("/notify", verifyToken, notifyController.getNotify);
router.get("/tenantNotify", verifyTokenTenant, notifyController.getTenantNotify);
router.put("/updateReadUnRead", verifyToken, notifyController.updateUserReadUnRead);
//  fffffffffffffff

router.put("/updateTenantReadUnRead", verifyTokenTenant, notifyController.updateTenantReadUnRead);
router.put("/updateAllTenantNotifyRead", verifyTokenTenant, notifyController.updatetTenantAllReadNotify);


// property report task
// router.get("/propertyReport", userController.getAllProperty);
router.get("/propertyReport", verifyToken, userController.getAllProperty);
router.get("/invoiceReport", verifyToken, userController.getInvoiceReportData);
router.get("/taskReport", verifyToken, userController.getTaskReportData);
// router.get("/taskReport", userController.getTaskReportData);
// dekete invoice catergory
router.delete("/deleteInvoiceCategory", verifyToken, invoiceController.deleteInCategories);
// router.delete("/deleteVendorCategory", invoiceController.deleteVendCategories);
router.delete("/deleteVendorCategory", verifyToken, invoiceController.deleteVendCategories);

// chats start
router.post("/accessChats", verifyToken, chatsController.accessChats);
router.post("/accessTenantChats", verifyTokenTenant, chatsController.accessTenantsChats);

router.get("/fetchTenantChats", verifyTokenTenant, chatsController.fetchUsersChats);
router.get("/fetchUsersChats", verifyToken, chatsController.fetchUsersTenants);

// this api is f or messages  
router.post("/createNewMessageTenant", verifyTokenTenant, messageClt.createNewMessageTenant);
router.post("/createNewMessage", verifyToken, messageClt.createNewMessage);
router.get("/TenantMessages/:chatId", verifyTokenTenant, messageClt.getAllMessages);
router.get("/getMessagesCountLandlord", verifyToken, messageClt.getMessagesCountLandlord);
router.get("/getMessagesCountTenant", verifyTokenTenant, messageClt.getMessagesCountTenant);
router.put("/updateMessagesCountLandlord", verifyToken, messageClt.updateMessagesCountLandlord);
router.put("/updateMessagesCountTenant", verifyTokenTenant, messageClt.updateMessagesCountTenant);
// router.get("/getMessagesCount", messageClt.getMessagesCount);
router.get("/LandlordMessages/:chatId", verifyToken, messageClt.getAllMessages);

// profile complition
router.get('/ProfileComplete',verifyToken,userController.ProfileComplete);
router.get('/checkSystem' ,userController.checkSystem);
 
router.get("/getPropertyDashboard/:propertyId", verifyToken, userController.filterOutDashbordDataByProperty);
// update tenant profile
router.put("/updateTenantProfile", verifyTokenTenant, tenantController.updateTenantProfile);
// leads routes start
router.post("/createLead", verifyToken, leadsClt.createNewLead);

// Dashboard
// router.get("/taskCount", verifyToken, taskController.taskCount);
router.get("/taskCount", verifyToken, taskController.taskCount);
// router.get("/invoiceAmountCount" , invoiceController.invoiceAmountCount);
router.post("/addTasksTenant" ,verifyTokenTenant,tenantPortalController.addTasksTenant);
router.get("/invoiceAmountCount/:start/:end" ,verifyToken ,invoiceController.invoiceAmountCount);
router.get("/getAllTaskTenantRequest", verifyToken, taskController.getAllTaskTenantRequest);
router.get("/taskByIDTenant" ,verifyToken ,tenantPortalController.taskByIDTenant);
// router.get("/taskByIDTenant" , tenantPortalController.taskByIDTenant);
router.post("/openOrder", paymentIntegration.openOrder);
router.post("/Payment2Payment", paymentIntegration.Payment2Payment);

router.post("/createUserPayment", paymentIntegration.createUserPayment);
router.post("/getUserDetailsPayment", paymentIntegration.getUserDetailsPayment);
// router.post("/createUserPaymentasdfgh", paymentIntegration.createUserPaymentasdfgh);
// router.post("/openOrder", openOrder);
router.get("/getPropertyDashboard/:propertyId", verifyToken, userController.filterOutDashbordDataByProperty);
module.exports = router;
router.get("/ProfileCompleteTenant", verifyTokenTenant, tenantPortalController.ProfileCompleteTenant);
// router.get("/ProfileCompleteTenant" , tenantPortalController.ProfileCompleteTenant);
router.get("/unpaidAmountTenant", verifyTokenTenant, tenantPortalController.unpaidAmountTenant);
router.put('/updateAuth',verifyToken, userController.updateAuth);
router.put('/updateAuthTenant',verifyTokenTenant, tenantPortalController.updateAuthTenant);
// router.get("/unpaidAmountTenant", tenantPortalController.unpaidAmountTenant);
router.put("/emailtemplates", verifyToken, settingController.emailtemplates);
router.post("/addprospectus", verifyToken, prospectus.addprospectus);
// router.post("/addprospectus", prospectus.addprospectus);
router.get("/getProspectus", verifyToken, prospectus.getProspectus);
// router.get("/getProspectus", prospectus.getProspectus);
router.get("/getProspectusByID", verifyToken, prospectus.getProspectusByID);
// router.get("/getProspectusByID", prospectus.getProspectusByID);
router.put("/updateProspectus", verifyToken, prospectus.updateProspectus);
// router.put("/updateProspectus", prospectus.updateProspectus);
router.put("/updateProspectusStatus", verifyToken, prospectus.updateProspectusStatus);
router.get("/prospectusInsightQD/:year", verifyToken, prospectus.prospectusInsightQD);
router.get("/prospectusInsightEN/:startDate/:endDate", verifyToken, prospectus.prospectusInsightEN);
router.delete("/deleteProspectus/:prospectusID", verifyToken, prospectus.deleteProspectus);
// router.put("/updateBusinessLogo", [verifyToken, upload] ,settingController.updateBusinessLogo);
router.put("/updateBusinessLogo", upload ,settingController.updateBusinessLogo);
router.put("/changeEmail", verifyToken, settingController.changeEmail);
router.get("/prospectusTime/:startDate/:endDate", verifyToken, prospectus.prospectusTime);
router.get("/GettenantAttachEmailPhone", verifyToken, tenantController.GettenantAttachEmailPhone);
router.delete("/allTenantDelete", verifyToken, tenantController.allTenantDelete);
router.get("/checkUnpaidInvoices", verifyToken, tenantController.checkUnpaidInvoices);
// router.get("/checkUnpaidInvoices",tenantController.checkUnpaidInvoices);
router.post("/prospectusSources", verifyToken, prospectus.prospectusSources);
// router.get("/sourcesCampaignInsight" , prospectus.sourcesCampaignInsight);
router.get("/sourcesCampaignInsight/:startDate/:endDate", verifyToken, prospectus.sourcesCampaignInsight);
router.get("/dashboardProspectusInsight/:startDate/:endDate", verifyToken, prospectus.dashboardProspectusInsight);
router.get("/getProspectusSources", verifyToken, prospectus.getProspectusSources);
router.put("/ImageToBase64", [verifyToken, upload], settingController.ImageToBase64);
router.get("/prospectTimeGraph/:startDate/:endDate", verifyToken, prospectus.prospectTimeGraph);
router.get("/TenantStatusCP/:startDate/:endDate", verifyToken, tenantController.TenantStatusCP);
//  User Permission Start
router.post("/createUserPermissionUser", verifyToken, userPermissionController.createUserPermissionUser);
router.get("/userCheckEmail", verifyToken, userPermissionController.userCheckEmail);
router.get("/userPermissionGetAll", verifyToken, userPermissionController.userPermissionGetAll);
router.put("/updateUserPermissionUsers",  verifyToken, userPermissionController.updateUserPermissionUsers); 
router.get("/userPermissionGetById", verifyToken, userPermissionController.userPermissionGetById);
router.delete("/userPermissionUsersDelete", verifyToken, userPermissionController.userPermissionUsersDelete);
router.get("/userPermissionRoles", verifyToken, userPermissionController.userPermissionRoles);
router.put("/userPermissionUpdate", verifyToken, userPermissionController.userPermissionUpdate);
router.post("/createPlanPayment", paymentIntegration.createPlanPayment);
router.post("/editPlanPayment", paymentIntegration.editPlanPayment);
router.post("/createSubscriptionPayment", paymentIntegration.createSubscriptionPayment);
router.post("/createSubscriptionPaymentSetting", paymentIntegration.createSubscriptionPaymentSetting);
router.post("/CreateBankAccount",verifyToken, bankAccountController.CreateBankAccount);
router.post("/CreateBankAccountSignup", bankAccountController.CreateBankAccountSignup);

router.post("/CreateBankAccountTenant",verifyTokenTenant, bankAccountController.CreateBankAccount);
router.get("/GetBankAccount", verifyToken, bankAccountController.GetBankAccount);
router.get("/GetBankAccountAdmin", verifySuperAdmin, bankAccountController.GetBankAccountAdmin);
router.get("/GetBankAccountTenant", verifyTokenTenant, bankAccountController.GetBankAccount);
router.put("/updateBankAccountStatus", verifyToken, bankAccountController.updateBankAccountStatus); 
router.post("/cancelSubscription", paymentIntegration.cancelSubscription);
router.delete("/deleteUser",userController.deleteUser);
router.put("/updateBankAccountTenant", verifyTokenTenant, bankAccountController.updateBankAccountTenant);
// router.get("/dummy", bankAccountController.dummy); 
router.put("/updatePropertyBankAccount", bankAccountController.updatePropertyBankAccount);
router.put("/UpdateUserNuveiId", userController.UpdateUserNuveiId);

//                                             superAdmin

router.post("/signInAdmin", superAdmin.signInAdmin);
// router.get("/allLandlord",verifySuperAdmin ,superAdmin.allLandlord);
router.get("/allLandlord",verifySuperAdmin ,superAdmin.allLandlord);
router.delete("/closedLandlord",verifySuperAdmin ,superAdmin.deleteLandlord);
// router.delete("/closedLandlord", superAdmin.deleteLandlord);
router.get("/allClosedLandlord",verifySuperAdmin ,superAdmin.allClosedLandlord);
// router.get("/allClosedLandlord", superAdmin.allClosedLandlord);
// router.post("/createUserAdmin",verifySuperAdmin ,superAdmin.createUserAdmin);
router.post("/createUserAdmin",verifySuperAdmin ,superAdmin.createUserAdmin);
router.get("/allUserAdmin",verifySuperAdmin ,superAdmin.allUserAdmin);
router.put("/updateAdminUser",verifySuperAdmin ,superAdmin.updateAdminUser);
router.delete("/userAdminDelete",verifySuperAdmin ,superAdmin.userAdminDelete);
router.get("/totalCustomer",verifySuperAdmin ,superAdmin.totalCustomer);
router.get("/protectedAdmin",verifySuperAdmin ,superAdmin.getAdmin);
router.put("/updateAdminProfile", verifySuperAdmin, superAdmin.updateAdminProfile);
router.get("/landlordReportAdmin", verifySuperAdmin, superAdmin.landlordReportAdmin);
router.get("/getUser",verifySuperAdmin,superAdmin.getUserforAdmin);
router.get("/adminUserPermissionRoles",verifySuperAdmin,superAdmin.adminUserPermissionRoles);
router.put("/adminUserPermissionUpdate",verifySuperAdmin,superAdmin.adminUserPermissionUpdate);
router.get("/getAdminRevenue",verifySuperAdmin,superAdmin.getAdminRevenue);
router.post("/adminResetEmail",superAdmin.adminResetEmail);
router.post("/adminVerifyResetEmailCode",superAdmin.adminVerifyResetEmailCode);
router.put("/updatePasswordAdmin",superAdmin.updatePasswordAdmin);
router.post("/resendCodeAdmin", superAdmin.resendCodeAdmin);
router.get("/getAdminNotification",verifySuperAdmin,superAdmin.getAdminNotification);
router.put("/updateAdminNotification",verifySuperAdmin,superAdmin.updateAdminNotification);
router.put("/updateAllAdminNotification",verifySuperAdmin,superAdmin.updateAllAdminNotification);
router.delete("/deleteClossedLandlord",verifySuperAdmin,superAdmin.deleteClossedLandlord);
router.get("/checkEmailTenants", verifyToken, tenantController.checkEmailTenants);
router.post("/paymentACHVerification",paymentIntegration.paymentACHVerification);
router.get("/VendorCheckEmail/:email", verifyToken, taskController.VendorCheckEmail);
router.post("/ACHLogCheck", userController.ACHLogCheck);
router.post("/tenantUpdateAllInvoices",verifyTokenTenant,tenantController.tenantUpdateAllInvoices);
router.post("/tenantUpdateIndividualInvoices",verifyTokenTenant,tenantController.tenantUpdateIndividualInvoices);
// router.get("/UserCheckName/:userId",userController.UserCheckName);
router.get("/InvoiceID", verifyToken, invoiceController.InvoiceID);
router.get("/getAllUserTask", verifyToken, usersTaskController.getAllUserTask);
router.delete("/deleteUserTask", verifyToken, usersTaskController.deleteUserTask);
router.put("/updateUserTask", verifyToken, usersTaskController.updateUserTask);

