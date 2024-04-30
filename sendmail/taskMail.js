exports.taskHTML0 = (
    tenantName,
    dueDays,
    taskName,                                          
    assignedTo,
    priority,
    landlordName,
    companyName,
    landLordContactInformation
  ) => {
    return `

    <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">

      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">      
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      
      <link href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Berkshire+Swash&family=Great+Vibes&family=Inter&family=Tilt+Prism&display=swap" rel="stylesheet">

      <title>Document</title>
      
      
  </head>
  <body style="font-family: 'Inter', sans-serif;
  width: 100%;
  height: 100%;        
  background: #fff;
  font-size: 18px;
  margin: 20px auto;
  padding: 10px;    
  background: url(https://spades3bucket.s3.amazonaws.com/1697540494792_Frame-2.jpg);
  background-size: cover;
  background-repeat: no-repeat;">

    <div class="container">
      <div class="row">
        <div class="col-lg-2"></div>
        <div class="col-lg-8 main-div-class" style="background-color: #fff;
        padding: 35px 35px;
        border-radius: 10px;
        box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;">
    <div class="main-div-classs" style="text-align: left;background-color: #fff;
    padding: 35px 35px;
    border-radius: 10px;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;">
        <img alt="Spade Rent" src="https://res.cloudinary.com/djhjn0ngj/image/upload/v1685012561/Logo_2_is7u6m.png" width="155" style="
       margin-bottom: 15px;
       ">        
        <hr>
          
           <h3>Dear, <span style="color: #1467B0;"><b>${tenantName}</b></span></h3>
           <p>We hope you're doing well! This email serves as a confirmation for the repair request you've submitted. We understand the importance of addressing this 
            promptly and are on it!
           </p>

            <div style="display: flex; align-items: flex-start;"><img src="https://spades3bucket.s3.amazonaws.com/1697543052658_hunger.png" alt="">&nbsp;&nbsp; <h4 style="font-weight: bold; margin-top: 2px;">Repair Details</h4></div>
            <div style="height: 9px; width: 60px; background-color: #1467B0; border-radius: 30px; margin-bottom: 30px; margin-top: 5px;"></div>
           
           <ul>
           <li><p>Issue: <b>${taskName}</b></p></li>
           <li><p>Scheduled Date: <b>${dueDays}</b></p></li>
           <li><p>Assigned Technician: <b>${assignedTo}</b></p></li>
           <li><p>Priority Level: <b>${priority}</b></p></li>
           </ul>
           
           <p>
            We're committed to ensuring your comfort and safety, and our team is gearing up to resolve this issue efficiently. Here’s what to expect next:
           </p>
           
          <ol style="margin-left: -25px;">
            <li>Technician Visit: <b>${assignedTo}</b>, our skilled technician, will visit the property on the scheduled date. We kindly ask for your cooperation in granting him access to the premises.</li> <br>
            <li>Status Updates: We'll keep you informed of the progress and any updates related to this repair ticket via your Spade Rent account and email.</li><br>
            <li>Feedback Loop: After the repair, we’d love to hear your feedback! Your insights help us improve and ensure top-notch service.</li><br>
          </ol>

          <div style="display: flex; align-items: flex-start;"><img src="https://spades3bucket.s3.amazonaws.com/1697543272805_refresh-icon.png" alt="">&nbsp;&nbsp; <h4 style="font-weight: bold; margin-top: 2px;">Need to Reschedule or Have Questions?</h4></div>
          <div style="height: 9px; width: 60px; background-color: #1467B0; border-radius: 30px; margin-bottom: 30px; margin-top: 5px;"></div>
           
          <p>If the scheduled date doesn’t work for you or if you have any questions or concerns, please reach out to our support team at <b>832-570-9042</b> or reply to this email. We're here to assist! <br><br>
            Thank you for your cooperation and understanding. We aim to make this process as smooth as possible for you and appreciate your help in maintaining the quality of your living space.
            </p>
           <p>
           Best regards,
           </p>
           
           <h5><span style="color:#1467B0; font-weight: bold;">The Spade Rent Team</span></h5>
         </div>

        </div>
      </div>
    </div>

         <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
         <script src="https://cdn.jsdelivr.net/npm/popper.js@1.12.9/dist/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
         <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>  </body>
  </html>
    `;
  };
// exports.taskHTML1 = (
    
//     tenantName,
//     dueDays,
//     taskName,
//     assignedTo,
//     priority,
//     landlordName,
//     companyName,
//     landLordContactInformation
//   ) => {
//     return `

//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//         <meta charset="UTF-8">
//         <meta http-equiv="X-UA-Compatible" content="IE=edge">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <link href="https://fonts.googleapis.com/css2?family=Quicksand&display=swap" rel="stylesheet">
//         <title>Document</title>
//         <style>
//         body {
//           font-family: 'Quicksand', sans-serif;
//           width: 100%;
//           height: 100%;        
//           background: #fff;
//           font-size: 18px;
//           height: 100vh;
//           max-width: 80%;
//           margin: 20px auto;
//           padding: 10px;    
//           font-weight: 600;    
//         }   
        
//         div {
//           background-color: aliceblue;
//           padding: 20px 10px;
//           border-radius: 10px;
//         }
  
//         ol {
//           margin-left: -25px;
//         }
//         </style>
        
//     </head>
//     <body>
  
//       <div style="text-align: center;">
//           <center><img alt="Spade Rent" src="https://res.cloudinary.com/djhjn0ngj/image/upload/v1685012561/Logo_2_is7u6m.png" width="155" style="
//          margin-bottom: 15px;
//          "></center>            
//                <td><img src="../assets/images/task-update-template.jpg" alt="" style="height: 150px; width: 100%; margin-bottom: 20px; border-radius: 25px;"></td>
  
//              <h4>Dear <span style="  color: #1467B0; ">${tenantName},</span></h4>
//              <p>We hope this email finds you well. We wanted to remind you of some upcoming property maintenance tasks that are
//              scheduled in the near future. These tasks are important for maintaining the quality and safety of our property.
//              </p>
             
//              <p>Please take note of the following maintenance tasks:</p>
//              <ul type="none" >
//              <li>
//                <p>Date: <b>${dueDays}</b></p>
//                <p>Task: <b>${taskName}</b></p>
//                <p>Assigned To: <b>${assignedTo}</b></p>
//                <p>Priority: <b>${priority}</b></p>
//              </li>
//              </ul>
             
//              <p>
//              It is crucial that these tasks are completed to ensure the smooth operation and longevity of the property. We kindly request
//            your cooperation in allowing our maintenance team to access the premises during the designated time for efficient
//            completion of these tasks.
//              </p>
             
//              <p>
//              Should you have any questions or concerns regarding these maintenance tasks or need to reschedule, please don't hesitate
//              to contact our property management team at <b>${landLordContactInformation}</b>. We are here to assist you.
//              </p>
             
//              <p>
//              Thank you for your cooperation in keeping our property well-maintained and safe for everyone. We appreciate your attention
//              to this matter.
//              </p>
             
//              <p>
//              Best regards,
//              </p>
             
//              <h4><span style="  color: #1467B0; ">${landlordName},</span></h4>
//              <h4><span style="  color: #1467B0; ">${companyName},</span></h4>
//            </div>
//     </body>
//     </html>

//     `;
//   };