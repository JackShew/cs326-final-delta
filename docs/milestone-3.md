Hi 326 TA's! For milestone 3 the two of us, Jack and Jayden, put alot of hours into getting everything operational. While it might not be pretty, we are really looking forward to hearing your feedback on the functionality!
  
**GrubGauge Description**
  - https://grub-gauge.herokuapp.com/
  - Programatically renders user generated dishes from UMass's 4 dinning halls - enabling the Umass community to crowdsource the best dishes from the #1 dinning in the nation.

**Database Layout and Examples**

Posts: this collection holds the information for each and every dish on our app.

  {

    "_id":{"$oid":"6379997ee8a57f88992b7393"},                //ObjectID
    "title":"Chicken Noodle Soup",                            //String
    "description":"Long String of Ingredients",               //String 
    "location":"worcester",                                   //String
    "image":"placeholder.png",                                //String
    "score":{"$numberInt":"67"},                              //Int32
    "comments":{"$numberInt":"0"}}                            //Int32
  }
  
Users: this collection holds the information for all the users on our app. While we are still sorting it out, we want to have an additional attribute for administrative operations (CRUD on dishes).

  {
  
    "_id":{"$oid":"637af211718acb34665f6bc8"},                //ObjectID
    "address":"test@test.edu",                                //String
    "password":"test"                                         //String
  }

**Division of Labor**

Jack: Started Milestone 3 with programmatically rendering all dish elements in anticipation for mongoDB backend. After Jayden got mongo on app.js, I was able to get all the CRUD endpoints up and running on the backend while also rendering all frontend elements from the db.

Jayden: Set up Mongo database and connected it to the app, implemented initial post dish post requst, and set up login and submit with database compatibility.





**Next Steps**

We are on track for something that can be usable, but we have some priorities for after thanksgiving break. 1) Account functionality. Right now you can only create new accounts can be made and log in to existing accounts. 2) commenting functionallity. After accounts are opperational, we want to give the user the ability to comment under each dish option 3) More starter data, right now we only have dummy data in the future it will have a broad array of dishes
