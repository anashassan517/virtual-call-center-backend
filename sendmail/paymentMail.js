exports.paymentHTML = (Name,subscriptionDate,Amount,planName) => {
        return `
        <!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Figtree&display=swap" rel="stylesheet">

  
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->

    <!-- Your title goes here -->
    <title>Email</title>

</head>
  <body style="font-family: 'Figtree'; text-align: left; margin: 0;padding-top: 10px;padding-bottom: 10px;padding-left: 0;padding-right: 0;-webkit-text-size-adjust: 100%;background-color: #f2f4f6;color: #000000;background-image: url(https://spades3bucket.s3.amazonaws.com/1697540494792_Frame-2.jpg);background-repeat: no-repeat;">
  <div style="text-align: left;">
    <table align="center" style="box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px; text-align: left; vertical-align: top; width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 20px 20px 0 0 ;">
      <tbody>
        <tr>
          <td style="width: 596px; vertical-align: top; padding-left: 0; padding-right: 0; padding-top: 15px; padding-bottom: 15px;" width="596">
            <img style="width: 180px; max-width: 205px; height: 55px; max-height: 70px; text-align: right; color: #ffffff;" alt="Logo" src="https://res.cloudinary.com/djhjn0ngj/image/upload/v1685012561/Logo_2_is7u6m.png" align="left" width="180" height="85">
		</td>
  </tr>
  <tr style="text-align: left;">
  <td>
    <span style="font-size: 16px;margin-bottom: 10px;"><b>Connect with us: 
      <a href="https://www.facebook.com/spadetx"><img
        src="https://spades3bucket.s3.amazonaws.com/1697540932817_facebook.png" width="20px" alt=""> Facebook | </a>
      <a href="#"> <img
        src="https://spades3bucket.s3.amazonaws.com/1697543322886_twiter.png" width="20px" alt=""> Twitter |</a>
      <a href="https://www.linkedin.com/company/spade-pay/"> <img
        src="https://spades3bucket.s3.amazonaws.com/1697543134705_linkdin.png" width="20px" alt=""> LinkedIn</a>
     </b></span>
    <br>
    <br>

  </td>
    
		</tr>
    </table>
    <!-- End container for logo -->

    <!-- Hero image -->
    <!-- <img style="width: 600px; max-width: 600px; height: 350px; max-height: 350px; text-align: center;" alt="Hero image" src="https://fullsphere.co.uk/misc/free-template/images/hero.jpg" align="center" width="600" height="350"> -->
    <!-- Hero image -->

    <!-- Start single column section -->
    <div style="max-width: 100%; margin: 0 auto;">
    <!-- <table align="center" style="box-shadow:rgba(0, 0, 0, 0.1) 0px 4px 12px; text-align: center; vertical-align: top; width: 900px; max-width: 900px; background-color: #ffffff; border-radius: 0 0 20px 20px;" width="600">
        <tbody>
          <tr> -->
            <table align="center" style="box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px; text-align: left; vertical-align: top; width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 0 0 20px 20px;">
              <tbody>
                  <tr>
            
          <td style="width: 100%; vertical-align: top; padding: 30px;">
            <h1 style="font-size: 20px; line-height: 24px; font-family: 'Figtree'; font-weight: 600; text-decoration: none; color: #000000; text-align: start;">Dear ${Name},</h1>
            <p style="font-size: 15px; line-height: 24px; font-family: 'Figtree'; font-weight: 400; text-decoration: none; color: black; text-align: start;">We're thrilled to welcome you to the <b>Spade Rent</b> family! Thank you for subscribing to our amazing service.</p>
            <p style="font-size: 15px; line-height: 24px; font-family: 'Figtree'; font-weight: 400; text-decoration: none; color: black; text-align: start;">We're excited to have you on board as a subscriber to our property management services. Your journey with us is just beginning, and we are here to make your experience as a property owner or tenant as smooth and enjoyable as possible.</p>
        </td>
    </tr>
          <tr>
          <td  >
           <h1 style="
           text-align: left;
       ">Invoice Details</h1>
           <hr style="
           color: black;
           width: 70px;
           height: 8px;
           background-color: rgb(22, 114, 186);
           border-radius: 10px;
           margin: 0px;
       ">
          </td>
          <tr>
            <td style="
            display: flex;
        ">
              <h3>Invoice Name : </h3>
              <h3 style="
              margin: 20px;
          ">  ${planName} </h3>
            </td>
          </tr>

          <tr>
            <td style="
            display: flex;
        ">
              <h3>Amount Charged : </h3>
              <h3 style="
              margin: 20px;
          ">  ${Amount} </h3>
            </td>
          </tr>

          </tr>

          <tr>
            <td>
              <h1 style="
           text-align: left;
       ">Breakdown of Charges</h1>
           <hr style="
           color: black;
           width: 134px;
           height: 8px;
           background-color: rgb(22, 114, 186);
           border-radius: 10px;
           margin: 0px;
       ">
            </td>
          </tr>
          <tr>
            <td>
              
              <br>  
              <br>  
              <br>  
                    
              <table style="width: 100%; border-collapse: collapse; margin: 0; padding: 0;">
                <thead>
                    <tr>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background: rgb(80, 172, 223);">CATEGORY</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background: rgb(80, 172, 223);">TAX %</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background: rgb(80, 172, 223);">AMOUNT</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background: rgb(80, 172, 223);">subscription Date</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="background: #f2f2f2;">
                        <td style="border: 1px solid #ddd; padding: 8px; text-align: left; background: rgb(226 245 255);">${planName}</td>
                        <td style="border: 1px solid #ddd; padding: 8px; text-align: left; background: rgb(226 245 255);">0%</td>
                        <td style="border: 1px solid #ddd; padding: 8px; text-align: left; background: rgb(226 245 255);">${Amount}</td>
                        <td style="border: 1px solid #ddd; padding: 8px; text-align: left; background: rgb(226 245 255);">${subscriptionDate}</td>
                    </tr>
                </tbody>
            </table>
                
            
            </td>
          </tr>
          <tr>
            <td>
              <br>
              <br>
              <br>
              <br>
              <hr>
              <br>
            </td>
          </tr>

          <tr>
            <td style="
            display: flex;
            justify-content: end;
        ">
              <h3>Subtotal : </h3>
              <h3 style="
              display: flex;
              justify-content: end;
              margin: 20px;
          ">  ${Amount} </h3>
            </td>
          </tr>

          <tr>
            <td style="
            display: flex;
            justify-content: end;
        ">
              <h3>Discount : </h3>
              <h3 style="
              display: flex;
              justify-content: end;
              margin: 20px;
          ">  $0 </h3>
            </td>
          </tr>

          <tr>
            <td style="
            display: flex;
            justify-content: end;
        ">
              <h3>Tax : </h3>
              <h3 style="
              display: flex;
              justify-content: end;
              margin: 20px;
          ">  $0 </h3>
            </td>
          </tr>
          <tr>
            <td style="
            display: flex;
            justify-content: end;
        "> <hr style="
    width: 15%;
    position: absolute;
    height: 2px;
    background: black;
"></td>
          </tr>
          <tr>
            <td style="
            display: flex;
            justify-content: end;
        ">
              <h3>Total : </h3>
              <h3 style="
              display: flex;
              justify-content: end;
              margin: 20px;
          ">  ${Amount} </h3>
            </td>
          </tr>

          <tr>
            <td style="
            text-align: left;
        ">
              <h1>Need Assistance or Have Question?</h1>
              <hr style="
              color: black;
              width: 134px;
              height: 8px;
              background-color: rgb(22, 114, 186);
              border-radius: 10px;
              margin: 0px;
          ">
            </td>
          </tr>
          <tr>
            <td>
            <p style="
            text-align: left;
        ">If you have any questions about this invoice, require further clarification on any charges, or need assistance with the payment process, please don’t hesitate to reach out to us at <b> support@spaderent.com </b> or <b> 832-570-9042 </b>. We’re here to help!</p>
            <p style="
            text-align: left;
        ">We appreciate your prompt attention to this matter and your continued cooperation in fostering a positive landlord-tenant relationship.</p>
            <p style="
            text-align: left;
        ">This is an automated message. Please do not reply to this email. For inquiries or support, contact us directly at <b> support@spaderent.com</b> or <b>832-570-9042</b>.</p>
          </td>
          </tr>
        </tbody>
      </table>
    </div>
      <!-- End single column section -->

  </div>

  </body>

</html>`
    };