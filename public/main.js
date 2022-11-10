// document.getElementById('red').classList.add("hidden");// console.log(document.getElementById('red').innerText);
const dishes = {};
dishes["Franklin/Sushi/Score"] = {incremented: false, decremented: false};

document.getElementById("Franklin/Sushi/Score/increment").addEventListener('click', function(){
    increment("Franklin/Sushi/Score")
});
document.getElementById("Franklin/Sushi/Score/decrement").addEventListener('click', function(){
    decrement("Franklin/Sushi/Score")
});
// Uneccessary html already accomplishes this
// document.getElementById("post").addEventListener('click', function(){
//     past("s");
// })
document.getElementById("post").addEventListener('click', function(){
    const title = document.getElementById("postTitle").value;
    const des = document.getElementById("postDescription").value;
    const loc = document.getElementById("postLocation").value;
    const img = document.getElementById("formFile").value; 
    // past('s');
    post({"title":title, "description":des, "location":loc, "image":img});
});
function increment(id){
    if(!dishes[id]["incremented"]){
        let score = document.getElementById(id).innerText;
        score = parseInt(score);
        score += 1;
        if(dishes[id]["decremented"]){
            score+=1;
        }
        document.getElementById(id).innerText = score.toString();
        dishes[id]["incremented"] = true;
        dishes[id]["decremented"] = false;
    }else{
        let score = document.getElementById(id).innerText;
        score = parseInt(score);
        score -= 1;
        document.getElementById(id).innerText = score.toString();
        dishes[id]["incremented"] = false;
        dishes[id]["decremented"] = false;
    }
}
function decrement(id){
    if(!dishes[id]["decremented"]){
        let score = document.getElementById(id).innerText;
        score = parseInt(score);
        score -= 1;
        if(dishes[id]["incremented"]){ 
            score -= 1;
        }
        document.getElementById(id).innerText = score.toString();
        dishes[id]["decremented"] = true;
        dishes[id]["incremented"] = false;
    }else{
        let score = document.getElementById(id).innerText;
        score = parseInt(score);
        score += 1;
        document.getElementById(id).innerText = score.toString();
        dishes[id]["incremented"] = false;
        dishes[id]["decremented"] = false;
    }
}

function post(postData){
    window.alert(postData["title"]);
    window.alert(postData["description"]);
    window.alert(postData["location"]);
    window.alert(postData["image"]);
    // Create post html
    const dish = document.createElement("div");
    dish.classList.add("dish-container");
    const dishImage = document.createElement("img");
    dishImage.src = postData["image"];
    dish.appendChild(dishImage);
    const dishInfo = document.createElement("div");
    dishInfo.classList.add("dish-info");
    const dishTitle = document.createElement("h3");
    const tex = document.createTextNode(postData["title"]);
    dishTitle.appendChild(tex);
    const dishDes = document.createElement("p");
    const des = document.createTextNode(postData["description"]);
    dishDes.appendChild(des);
    dishInfo.appendChild(dishTitle);
    dishInfo.appendChild(dishDes);
    const diningContainer = document.getElementById(postData["location"]+"Container");
    diningContainer.appendChild(newDiv);
}


/*<div class="dish-container">
 <div class = "dish-image">
<img src="images/salad.jpg" alt="Salad" width=200>
</div>
<div class = "dish-info">
<h3 class = "dish-title">Salad</h3>
<p class = "dish-description">sit amet, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum</p>    
<br>
<button class="btn btn-default">
<div class = "dish-comments">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-right-text-fill" id="chat-icon5" viewBox="0 0 16 16">
        <path d="M16 2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h9.586a1 1 0 0 1 .707.293l2.853 2.853a.5.5 0 0 0 .854-.353V2zM3.5 3h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1 0-1zm0 2.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1 0-1zm0 2.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1z"/>
    </svg>
    <div class = "comment-number">1 Comment</div>
</div>
</button>
</div>  
<!-- <div class="col-2">red</div> -->
<div class = "dish-rank">
<button class="btn btn-default">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up-circle" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z"/>
    </svg>
</button>
<div class = "dish-score"><b>31</b></div>
<button class="btn btn-default">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-circle" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z"/>
    </svg>
</button>
</div>

</div> */

function process(dishObj){

}