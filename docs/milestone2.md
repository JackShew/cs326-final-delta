Part 0:
The Grub Gauge API, based on REST API, delivers JSON data to and from the client and server

Objects:
Dish objects: Name, image, description, rank, and comments
User object: ID, role, username, email, password, dishes, and comments
Dining Common object: Name and dishes
Comment objects: text data, rank, and comments

Data is accessed through HTTPS requests, such as GET, POST, PUT, DELETE, sent to an API endpoint

Our API will have CRUD operations for all four objects, with endpoints like these
/dish/new adds a dish to a dining common, when a request with the proper data is made to it
/dish/view?name a read endpoint returning the fields for a dish as a JSON object
/user/new allows users to make an account
/login allows login
/dish/delete?name=”dish_to_delete” deletes the dish with the name “dish_to_delete” only users with role = admin and the user who initially posted the dish can use this endpoint
/dish/name/comment?name=”dish_to_comment” allows users to make a comment at the dish with name “dish_to_comment” when a request containing a comment is sent to this endpoint
/dining/new allows admins to create a new dining common 
/dining/delete?name=”dining_to_delete” allows admins to delete dining hall with name “dining_to_delete”
<!-- Not sure if this is how upvoting/downvoting should be done -->
/dish/upvote?name=”dish_to_upvote” increments the rank of dish “dish_to_upvote” by 1
/dish/downvote?name=”dish_to_downvote” decrements the rank of dish “dish_to_downvote” by 1


The API will respond with a JSON object containing the information requested


Part 2:
Implementation was not all the way there. 
Submit button sends a get request containing the informations in the forms to create a new dish item.
https://github.com/JackShew/cs326-final-delta/blob/main/docs/images/SubmitButton.PNG

Image below shows array of dish items
https://github.com/JackShew/cs326-final-delta/blob/main/docs/images/localHost5000_dish.PNG

When upvote button is pressed the dish score is incremented, if the user has already pressed the upvote
button it instead decrements the score and then next time it is pressed it increments.
https://github.com/JackShew/cs326-final-delta/blob/main/docs/images/upvoteButton.PNG
Image below shows that element is changed. 
https://github.com/JackShew/cs326-final-delta/blob/main/docs/images/upvoteButtonPressed.PNG
Downvote buttons work in the same way

Part 3:
Heroku link
https://grub-gauge.herokuapp.com/

Division of Labor:
Jack: Implemented part 1, the back-end Skeleton code, set up and deployed on Heroku, and helped implement front end.
Jayden: After consulting with Jack implemented part 0, implemented front end, and wrote milestone2.md. 

