const notificationController = require('../controller/notification');
const express = require('express');
const router = express.Router();

router.post('/send-notification', notificationController.sendNotification);

module.exports = router;