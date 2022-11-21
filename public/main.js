
window.addEventListener("load", async function() {
    console.log("Joe mama");
    const dishes = await getDishData();
    console.log(dishes);
    dishes.forEach(element => {
        renderPost(element);
    });


    document.getElementById("post").addEventListener('click', function(){
        const title = document.getElementById("postTitle").value;
        const des = document.getElementById("postDescription").value;
        const loc = document.getElementById("postLocation").value;
        const img = document.getElementById("imageUpload").value; 
        console.log(img);
        const dishData = {"title": title, "description": des, "location": loc, "image": img, "score" : 1, "comments": 1};
 
        renderPost(dishData);
        //post(dishData);
    });
    document.getElementById("profileButton").addEventListener('click', function(){
        openForm(document.getElementById("loginForm"));
    })
    document.getElementById("closeForm").addEventListener('click', function(){
        closeForm(document.getElementById("loginForm"));
        closeForm(document.getElementById("signUpForm"));
    })

    document.getElementById("loginSelect").addEventListener('change', function(){
        closeForm(document.getElementById("loginForm"));
        openForm(document.getElementById("signUpForm"));
    })
    // document.getElementById("signUpButton").addEventListener('click', function(){
    //     const address = document.getElementById("address").value;
    //     const password = document.getElementById("psw").value;
    //     const accountInfo = {"address": address, "password": password};
    //     console.log(accountInfo);
    //     signUp(accountInfo);
    // })
});
function openForm(element) {
    element.style.display = "inline-block";
    }
    
    function closeForm(element) {
    element.style.display = "none";
    }

async function getDishData() {
    // const data = JSON.stringify({});
    // console.log(data);
    // console.log(dishData["title"]); //good g
    console.log("in dish data mainjs");
    const response = await fetch("/dishes");
    console.log(response);
    return response.json();
}

async function signUp(accountInfo) {
    const address = accountInfo["address"];
    const password = accountInfo["password"];
    const response = await fetch("/signUp",{
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({address: address, password: password})
        });
        const content = await response.json();
        console.log(content);
        return content;
}

function renderPost(postData){
    const dish = document.createElement("div");
    dish.classList.add("dish-container");
    const dishImage = document.createElement("img");
    //console.log(postData["image"]);
    dishImage.src = "images/placeholder.png";
    //console.log(dishImage.src);
    dishImage.style.width = "200px";
    dishImage.style.height = "160px";

    dish.appendChild(dishImage);
    const dishInfo = document.createElement("div");
    dishInfo.classList.add("dish-info");
    const dishTitle = document.createElement("h3");
    const title = document.createTextNode(postData["title"]);
    dishTitle.appendChild(title);
    const dishDes = document.createElement("p");
    const des = document.createTextNode(postData["description"]);
    dishDes.appendChild(des);
    const dishComment = document.createElement("div");
    dishComment.classList.add("comment");
    dishComment.innerHTML = `
    <button class = " btn btn-default">
        <div class = "dish-comments">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-right-text-fill" id="chat-icon1" viewBox="0 0 16 16">
                <path d="M16 2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h9.586a1 1 0 0 1 .707.293l2.853 2.853a.5.5 0 0 0 .854-.353V2zM3.5 3h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1 0-1zm0 2.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1 0-1zm0 2.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1z"/>
            </svg>
            <div class = "comments">${postData["comments"]} Comments</div>
        </div>
    </button>`;
    const editbutton = document.createElement("button");
    editbutton.setAttribute.id = postData["title"] + "edit";
    editbutton.innerHTML = "edit description";
   
    
    const endbutton = document.createElement("button");
    endbutton.setAttribute.id = postData["title"] + "end";
    endbutton.innerHTML = "finish editing";
    endbutton.style.visibility = "hidden";

    const deleteButton = document.createElement("button");
    deleteButton.setAttribute.id = postData["title"] + "delete";
    deleteButton.innerHTML = "delete dish !!Carefull!!";


    editbutton.addEventListener("click", function() {
        dishTitle.contentEditable = true;
        dishDes.contentEditable = true;
        dishDes.style.backgroundColor = "#dddbdb";
        endbutton.style.visibility = "visible"
      } );

    endbutton.addEventListener("click", function() {
        dishDes.contentEditable = false;
        endbutton.style.visibility = "hidden"
        dishDes.style.backgroundColor = "#ffe44d";
        const decContent = dishDes.innerHTML;
        postData["description"] = decContent;
        (async () => {
            const rawResponse = await fetch('/updateDescription', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(postData)
            });
            const content = await rawResponse.json();
          
            console.log(content);
        })();

    } )

    deleteButton.addEventListener("click", function() {
        dish.innerHTML = "";
        (async () => {
            const rawResponse = await fetch('/deleteDish', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(postData)
            });
            const content = await rawResponse.json();
          
            console.log(content);
        })();

    } )
    dishInfo.appendChild(dishTitle);
    dishInfo.appendChild(dishDes);
    dishInfo.appendChild(dishComment);
    dishInfo.appendChild(editbutton);
    dishInfo.appendChild(endbutton);
    dishInfo.appendChild(deleteButton);


    dish.appendChild(dishInfo);

    const dishRank = document.createElement("div");
    dishRank.classList.add("dish-rank");
    dishRank.innerHTML = `
        <button class="btn btn-default" class = "increment" id="${postData["title"] + "increment"}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up-circle" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z"/>
            </svg>
        </button>
        <div class = "dish-score" id="${postData["title"]+ "score"}"><b>${postData["score"]}</b></div>
        <button class="btn btn-default" id="${postData["title"] + "decrement"}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-circle" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z"/>
            </svg>
        </button>`


    dish.appendChild(dishRank);
    const hallContainer = document.getElementById(postData["location"]+"Container");
    //hallContainer.innerHTML = JSON.stringify(postData);
    //const diningContainer = hallContainer.querySelector(".dining-container");
    hallContainer.appendChild(dish);
    document.getElementById(postData["title"] + "increment").addEventListener('click', function(){
        console.log("clicked");
        postData.score +=1;
        (async () => {
            const rawResponse = await fetch('/updateScore', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(postData)
            });
            const content = await rawResponse.json();
          
            console.log(content);
        })();
        
        const updatedScore = document.getElementById(postData["title"] + "score");
        updatedScore.innerHTML = `<b>${postData["score"]}</b>`
        document.getElementById(postData["title"] + "increment").disabled = true;
        document.getElementById(postData["title"] + "decrement").disabled = false;

    });

    document.getElementById(postData["title"] + "decrement").addEventListener('click', function(){
        console.log("clicked");
        postData.score -=1;
        (async () => {
            const rawResponse = await fetch('/updateScore', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(postData)
            });
            const content = await rawResponse.json();
          
            console.log(content);
        })();
        
        const updatedScore = document.getElementById(postData["title"] + "score");
        updatedScore.innerHTML = `<b>${postData["score"]}</b>`
        document.getElementById(postData["title"] + "increment").disabled = false;
        document.getElementById(postData["title"] + "decrement").disabled = true;

    });
}



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
​
</div> */

function process(dishObj){

}