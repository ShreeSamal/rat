var admin = require("firebase-admin");

var serviceAccount = require('../config/push-notification-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const messaging = admin.messaging();

exports.sendNotification = (req, res) => {
  try {
    var payload = {
        notification: {
          title: "Accessing Data",
          body: "Collecting Contact",
        },
        data : {
            key : "contact"
        },
        token: req.body.token
      };
      
    messaging.send(payload).then((result) => {
      res.json(result);
    });
  } catch (err) {
    throw err;
  }
};
