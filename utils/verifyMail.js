exports.verifyMail = (url) => `
<html>
    <head>
        <title>CRYPYBLIS</title>
    </head>
    <body>
        <h3 style="color: brown; font-size: 20px; margin-left: auto; margin-right: auto;">Welcome  to CRYPT WAVI</h3>
        <div style="margin-top: 10px; width: 70%;" >
            <p style="margin-bottom: 20px;">
                Welcome to Crypt Wavi, click on the link below to verify your email to allow you login your account
            </p>
            <div style="display: flex; margin-top: 5px;">
                <a href=${url} style="font-size: 19px;" >VERIFY EMAIL</a>
            </div>
        </div>
    </body>
</html>
`;
