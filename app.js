// Requiring required packages
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
// Creating instance of express
app = express();
// Setting use.static to serve static files
app.use(express.static("public"));
// Setting body pasrser
app.use(bodyParser.urlencoded({extended: true}));
// Listening to port 3000 and heroku hosted port
app.listen(process.env.PORT || 3000,function(){
  console.log("server is running on port 3000");
});
// Post request function for root
app.post("/",function(req,res)
{
  // Declaring variables
  var firstName = req.body.fName;
  var lastName = req.body.lName;
  var email = req.body.email;
  var data = {
    members: [
        {
          email_address: email,
          status:"subscribed",
          merge_fields:{
            FNAME: firstName,
            LNAME: lastName
          }
        }
    ]
  };
  // Converting JSON file to a JS string
  const jsonData = JSON.stringify(data);
  // Setting up API url
  const url = "https://us10.api.mailchimp.com/3.0/lists/f71a4b9e57";
  // Setting option for API authentication
  const options = {
    method: "POST",
    auth: "omkarae:0eaeedf54e3c6de084040937267edf40-us10"
  }
  // Requesting API on url with option and a random function
  const request = https.request(url,options,function(response){
    // If succesfull sending success.html
    if(response.statusCode === 200)
    {
      res.sendFile(__dirname + "/success.html");
    }
    // Else sending failure.html
    else{
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data",function(data){
      // console.log(JSON.parse(data));
    })
  })
  // Writing jsonData
  request.write(jsonData);
  // Finishing sending the request
  request.end();
});
// Setting up app.post method for /failure directory
app.post("/failure", function(req,res){
  res.redirect("/");
})
// Setting app.get method for root directory
app.get("/",function(req,res){
  res.sendFile(__dirname + "/signup.html")
});
