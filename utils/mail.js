exports.buyMail = (data) => {
  return `
  <html>
  <head>
      <title>CRYPYBLIS</title>
  </head>
  <body>
      <h3 style="color: brown; font-size: 20px; margin-left: auto; margin-right: auto;">Transaction Initiated</h3>
      <div style="margin-top: 10px; " >
          <p style="margin-bottom: 20px;">
              ${data.firstname} ${data.lastname} has requested to buy Crypto from you and has transafered the money to your account, the following is the prove of his payment and ${data.crypto_type} address for you to send the crypto
          </p>
          <h3 style="margin-top: 10px; margin-bottom: 10px;"> Transaction Info </h3>
          <div style="display: flex; margin-top: 5px;">
              <p style="margin-right: 5px;">${data.crypto_type} ADDRESS:</p>
              <p>${data.crypto_address}</p>
          </div>
          <div style="display: flex; margin-top: 5px;">
              <p style="margin-right: 5px;">${data.crypto_type} Amount expected:</p>
              <p>${data.btc_amount}</p>
          </div>
          <div style="display: flex; margin-top: 5px;">
              <p style="margin-right: 5px;">Cash Amount paid:</p>
              <p>${data.currency}${data.cash_amount}</p>
          </div>
          <div style="margin-top: 15px;">
              <p>Prove of Payment</p>
          </div>
      </div>
  </body>
</html>
    `;
};

exports.sellMail = (data) => {
  return `
    <html>
    <head>
        <title>CRYPYBLIS</title>
    </head>
    <body>
        <h3 style="color: brown; font-size: 20px; margin-left: auto; margin-right: auto;">Transaction Initiated</h3>
        <div style="margin-top: 10px;" >
            <p style="margin-bottom: 20px;">
                ${data.firstname} ${data.lastname} has sent  Crypto to your ${data.crypto_type} address , the following is the prove of his transfer to your ${data.crypto_type} address and his account information for you to pay him
            </p>
            <h3 style="margin-top: 10px; margin-bottom: 10px;"> Transaction Info </h3>
            <div style="display: flex; margin-top: 5px;">
                <p style="margin-right: 5px;">Bank name: </p>
                <p>${data.account_name}</p>
            </div>
            <div style="display: flex; margin-top: 5px;">
            <p style="margin-right: 5px;">Bank account number: </p>
            <p>${data.account_number}</p>
        </div>
            <div style="display: flex; margin-top: 5px;">
                <p style="margin-right: 5px;">${data.crypto_type} Amount sent:</p>
                <p>${data.btc_amount}</p>
            </div>
            <div style="display: flex; margin-top: 5px;">
                <p style="margin-right: 5px;">Cash Amount expected:</p>
                <p>${data.currency}${data.cash_amount}</p>
            </div>
            <div style="margin-top: 15px;">
                <p>Prove of Payment</p>
            </div>
        </div>
    </body>
  </html>
      `;
};

exports.borrowMail = (data) => {
  return `
      <html>
      <head>
          <title>CRYPYBLIS</title>
      </head>
      <body>
          <h3 style="color: brown; font-size: 20px; margin-left: auto; margin-right: auto;">Transaction Initiated</h3>
          <div style="margin-top: 10px;" >
              <p style="margin-bottom: 20px;">
                  ${data.firstname} ${data.lastname} has deposited some  Crypto to your ${data.crypto_type} address as collateral for loan , the following is the prove of his transfer to your ${data.crypto_type} address and his account information where you are to send the money requested for borrowing
              </p>
              <h3 style="margin-top: 10px; margin-bottom: 10px;"> Transaction Info </h3>
              <div style="display: flex; margin-top: 5px;">
                  <p style="margin-right: 5px;">Bank name: </p>
                  <p>${data.account_name}</p>
              </div>
              <div style="display: flex; margin-top: 5px;">
              <p style="margin-right: 5px;">Bank account number: </p>
              <p>${data.account_number}</p>
          </div>
              <div style="display: flex; margin-top: 5px;">
                  <p style="margin-right: 5px;">${data.crypto_type} Amount deposited:</p>
                  <p>${data.btc_amount}</p>
              </div>
              <div style="display: flex; margin-top: 5px;">
                  <p style="margin-right: 5px;">Cash Amount expected as loan:</p>
                  <p>${data.currency}${data.cash_amount}</p>
              </div>
              <div style="margin-top: 15px;">
                  <p>Prove of Payment</p>
              </div>
          </div>
      </body>
    </html>
        `;
};

exports.repayMail = (data) => {
  return `
        <html>
        <head>
            <title>CRYPYBLIS</title>
        </head>
        <body>
            <h3 style="color: brown; font-size: 20px; margin-left: auto; margin-right: auto;">Transaction Initiated</h3>
            <div style="margin-top: 10px;" >
                <p style="margin-bottom: 20px;">
                    ${data.firstname} ${data.lastname} has repayed the loan he requested for , the following is the prove of loan repayment with his BTC address for you to transfer his deposited bitcoin
                </p>
                <h3 style="margin-top: 10px; margin-bottom: 10px;"> Transaction Info </h3>
            </div>
            <div style="display: flex; margin-top: 5px;">
            <p style="margin-right: 5px;">Transaction ID:</p>
            <p>${data.transactionId}</p>
        </div>
                <div style="display: flex; margin-top: 5px;">
                    <p style="margin-right: 5px;">BTC address:</p>
                    <p>${data.btc}</p>
                </div>
                <div style="margin-top: 15px;">
                    <p>Prove of Payment</p>
                </div>
            </div>
        </body>
      </html>
          `;
};

exports.otpMail = (data) => {
  return `
          <html>
          <head>
              <title>CRYPYBLIS</title>
          </head>
          <body>
              <h3 style="color: brown; font-size: 20px; margin-left: auto; margin-right: auto;">One Time Password</h3>
              <div style="margin-top: 10px;" >
                  <p style="margin-bottom: 20px;">
                      Your One Time Password is ${data}
                  </p>
                  <p style="margin-top: 10px; margin-bottom: 10px;"> It will expire in 2 minutes</p>
              </div>
          </body>
        </html>
            `;
};
