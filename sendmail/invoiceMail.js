exports.invoiceHTML0 = (tenantName,address,dueDate,terms,additionalNotes,lineItems,totalAmount,LandlordName,LandlordPhone,BusinessAddress) => {
    let itemRows = '';

    for (let i = 0; i < lineItems.length; i++) {
        itemRows += `
            <tr>
                                <td>
                                    <p style="font-weight: bold;" class="mb-1"><b>${lineItems[i].memo}</b></p>
                                </td>
                                <td>${lineItems[i].category}</td>
                                <td>${lineItems[i].tax}</td>
                                <td>${lineItems[i].amount}</td>
                            </tr>
        `;
    }
    return ` 
    <!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css"
    integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

  <link
    href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Berkshire+Swash&family=Great+Vibes&family=Inter&family=Tilt+Prism&display=swap"
    rel="stylesheet">

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
    <div class="row" style="display: flex; justify-content: center;">
      <!-- <div class="col-lg-2"></div> -->
      <div class="col-lg-10 main-div-class" style=" background-color: #fff;
      padding: 65px;
      border-radius: 10px;
      box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;">
        <div class="main-div-classs" style="text-align: left; background-color: #fff;
        padding: 65px;
        border-radius: 10px;
        box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;">
       
          <img alt="Spade Rent" src="https://res.cloudinary.com/djhjn0ngj/image/upload/v1685012561/Logo_2_is7u6m.png"
            width="140" style="
       margin-bottom: 15px;
       ">
          <br>
          <span style="font-size: 16px;margin-bottom: 10px;"><b>Connect with us: <img
                src="https://spades3bucket.s3.amazonaws.com/1697540932817_facebook.png" width="20px" alt=""> Facebook | <img
                src="https://spades3bucket.s3.amazonaws.com/1697543322886_twiter.png" width="20px" alt=""> Twitter | <img
                src="https://spades3bucket.s3.amazonaws.com/1697543134705_linkdin.png" width="20px" alt=""> LinkedIn</b></span>
          <br>
          <br>

          <h3>Dear, <span style="color: #1467B0;"><b>${tenantName}</b></span></h3>
          <p>We hope this message finds you well. This email serves as your monthly invoice for the rental property at
            <b>${address}</b>. Please find the details below:
          </p>
          <div>
            <h4 style="font-weight: bold; margin-top: 2px;">Invoice Details</h4>
          </div>
          <div
            style="height: 7px; width: 60px; background-color: #1467B0; border-radius: 30px; margin-bottom: 20px; margin-top: 5px;">
          </div>
          <span class="mt-3">Property Address: <b>${address}</b></span><br><br>
          <span class="mt-3">Due Date: <b>${dueDate}</b></span><br><br>
          <span class="mt-3">Terms: <b>${terms}</b></span><br><br>
          <span class="mt-3">Total Amount : <b>${totalAmount}</b></span><br><br>
          <div>
            <h4 style="font-weight: bold; margin-top: 2px;">Breakdown of Charges</h4>
          </div>
          <div
            style="height: 7px; width: 60px; background-color: #1467B0; border-radius: 30px; margin-bottom: 20px; margin-top: 5px;">
          </div>
        <!-- table start  -->
        <div class="row mb-5">
            <div class="col-12">
                <div class="table-responsive">
                    
                </div>
            </div>
        </div>
        <div class="row mb-5">
            <div class="col-12">
                <div class="table-responsive">
                    <table class="table-hover table border text-nowrap text-md-nowrap mb-0">
                        <thead style="background: lightgray;">
                            <tr>
                                <th>DESCRIPTION</th>
                                <th>CATEGORY</th>
                                <th>TAX %</th>
                                <th>AMOUNT</th>
                            </tr>
                        </thead>
                        <tbody>
                            
                            ${itemRows}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="row mb-5">
            <div class="col-md-7 d-flex align-items-end">
                <div class="">
                    <h6 class="fw-bold mb-1" style="color: 
            #1467B0;"><b>MEMO</b></h6>
                    <P class="text-dark">${additionalNotes}</P>
                </div>
            </div>
            <div class="col-md-5">
                <div class="table-responsive">
                    <table class="table-hover table border text-nowrap text-md-nowrap table-borderless mb-0">
                        <tbody>
                    
                            <tr style="    border-bottom: 2px solid #1467B0;"></tr>
                            <tr>
                                <td class="fw-bold"><b>Total</b></td>
                                <td class="fw-bold"><b>${totalAmount}</b></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <!-- table End  -->

          <div>
            <h4 style="font-weight: bold; margin-top: 2px;">Payment Instructions</h4>
          </div>
          <div
            style="height: 7px; width: 60px; background-color: #1467B0; border-radius: 30px; margin-bottom: 20px; margin-top: 5px;">
          </div>
          <ol style="margin-left: -25px;">
            <li> Online Payment: Log in to your <b><a href="https://app.spaderent.com/HTML/sash/Tenant/login_module.html">Tenant Portal</a></b> to pay securely using your preferred payment method.</li><br>
            <li> Bank Transfer: Send the payment to our bank account.</li><br>
            <li> Check/Money Order: Addressed to <b>${LandlordName}</b>, mailed to <b>${BusinessAddress}</b>.</li><br>
          </ol>

          <div>
            <h4 style="font-weight: bold; margin-top: 2px;">Late Payment Policy</h4>
          </div>
          <div
            style="height: 7px; width: 60px; background-color: #1467B0; border-radius: 30px; margin-bottom: 20px; margin-top: 5px;">
          </div>
          <p>Please note that payments received after the due date will be subject to a late fees. To avoid any additional charges, we recommend paying your invoice on or before the due date.</p>
          
          <div>
            <h4 style="font-weight: bold; margin-top: 2px;">Need Assistance or Have Questions?</h4>
          </div>
          <div
            style="height: 7px; width: 60px; background-color: #1467B0; border-radius: 30px; margin-bottom: 20px; margin-top: 5px;">
          </div>
          <p>If you have any questions about this invoice, require further clarification on any charges, or need assistance with the payment process, please don’t hesitate to reach out to us at <b>support@spaderent.com</b> or <b>832-570-9042</b>. We’re here to help!
          </p>
          <br>
          <p>We appreciate your prompt attention to this matter and your continued cooperation in fostering a positive landlord-tenant relationship.</p>
          
          <p> Warm Regards,<br>
          <b>${LandlordName}</b></p>
          <p><b>${LandlordPhone}</b></p>
          <br>
          <p>This is an automated message. Please do not reply to this email. For inquiries or support, contact us directly at <b style="color: #1467B0;">support@spaderent.com</b> or <b style="color: #1467B0;">832-570-9042.</b></p>
        </div>

      </div>
    </div>
  </div>

  <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js"
    integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN"
    crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/popper.js@1.12.9/dist/umd/popper.min.js"
    integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q"
    crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js"
    integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl"
    crossorigin="anonymous"></script>
</body>

</html>
    `;

    // return `<!DOCTYPE html>
    // <html lang="en">
    // <head>
    //     <meta charset="UTF-8">
    //     <meta http-equiv="X-UA-Compatible" content="IE=edge">
    //     <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //     <title>Document</title>
    // </head>
    // <body>
    //     <h4>Dear <span style="  color: #1467B0; ">${tenantName},</span></h4>
    //     <br>
    //     <p>Please find attached your rent and Due Date: <b>${dueDays}</b> If you have any questions,
    //           please let us know. </p>
    
    //           <p>Have a great day and thank you for your business<b>!</b></p>
    
    //           <p>Sincerely</p>
    //           <h4>${landlordName}</h4> 
    //           <p>${businessName}</p>
    // </body>
    // </html>`;
  };
// exports.invoiceHTML1 = (tenantName, dueDays, invoiceID, landlordName,businessName) => {
//     return `<!doctype html>
//     <html lang="en">
    
//     <head>
//         <!-- Required meta tags -->
//         <meta charset="utf-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    
//         <!-- Bootstrap CSS -->
//         <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css"
//             integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    
//         <title>Hello, world!</title>
//     </head>
    
//     <body>
//         <div class="container" style="margin-top: 150px;">
//             <div class="row">
//                 <div class="col-lg-2"></div> 
//                 <div class="col-lg-8 text-center" style="background: #1467b0; color: #fff; padding: 25px;">
//                     <h4>Dear <span style="color: #000;">${tenantName},</span></h4>
//                     <br>
//                     <p>Please find attached your rent invoice with number and Due Date: <b>${dueDays}</b> If you have any questions,
//                         please let us know. </p>
    
//                     <p>Have a great day and thank you for your business<b>!</b></p>
    
//                     <p>Sincerely</p>
//                     <h4>${landlordName}</h4> 
//                     <p>${businessName}</p>
    
//                 </div>
                
//             </div>
//         </div>
    
//     </body>
    
//     </html>`;
//   };


