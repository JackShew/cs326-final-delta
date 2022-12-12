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
 
Users: this collection holds the information for all the users on our app. attributes for administrative operations (CRUD on dishes) is linked to an account with the adress of "Admin".

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
| Header      | Title       |
| Paragraph   | Text        |


URL Routes/Mappings: A final up-to-date table of all the URL routes that your application supports and a short description of what those routes are used for. You should also indicate any authentication and permissions on those routes.

**Authentication**


Authentication/Authorization: A final up-to-date description of how users are authenticated and any permissions for specific users (if any) that you used in your application. You should mention how they relate to which UI views are accessible.

**Division of Labor**

Jack: Programmatically rendering all dish elements from mongoDB backend. Constructed endpoints for dish and ranking CRUD. Built web scraper and refresh dishes functionality and UI.

Jayden: Set up Mongo database and connected it to the app, implemented initial post dish post requst, and set up login and submit with database compatibility.


**Conclusion**

Grub Gauge was a labor of love, starting from the very first paper mockup to the final user login bugs. Overall, we learned a lot about user experience design and the importance of thorough testing during the implementation phase. One of the biggest difficulties we encountered was balancing the need for a user-friendly interface with the need to integrate complex functionality into the application. We also struggled with some technical hurdles, such as debugging issues with the user login system.

In hindsight, we would have liked to have a better understanding of the technical Express and MongoDB integration we were likely to face before starting the project. This would have allowed us to plan our development process more effectively and allocate our resources more efficiently.

Despite the challenges we faced, we are proud of what we were able to accomplish with Grub Gauge. We believe it is a valuable tool for the Umass community to gauge the best food on campus, and we look forward to continuing to improve and evolve the application in the future.


