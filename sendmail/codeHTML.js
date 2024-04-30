exports.codeHTML = (name, random) => {
  return `
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
  <body style="	margin: 0;
    background: #FEFEFE;
    color: #585858;
  ">
    <!-- Preivew text -->
    <span class="preheader" style="display: none !important; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;border-collapse: collapse;border: 0px;"></span> 
    <!-- Carpool logo -->
    <table align="center" border="0" cellspacing="0" cellpadding="0" style="	font-size: 15px;
    line-height: 23px;
    max-width: 500px;
    min-width: 460px;
    text-align: center;
  ">
      <tbody><tr>
        <td style="	font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
    vertical-align: top;
      border: none !important;
  ">
  
          <img alt="Spade Rent" src="https://res.cloudinary.com/djhjn0ngj/image/upload/v1685012561/Logo_2_is7u6m.png" class="carpool_logo" width="232" style="	display: block;
    margin: 0 auto;
  margin: 30px auto;">
        </td>
      </tr>
      <!-- Header -->
      <tr>
        <td class="sectionlike imageless_section" style="	font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
    vertical-align: top;
      border: none !important;
    background: #1672BA;
    padding-bottom: 10px;
  padding-bottom: 20px;"></td>
      </tr>
      <!-- Content -->
      <tr>
        <td class="section" style="	font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
    vertical-align: top;
      border: none !important;
    background: #1672BA;
    padding: 0 20px;
  ">
          <table border="0" cellspacing="0" cellpadding="0" class="section_content" style="	font-size: 15px;
    line-height: 23px;
    max-width: 500px;
    min-width: 460px;
    text-align: center;
    width: 100%;
    background: #fff;
  ">
            <tbody><tr>
              <td class="section_content_padded" style="	font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
    vertical-align: top;
      border: none !important;
  padding: 0 35px 40px;">
                <h1 style="	font-size: 20px;
    font-weight: 500;
    margin-top: 40px;
    margin-bottom: 0;
    color: black;
    font-family: figtree;
  ">Hi <span style="color: #1672BA;font-weight: 700; font-size: 25px;"><b>${name}</b></span>,</h1>
                <p class="near_title last" style="margin-top: 10px;margin-bottom: 0; color: gray; font-family: figtree;">Please verify that your email address , and that you entered it when signing up for Spade Rent.</p>
                <div style="	display: block;
    width: 100%;
    max-width: 300px;
    background: black;
    border-radius: 8px;
    color: #fff;
    font-size: 25px;
    padding: 12px 0;
    margin: 30px auto 0;
    font-weight: 700;
    letter-spacing: 20px; 
    text-decoration: none;
  " > <span >${random}</span></div>
                 
              </td>
            </tr>
          </tbody></table>
        </td>
      </tr>
      <!-- Signature -->
      <tr>
        <td class="section" style="	font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
    vertical-align: top;
      border: none !important;
    background: #1672BA;
    padding: 0 20px;
  ">
          <table border="0" cellspacing="0" cellpadding="0" class="section_content section_zag" style="	font-size: 15px;
    line-height: 23px;
    max-width: 500px;
    min-width: 460px;
    text-align: center;
    width: 100%;
    background: #fff;
  background: #F4FBF9;">
            <tbody><tr>
              <td class="signature" style="	font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
    vertical-align: top;
      border: none !important;
  padding: 20px;">
                <p class="marginless" style="margin: 0; font-family: figtree;">Thank You, <br>Spade Rent Team</p>
              </td>
            </tr>
          </tbody></table>
        </td>
      </tr>
      <!-- Footer -->
      <tr>
        <td class="section dummy_row" style="	font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
    vertical-align: top;
      border: none !important;
    background: #1672BA;
    padding: 0 20px;
  padding-top: 20px !important;"></td>
      </tr>
      <tr>
        <td style="	font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
    vertical-align: top;
      border: none !important;
  ">
          <table border="0" cellspacing="0" cellpadding="0" class="section_content" style="	font-size: 15px;
    line-height: 23px;
    max-width: 500px;
    min-width: 460px;
    text-align: center;
    width: 100%;
    background: #fff;
  ">
            <tbody><tr>
              <td class="footer_like" style="	font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
    vertical-align: top;
      border: none !important;
  background: #1672BA; "><img src="https://carpool-email-assets.s3.amazonaws.com/shared/footer@2x.png" alt="" width="500" class="img_section" style="	display: block;
    margin: 0 auto;
    width: 100%;
    max-width: 500px;
  "></td>
            </tr>
            <tr>
              <td class="footer" style="	font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
    vertical-align: top;
      border: none !important;
    padding: 0 20px 30px;
    background: #1672BA;
  ">
                <table border="0" cellspacing="0" cellpadding="0" class="footer_content" style="	font-size: 15px;
    line-height: 23px;
    max-width: 500px;
    min-width: 460px;
    text-align: center;
    width: 100%;
    font-size: 12px;
    line-height: initial;
    color: #005750;
  ">

  </table>
              </td>
            </tr>
          </tbody></table>
        </td>
      </tr>
      <!-- Legal footer -->
      <tr>
        <td style="	font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
    vertical-align: top;
      border: none !important;
  ">
          <p class="footer_legal" style="	padding: 20px 0 40px;
    margin: 0;
    font-size: 12px;
    color: #A5A5A5;
    line-height: 1.5;
  ">
          If you did not enter this email address when signing up for Spade Rent service, disregard this message.<br><br>
          © 2017 Google Inc. 1600 Amphitheatre Parkway, Mountain View, CA 94043
  <br><br>
  
  This is a mandatory service email from Spade Rent.
  </p>
        </td>
      </tr>
    </tbody></table>
  
  </body>`;
};

exports.welcomeHTML = (email, password, name) => {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml"><head><meta content="text/html; charset=utf-8" http-equiv="Content-Type"><meta content="width=device-width, initial-scale=1" name="viewport"><title>Spade Welcome Email</title><!-- Designed by https://github.com/kaytcat --><!-- Robot header image designed by Freepik.com --><style type="text/css">
      @import url(https://fonts.googleapis.com/css?family=Nunito);
    
      /* Take care of image borders and formatting */
    
      img {
        max-width: 600px;
        outline: none;
        text-decoration: none;
        -ms-interpolation-mode: bicubic;
      }
      html{
        margin: 0;
        padding:0;
      }
    
      a {
        text-decoration: none;
        border: 0;
        outline: none;
        color: #bbbbbb;
      }
    
      a img {
        border: none;
      }
    
      /* General styling */
    
      td, h1, h2, h3  {
        font-family: figtree;
        font-weight: 400;
      }
    
      td {
        text-align: center;
      }
    
      body {
        -webkit-font-smoothing:antialiased;
        -webkit-text-size-adjust:none;
        width: 100%;
        height: 100%;
        color: #666;
        background: #fff;
        font-size: 16px;
        height: 100vh;
        width: 100%;
        padding: 0px;
        margin: 0px;
      }
    
       table {
        border-collapse: collapse !important;
      }
    
      .headline {
        color: #444;
        font-size: 36px;
      }
    
     .force-full-width {
      width: 100% !important;
     }
    
    
      </style><style media="screen" type="text/css">
          @media screen {
            td, h1, h2, h3 {
                font-family: figtree !important;
            }
          }
      </style><style media="only screen and (max-width: 480px)" type="text/css">
        /* Mobile styles */
        @media only screen and (max-width: 480px) {
    
          table[class="w320"] {
            width: 320px !important;
          }
        }
      </style>
      <style type="text/css"></style>
      
      </head>
      <body bgcolor="#fff" class="body" style="padding:20px; margin:0; display:block; background:#ffffff; -webkit-text-size-adjust:none">
    <table align="center" cellpadding="0" cellspacing="0" height="100%" width="100%">
    <tbody><tr>
    <td align="center" bgcolor="#fff" class="" valign="top" width="100%">
    <center class=""><table cellpadding="0" cellspacing="0" class="w320" style="margin: 0 auto;" width="600">
    <tbody><tr>
    <td align="center" class="" valign="top"><table cellpadding="0" cellspacing="0" style="margin: 0 auto;" width="100%">
    </table>
    <table bgcolor="#fff" cellpadding="0" cellspacing="0" class="" style="margin: 0 auto; width: 100%; margin-top: 40px;">
    <tbody style="margin-top: 15px;">
      <tr class="">
    <td class="">
    <img alt="Spade Rent" src="https://res.cloudinary.com/djhjn0ngj/image/upload/v1685012561/Logo_2_is7u6m.png" width="155" style="
    margin-bottom: 15px;
    ">
    </td>
    </tr>
    <tr class=""><td class="headline">Welcome <b>${name}</b> to Spade Rent!</td></tr>
    <tr>
    <td>
    <center class=""><table cellpadding="0" cellspacing="0" class="" style="margin: 0 auto;" width="75%"><tbody class=""><tr class="">
    <td class="" style="color:#444; font-weight: 400;"><br><br>
     A property management application that helps you manage your real estate portfolio with ease and efficiency. <br><br>
      You have successfully been registered to use Spade Rent as a <em>Tenant</em><br>
     <br>
      Your login credentials are provided below:
    <br>
    <span style="font-weight:bold;">Email: &nbsp;</span><span style="font-weight:lighter;" class="">${email}</span> 
     <br>
      <span style="font-weight:bold;">Password: &nbsp;</span><span style="font-weight:lighter;" class="">${password}</span>
    <br><br>  
    <br></td>
    </tr>
    </tbody></table></center>
    </td>
    </tr>
    <tr>
    <td class="">
    <div class="">
    <a style="background-color:#1467B0 ;border-radius:4px;color:#fff;display:inline-block;font-family: figtree; font-size:18px;font-weight:normal;line-height:50px;text-align:center;text-decoration:none;width:350px;-webkit-text-size-adjust:none;" href="http://app.spaderent.com/HTML/sash/Tenant/login_module.html">Visit Account and Start Managing</a>
    </div>
     <br>
    </td>
    </tr>
    </tbody>
      
      </table>
    
    <table bgcolor="#fff" cellpadding="0" cellspacing="0" class="force-full-width" style="margin: 0 auto; margin-bottom: 5px">
    <tbody>
    <tr>
    <td class="" style="color:#444;
                        ">
    <p>The password was auto-generated, however feel free to change it 
      
        <a href="#" style="text-decoration: underline;">
          here</a>
      
      </p>
      </td>
    </tr>
    </tbody></table></td>
    </tr>
    </tbody></table></center>
    </td>
    </tr>
    </tbody></table>
    </body></html>`;
};

exports.welcomeHTMLLANDLORD = (email, name) => {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml"><head><meta content="text/html; charset=utf-8" http-equiv="Content-Type"><meta content="width=device-width, initial-scale=1" name="viewport"><title>Spade Welcome Email</title><!-- Designed by https://github.com/kaytcat --><!-- Robot header image designed by Freepik.com --><style type="text/css">
      @import url(https://fonts.googleapis.com/css?family=Nunito);
    
      /* Take care of image borders and formatting */
    
      img {
        max-width: 600px;
        outline: none;
        text-decoration: none;
        -ms-interpolation-mode: bicubic;
      }
      html{
        margin: 0;
        padding:0;
      }
    
      a {
        text-decoration: none;
        border: 0;
        outline: none;
        color: #bbbbbb;
      }
    
      a img {
        border: none;
      }
    
      /* General styling */
    
      td, h1, h2, h3  {
        font-family: figtree;
        font-weight: 400;
      }
    
      td {
        text-align: center;
      }
    
      body {
        -webkit-font-smoothing:antialiased;
        -webkit-text-size-adjust:none;
        width: 100%;
        height: 100%;
        color: #666;
        background: #fff;
        font-size: 16px;
        height: 100vh;
        width: 100%;
        padding: 0px;
        margin: 0px;
      }
    
       table {
        border-collapse: collapse !important;
      }
    
      .headline {
        color: #444;
        font-size: 36px;
      }
    
     .force-full-width {
      width: 100% !important;
     }
    
    
      </style><style media="screen" type="text/css">
          @media screen {
            td, h1, h2, h3 {
                font-family: figtree !important;
            }
          }
      </style><style media="only screen and (max-width: 480px)" type="text/css">
        /* Mobile styles */
        @media only screen and (max-width: 480px) {
    
          table[class="w320"] {
            width: 320px !important;
          }
        }
      </style>
      <style type="text/css"></style>
      
      </head>
      <body bgcolor="#fff" class="body" style="padding:20px; margin:0; display:block; background:#ffffff; -webkit-text-size-adjust:none">
    <table align="center" cellpadding="0" cellspacing="0" height="100%" width="100%">
    <tbody><tr>
    <td align="center" bgcolor="#fff" class="" valign="top" width="100%">
    <center class=""><table cellpadding="0" cellspacing="0" class="w320" style="margin: 0 auto;" width="600">
    <tbody><tr>
    <td align="center" class="" valign="top"><table cellpadding="0" cellspacing="0" style="margin: 0 auto;" width="100%">
    </table>
    <table bgcolor="#fff" cellpadding="0" cellspacing="0" class="" style="margin: 0 auto; width: 100%; margin-top: 40px;">
    <tbody style="margin-top: 15px;">
      <tr class="">
    <td class="">
    
    </td>
    </tr>
    <tr class=""><td class="headline">Welcome <b>${name}</b> to Virtual Call Center!</td></tr>
    <tr>
    <td>
    <center class=""><table cellpadding="0" cellspacing="0" class="" style="margin: 0 auto;" width="75%"><tbody class=""><tr class="">
    <td class="" style="color:#444; font-weight: 400;"><br><br>
     You have successfully been registered to use Virtual Call Center as a <em>Agent</em><br>
     <br>

    <br><br>  
    <br></td>
    </tr>
    </tbody></table></center>
    </td>
    </tr>
    <tr>
    <td class="">
    <div class="">
    <a style="background-color:#1467B0 ;border-radius:4px;color:#fff;display:inline-block;font-family: figtree; font-size:18px;font-weight:normal;line-height:50px;text-align:center;text-decoration:none;width:350px;-webkit-text-size-adjust:none;" href="http://app.spaderent.com/HTML/sash/Landlord/login_module.html">Visit Account and Start Managing</a>
    </div>
     <br>
    </td>
    </tr>
    </tbody>
      
      </table>
    
    <table bgcolor="#fff" cellpadding="0" cellspacing="0" class="force-full-width" style="margin: 0 auto; margin-bottom: 5px">
    <tbody>
    <tr>
    <td class="" style="color:#444;
                        ">
    
      </td>
    </tr>
    </tbody></table></td>
    </tr>
    </tbody></table></center>
    </td>
    </tr>
    </tbody></table>
    </body></html>`;
};

exports.invoiceHTML = (tenantName, dueDays, invoiceID, landlordName,businessName) => {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
  </head>
  <body>
      <h4>Dear <span style="  color: #1467B0; ">${tenantName},</span></h4>
      <br>
      <p>Please find attached your rent and Due Date: <b>${dueDays}</b> If you have any questions,
            please let us know. </p>
  
            <p>Have a great day and thank you for your business<b>!</b></p>
  
            <p>Sincerely</p>
            <h4>${landlordName}</h4> 
            <p>${businessName}</p>
  </body>
  </html>`;
};

exports.taskHTML = (
  mailSubject,
  tenantName,
  dueDays,
  taskName,
  assignedTo,
  priority,
  landlordName,
  companyName,
  landLordContactInformation
) => {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link href="https://fonts.googleapis.com/css2?family=Quicksand&display=swap" rel="stylesheet">
      <title>Document</title>
      <style>
      body {
        font-family: 'Quicksand', sans-serif;
        width: 100%;
        height: 100%;        
        background: #fff;
        font-size: 18px;
        height: 100vh;
        max-width: 80%;
        margin: 20px auto;
        padding: 10px;    
        font-weight: 600;    
      }   
      
      div {
        background-color: aliceblue;
        padding: 20px 10px;
        border-radius: 10px;
      }

      ol {
        margin-left: -25px;
      }
      </style>
      
  </head>
  <body>
  <div>
   <center><img alt="Spade Rent" src="https://res.cloudinary.com/djhjn0ngj/image/upload/v1685012561/Logo_2_is7u6m.png" width="155" style="
  margin-bottom: 15px;
  "></center>            
      <h4>Dear <span style="  color: #1467B0; ">${tenantName},</span></h4>
      <p>We hope this email finds you well. We wanted to remind you of some upcoming property maintenance tasks that are
      scheduled in the near future. These tasks are important for maintaining the quality and safety of our property.
      </p>
      <p>Please take note of the following maintenance tasks:</p>
      <ul type="none" style="none">
      <li>
        <p>Date: <b>${dueDays}</b></p>
        <p>Task: <b>${taskName}</b></p>
        <p>Assigned To: <b>${assignedTo}</b></p>
        <p>Priority: <b>${priority}</b></p>
      </li>
      </ul>
      <p>
      It is crucial that these tasks are completed to ensure the smooth operation and longevity of the property. We kindly request
    your cooperation in allowing our maintenance team to access the premises during the designated time for efficient
    completion of these tasks.
      </p>
      <p>
      Should you have any questions or concerns regarding these maintenance tasks or need to reschedule, please don't hesitate
      to contact our property management team at <b>${landLordContactInformation}</b>. We are here to assist you.
      </p>
      <p>
      Thank you for your cooperation in keeping our property well-maintained and safe for everyone. We appreciate your attention
      to this matter.
      </p>
      <p>
      Best regards,
      </p>

      <h4><span style="  color: #1467B0; ">${landlordName},</span></h4>
      <h4><span style="  color: #1467B0; ">${companyName},</span></h4>
    </div>
  </body>
  </html>`;
};

exports.agentApprovedHTML = (name) => {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
  </head>
  <body>
      <h4>Dear <span style="  color: #1467B0; ">${name},</span></h4>
      <br>
      <p>Your application has been approved. You can now login to your account and start managing calls.</p>
  
            <p>Have a great day and thank you for your business<b>!</b></p>
  
            <p>Sincerely</p>
            <h4>CSH Team</h4> 
           
  </body>
  </html>`;
};

exports.caseSubmittedHTML = (name, caseID) => {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
  </head>
  <body>
      <h4>Dear <span style="  color: #1467B0; ">${name},</span></h4>
      <br>
      <p>Your case has been submitted successfully. Your Case ID is <b>${caseID}</b> </p>
      <p>Our agent will get back to you shortly. </p>
      
  
            <p>Have a great day and thank you for your business<b>!</b></p>
  
            <p>Sincerely</p>
            <h4>CSH Team</h4> 
           
  </body>
  </html>`;
}

exports.assignCaseHTML = (caseID, agentName) => {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
  </head>
  <body>
      <h4>Dear <span style="  color: #1467B0; ">User,</span></h4>
      <br>
      <p>Your case has been assigned to <b>${agentName}</b>. Your Case ID is <b>${caseID}</b> </p>
      <p>Our agent will get back to you shortly. </p>
      
  
            <p>Have a great day and thank you for your business<b>!</b></p>
  
            <p>Sincerely</p>
            <h4>CSH Team</h4> 
           
  </body>
  </html>`;
}
exports.assignCaseToAgentHTML = (name, caseID) => {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
  </head>
  <body>
      <h4>Dear <span style="  color: #1467B0; ">${name},</span></h4>
      <br>
      <p>You have been assigned a new case. Your Case ID is <b>${caseID}</b> </p>
      <p>Kindly login to your account and start managing the case. </p>
      
  
            <p>Have a great day and thank you for your business<b>!</b></p>
  
            <p>Sincerely</p>
            <h4>CSH Team</h4> 
           
  </body>
  </html>`;
}
exports.caseStatusChangeHTML = (caseID, status) => {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
  </head>
  <body>
      <h4>Dear <span style="  color: #1467B0; ">User,</span></h4>
      <br>
      <p>Your case status has been updated. Your Case ID is <b>${caseID}</b> </p>
      <p>Case Status: <b>${status}</b></p>
      
  
            <p>Have a great day and thank you for your business<b>!</b></p>
  
            <p>Sincerely</p>
            <h4>CSH Team</h4> 
           
  </body>
  </html>`;
}