exports.propertyHTML = (propertyName,pAddress,propertyType,propertySQFT,units,userName) => {
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

  <title>Property-Email</title>

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
      <div class="col-lg-8 main-div-class" style="background-color: #fff;
      padding: 65px;
      border-radius: 10px;
      box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;">
        <div class="main-div-classs" style="text-align: left;background-color: #fff;
        padding: 65px;
        border-radius: 10px;
        box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;">
       
          <img alt="Spade Rent" src="https://res.cloudinary.com/djhjn0ngj/image/upload/v1685012561/Logo_2_is7u6m.png"
            width="140" style="
       margin-bottom: 15px;
       ">
  <hr>
          <h3>Dear, <span style="color: #1467B0;"><b>${userName}</b></span></h3>
          <p>We hope this message finds you well. We are thrilled to share some exciting news with you – a new property has just been added to our exclusive listings, and we couldn't wait to let you know!
          </p>
          <br>
          <div>
            <h4 style="font-weight: bold; margin-top: 2px;">🏡 Property Details:</h4>
          </div>
          <div
            style="height: 7px; width: 60px; background-color: #1467B0; border-radius: 30px; margin-bottom: 20px; margin-top: 5px;">
          </div>
          <ul>
            <li><p>Property Name: <b>${propertyName}</b></p></li>
            <li><p>Address: <b>${pAddress}</b></p></li>
            <li><p>Type: <b>${propertyType}</b></p></li>
            <li><p>Square Footage: <b>${propertySQFT}</b><b style="color: #1467B0;">Sqft.</b></p></li>
            <li><p>Property Units: <b>${units}</b></p></li>
            </ul>

          <p>We're committed to ensuring your comfort and safety, and our team is gearing up to resolve this issue efficiently. Here’s what to expect next:</p>
          <br>
          <div style="display: flex; align-items: flex-start;"><img src="../assets/images/icons/refresh-icon.png" alt=""> &nbsp;&nbsp;<h4 style="font-weight: bold;"> Need to Reschedule or Have Questions?</h4>
          </div>
          <div
            style="height: 7px; width: 60px; background-color: #1467B0; border-radius: 30px; margin-bottom: 20px; margin-top: 5px;">
          </div>
          <p>
            If the scheduled date doesn’t work for you or if you have any questions or concerns, please reach out to our support team at [832-570-9042] or reply to this email. We're here to assist! <br>
Thank you for your cooperation and understanding. We aim to make this process as smooth as possible for you and appreciate your help in maintaining the quality of your living space.
          </p>
          <p>Best regards,</p>
          
          <h5><span style="color:#1467B0; font-weight: bold;">The Spade Rent Team</span></h5>
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

`
};