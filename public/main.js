var userID = window.location.href;
userID = userID.substring(userID.lastIndexOf("/")+1);
var account = "guest";
window.addEventListener("load", async function() {
    userID = window.location.href;
    userID = userID.substring(userID.lastIndexOf("/")+1);
    account = await getAccount();
    document.getElementById("idText").innerHTML = "Hi " + account.account;
    console.log(account.account);
    if(account.account !== "guest"){
        document.getElementById("logoutText").innerHTML = "click here to logout";
    }
    let dishes = await getDishData();
    console.log(dishes);
    dishes.forEach(element => {
        renderPost(element);
    });

    const wooUpdate = this.document.getElementById("worcesterUpdate");
    wooUpdate.addEventListener("click", async function() {
        let wooScraped = await fetch("/worchester").then(response => response.json());
        console.log(wooScraped);     
        wooScraped.forEach(dish => {
            let found = false;
            for(let i = 0; i < dishes.length; i++) {
                if (dishes[i].title == dish.title) {
                    found = true;
                    break;
                }
            }
            if(!found){
                renderPost(dish);
                postScrape(dish);
            }       
        });
    });

    const frankUpdate = this.document.getElementById("frankUpdate");
    frankUpdate.addEventListener("click", async function() {
        let frankScraped = await fetch("/frank").then(response => response.json());
        console.log(frankScraped);     
        frankScraped.forEach(dish => {
            let found = false;
            for(let i = 0; i < dishes.length; i++) {
                if (dishes[i].title == dish.title) {
                    found = true;
                    break;
                }
            }
            if(!found){
                renderPost(dish);
                postScrape(dish);
            }       
        });
    });

    const hampUpdate = this.document.getElementById("hampUpdate");
    hampUpdate.addEventListener("click", async function() {
        let hampScraped = await fetch("/hamp").then(response => response.json());
        console.log(hampScraped);     
        hampScraped.forEach(dish => {
            let found = false;
            for(let i = 0; i < dishes.length; i++) {
                if (dishes[i].title == dish.title) {
                    found = true;
                    break;
                }
            }
            if(!found){
                renderPost(dish);
                postScrape(dish);
            }       
        });
    });


    const berkUpdate = this.document.getElementById("berkUpdate");
    berkUpdate.addEventListener("click", async function() {
        let berkScraped = await fetch("/berk").then(response => response.json());
        console.log(berkScraped);     
        berkScraped.forEach(dish => {
            let found = false;
            for(let i = 0; i < dishes.length; i++) {
                if (dishes[i].title == dish.title) {
                    found = true;
                    break;
                }
            }
            if(!found){
                renderPost(dish);
                postScrape(dish);
            }       
        });
    });

    document.getElementById("post").addEventListener('click', function(){
        const title = document.getElementById("postTitle").value;
        const des = document.getElementById("postDescription").value;
        const loc = document.getElementById("postLocation").value;
        const img = document.getElementById("imageUpload").value; 
        console.log(img);
        const dishData = {"title": title, "description": des, "location": loc, "image": img, "score" : 1, "comments": []};
 
        renderPost(dishData);
        //post(dishData);
    });

});

async function getAccount() {
    const response = await fetch("/account");
    console.log(response);
    return response.json();
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

async function getDishData() {

    console.log("in dish data mainjs");
    const response = await fetch("/dishes");

    console.log(response);
    return response.json();
}

async function postScrape(body) {
    const response = await fetch("/postDish",{
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });
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
    const dishComment = document.createElement("a");
    dishComment.classList.add("comment");
    dishComment.href = "comments.html?dishName="+postData["title"]+"&?diningHall="+postData["location"];
    const commentBtn = document.createElement("button");
    commentBtn.classList.add("btn");
    commentBtn.classList.add("btn-default");
    commentBtn.setAttribute.id = "comments " + postData["title"];
    commentBtn.innerHTML = `
        <div class = "dish-comments">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-right-text-fill" id="chat-icon1" viewBox="0 0 16 16">
                <path d="M16 2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h9.586a1 1 0 0 1 .707.293l2.853 2.853a.5.5 0 0 0 .854-.353V2zM3.5 3h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1 0-1zm0 2.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1 0-1zm0 2.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1z"/>
            </svg>
            <div class = "comments">${postData["comments"].length} Comments</div>
        </div>`;

    dishComment.appendChild(commentBtn);
 
    dishInfo.appendChild(dishTitle);
    dishInfo.appendChild(dishDes);
    dishInfo.appendChild(dishComment);
    if(account.account === "Admin"){
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
        dishInfo.appendChild(editbutton);
        dishInfo.appendChild(endbutton);
        dishInfo.appendChild(deleteButton);
    }


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
    hallContainer.appendChild(dish);
    document.getElementById(postData["title"] + "increment").addEventListener('click', function(){
        if(document.getElementById(postData["title"] + "decrement").disabled){
            postData.score +=1;
        }
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
        if(document.getElementById(postData["title"] + "increment").disabled){
            postData.score -= 1;
        }
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

