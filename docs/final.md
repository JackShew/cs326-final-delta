**Team Delta Presents:**

***Grub Gauge***

A web app that programatically renders user generated and web scraped dishes from UMass's 4 dining halls - enabling the Umass community to crowdsource the best dishes from the #1 dining in the nation. As the only food ranking website for UMass Amherst, we want to provide the most relevant dining information for anyone on our campus.


Fall 2022

By Jack Shewchuk and Jayden Nambu

<hr>

**User Interface**
| View        | Purpose |
| ----------- | ----------- |
| Navigation bar      | Primary navigation functionality       |
| Post a Dish   | Enables users to enter information on dishes         |
| Dining Containers   (below 1)   | Encapsulates all dish containers and segments dishes by hall     |
| Dish Containers   | Portrays all the relevant information about a given dish, including: title, description, ranking, and a comments page link        |
| Comments Page   (below 2)   | A speparate page, this page portrays all the user generated comments, date and ranking in additon to all relevant information about the dish       |
| Login Page   (below 3)| This simple separate page is very close in UI to the register page, and simply includes a form to enter information   (below)    |
| Register Page      | This simple separate page is very close in UI to the Login in page, and simply includes a form to enter information       |


![alt text](https://github.com/JackShew/cs326-final-delta/blob/main/docs/images/UI1.PNG)
![alt text](https://github.com/JackShew/cs326-final-delta/blob/main/docs/images/UI3.PNG)
![alt text](https://github.com/JackShew/cs326-final-delta/blob/main/docs/images/UI2.PNG)

**API Usage**
- express
- https
- axios
- cheerio
- bodyParser
- minicrypt
- expressSession
- passport
- fetch

APIs primarily utilized for web scraping and authentication.

**Database**

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
  
Users: this collection holds the information for all the users on our app. attributes for administrative operations (CRUD on dishes) is linked to an account with the adress of "Admin".

  {
  
    "_id":{"$oid":"637af211718acb34665f6bc8"},                //ObjectID
    "address":"test@test.edu",                                //String
    "password":"test"                                         //String
  }


**URL Mapping**


| Endpoint      | Description |
| ----------- | ----------- |
| Header      | Title       |
| Paragraph   | Text        |


URL Routes/Mappings: A final up-to-date table of all the URL routes that your application supports and a short description of what those routes are used for. You should also indicate any authentication and permissions on those routes.

**Authentication**


Authentication/Authorization: A final up-to-date description of how users are authenticated and any permissions for specific users (if any) that you used in your application. You should mention how they relate to which UI views are accessible.

**Division of Labor**

Jack: Started Milestone 3 with programmatically rendering all dish elements in anticipation for mongoDB backend. After Jayden got mongo on app.js, I was able to get all the CRUD endpoints up and running on the backend while also rendering all frontend elements from the db.

Jayden: Set up Mongo database and connected it to the app, implemented initial post dish post requst, and set up login and submit with database compatibility.


**Conclusion**

Conclusion: A conclusion describing your team’s experience in working on this project. This should include what you learned through the design and implementation process, the difficulties you encountered, what your team would have liked to know before starting the project that would have helped you later, and any other technical hurdles that your team encountered.

