**Team Delta Presents:**

***Grub Gauge***: https://grub-gauge.herokuapp.com/

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

APIs primarily utilized for web scraping and authentication. For example, we used axios and cheerio to extract data from web pages and minicrypt to encrypt sensitive information. The express framework and the passport library were used to handle authentication and user sessions, while fetch was used to make HTTP requests to external APIs. Overall, these APIs allowed us to build a robust and secure web scraping and authentication system for our application.

**Database**

Posts: this collection holds the information for each and every dish on our app.

  {

    "_id":{"$oid":"6379997ee8a57f88992b7393"},                //ObjectID
    "title":"Chicken Noodle Soup",                            //String
    "description":"Long String of Ingredients",               //String 
    "location":"worcester",                                   //String
    "image":"placeholder.png",                                //String
    "score":{"$numberInt":"67"},                              //Int32
    "comments": Array [                                       //Array
       0: Object {                                            //Object
       "commenter": "Jay",                                    //String
       "date": "12/11/2022",                                  //String
       "text": "This chicken noodle soup was great",          //String
       "score": 4                                             //Int32
       }
     ]
  }
 
Users: this collection holds the information for all the users on our app. attributes for administrative operations (CRUD on dishes) is linked to an account with the address of "Admin" and Password of "password". Please feel free to check it out.

  {
  
    "_id": 63969fbad7965bfe99dc0729                          //ObjectID
    "address":"Admin",                                       //String
    "password": Array [                                      //Array
      0: "ceff160f886703dccf53ff1ef0e6fc6a",                 //String
      1: "ff198f74abc76ef18cffc4db5a210c0c19                 //String
          64e0e0ad114e957e4d4eebe1fbe2b86679
          8ce60dcb40bb20bc39f941b048e10ecb9f
          37a62ad6bdb91941dd2b6a8e26"
     ]
  }

**URL Mapping**


| Endpoint      | Description |
| ----------- | ----------- |
| [Main](https://grub-gauge.herokuapp.com/)      | Main page, allows users to post and view posts|
|[Login](https://grub-gauge.herokuapp.com/login)  | allows existing users to login|
|[Register](https://grub-gauge.herokuapp.com/register)  | allows users to create accounts|
|[Comments](https://grub-gauge.herokuapp.com/comments.html?dishName=Chicken%20Noodle%20Soup&?diningHall=worcester)| Allows users to view and make comments for post 


URL Routes/Mappings: 

Main page: https://grub-gauge.herokuapp.com/
  the main page allows users to view and update posts as well as post dishes and access the login page and comment sections of posts,
  accounts specific pages are held at https://grub-gauge.herokuapp.com/:userID
    if a user tries to access another accounts page without being logged in they will be brought to the login page
    additionally the admin account is able to delete posts and edit descriptions,
Login page: https://grub-gauge.herokuapp.com/login
  login page allows users to log into existing accounts
  after logging in users are brought to the main page of the user they logged into,
Register page: https://grub-gauge.herokuapp.com/register
  creates new accounts
  after submitting a register users are brought to the login page,
Comments page: https://grub-gauge.herokuapp.com/comments.html?dishName=?diningHall=
  if a user clicks on the comment button of a post they are brought to that posts comment page, dishname and dining hall are carried in the url
  a dishes comments page renders the comment data and allows logged in users to make comments on the post

**Authentication**

  Authentication was carried out through several modules; express-session, passport, passport-local, and minicrypt. We first set our local strategy which checks if there is a user with the given username in the database and then if the password is correct. The password is checked using minicrypt, when a user is first made minicrypt generates a salt and hash from the given password, to check if a given password is the same as the original we use minicrypt.check. Several GET and POST routes are checked by the function checkloggedin which checks if the request is authenticated and if it is it continues through the route, but if it has not been authenticated the user is redirected to the login page.
  There is an admin account by the name Admin which is allowed several special perissions. The Admin may edit the descriptions of a post and, if needed, delete a post, as well as the abilities of a normal user. The delete and edit description buttons are only visible to the Admin.

**Division of Labor**

Jack: Programmatically rendering all dish elements from mongoDB backend. Constructed endpoints for dish and ranking CRUD. Built web scraper and refresh dishes functionality and UI.

Jayden: Created the comments page which programatically renders comments from the mongoDB backend. Implemented authentication for account management.

**Conclusion**

Grub Gauge was a labor of love, starting from the very first paper mockup to the final user login bugs. Overall, we learned a lot about user experience design and the importance of thorough testing during the implementation phase. One of the biggest difficulties we encountered was balancing the need for a user-friendly interface with the need to integrate complex functionality into the application. We also struggled with some technical hurdles, such as debugging issues with the user login system.

In hindsight, we would have liked to have a better understanding of the technical Express and MongoDB integration we were likely to face before starting the project. This would have allowed us to plan our development process more effectively and allocate our resources more efficiently.

Despite the challenges we faced, we are proud of what we were able to accomplish with Grub Gauge. We believe it is a valuable tool for the Umass community to gauge the best food on campus, and we look forward to continuing to improve and evolve the application in the future.


