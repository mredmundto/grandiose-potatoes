var path = require('path');
var db = require('./db/db');
var AWS = require('aws-sdk');
var key = require('./config')
AWS.config.update({accessKeyId: key.accessKeyId, secretAccessKey: key.secretAccessKey});
AWS.config.update({region: 'us-east-1'});
var shortid = require('shortid');

// teammates: please create a config.js file in the same directory and paste the code below 
// module.exports = {
//   accessKeyId: 'in Slack or speak to Edmund',
//   secretAccessKey: 'in Slack or speak to Edmund',
// };

module.exports = {

  questions: {
    get: function(req, res) {
      db.Question.findAll().then(function(questions) {
        res.send(questions);
      });
    },
    post: function(req, res) {
      var question = req.body.txt
      db.Question.create({txt: question})
        .then(function(question) {
        res.end();
      })
    }
  },

  users: {
    get: function(req, res) {
      //user validation
    },
    post: function(req, res) {
      //check if username already exists
        //if so send respond to client to type new username
      //else
        //create new userObject, hash password, etc.
        //write to database
    }
  },
  
  videos: {
    get: function(req, res) {},
    post: function(req,res) {
       console.log('in the post');
    },
    presigned: function(req, res) {
      //Generate unique filename for video
      var awsFilename = Date.now() + '-' + shortid.generate();
      // Get pre-signed URL from S3 then send back to client and client will do the PUT request to S3
      // pre-signed URL will be valid for 600 seconds 
      var s3 = new AWS.S3();
      var params = {
        //Setup with your bucket name
        Bucket: 'greenfield-hr44', 
        Key: awsFilename, 
        ContentType: 'video/webm',
        ACL: 'public-read', 
        Expires: 600
      }; // this is the time which the URL is available for putting file
      
      var preSignedUrl = s3.getSignedUrl('putObject', params);

      //Format of publicUrl
      var publicUrl = 'https://s3.amazonaws.com/'+ params.Bucket +'/' + params.Key;

      res.send({preSignedUrl: preSignedUrl, publicUrl: publicUrl});  
    }
  },

  home: {
    get: function(req, res) {
      console.log('in the home');
      res.sendFile(path.resolve(__dirname + '/../client/index.html'));
    }
  }



};
