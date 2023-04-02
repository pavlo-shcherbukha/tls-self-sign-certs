var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log('=======================================');
  console.log('test tls connection /users')
  console.log( 'ClientID=' + req.get('client'))
  console.log('=======================================');
  console.log("2-Prepare Response Data");

  let userlist=[
    { "user_id": 1, "username": "usr1", "fullname": "Petro Petrovnch"},
    { "user_id": 2, "username": "usr2", "fullname": "Semen Semenov"},
    { "user_id": 3, "username": "usr3", "fullname": "Odarka Petrivna"}
  ]
  console.log("3-SEND RESPONSE");
  res.status(200).json(userlist);

});

module.exports = router;
