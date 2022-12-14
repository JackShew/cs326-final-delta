var r;
var h;
var account;
window.addEventListener("load", async function() {
    // const comments = await getComments();
    // comments.forEach(comment => {
    //     renderComment(comment);
    // });
    r = getParameterByName('dishName');
    h = getParameterByName('diningHall');
    account = await getAccount();
    document.getElementById("idText").innerHTML = "Hi " + account.account;
    if(account.account !== "guest"){
        document.getElementById("logoutText").innerHTML = "click here to logout";
    }
    var hall;
    switch(h){
        case "berk":
            hall = "Berkshire";
            break;
        case "frank":
            hall = "Frank";
            break;
        case "worcester":
            hall = "Worcester";
            break;
        case "hamp":
            hall = "Hampshire";
            break;  
        default:
            hall = h;
    }
    document.getElementById("dish-name").innerHTML = r;
    document.getElementById("dining-common").innerHTML = hall;
    const postData = await getPostData();
    document.getElementById("description").innerHTML = postData["description"];
    const comments = postData["comments"];
    var numComments = comments.length;
    if(numComments === 1){
        numComments = numComments.toString() + " Comment";
    }else{
        numComments = numComments.toString() + " Comments";
    }
    document.getElementById("commentNumber").innerHTML = numComments;
    document.getElementById("rank").innerHTML = postData["score"];
    document.getElementById("increment").addEventListener('click', function(){
        console.log("clicked");
        if(document.getElementById("decrement").disabled){
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
        
        const updatedScore = document.getElementById("rank");
        updatedScore.innerHTML = `<b>${postData["score"]}</b>`
        document.getElementById("increment").disabled = true;
        document.getElementById("decrement").disabled = false;
    });
    document.getElementById("decrement").addEventListener('click', function(){
    console.log("clicked");
    if(document.getElementById("increment").disabled){
        postData.score -=1;
    }
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
    
    const updatedScore = document.getElementById("rank");
    updatedScore.innerHTML = `<b>${postData["score"]}</b>`
    document.getElementById("decrement").disabled = true;
    document.getElementById("increment").disabled = false;
    });
    var index = 0;
    comments.forEach(c => {
        renderComment(c, index);
        addIncDec(c,index);
        index += 1; 
    });
    document.getElementById("n").value = r;
    document.getElementById("postComment").onsubmit = function(){
        location.reload(true);
    }

});

async function getCommentData() {
    const response = await fetch("/commentData/"+r);
    console.log(response);
    return response.json();
}

async function getAccount() {
    const response = await fetch("/account");
    console.log(response);
    return response.json();
}

async function getPostData() {
    const response = await fetch("/dish/"+r+"/"+h);
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

function renderComment(commentData, intIndex){
    const index = intIndex.toString();
    console.log(index);
    const commentSection = document.getElementById("comment-section");
    const comment = document.createElement("div");
    comment.classList.add("comment");
    const commentInfo = document.createElement("div");
    commentInfo.classList.add("comment-info");
    const commenter = document.createElement("span")
    commenter.classList.add("commenter");
    const name = document.createTextNode(commentData["commenter"]);
    commenter.appendChild(name);
    const date = document.createElement("span")
    date.classList.add("date");
    const dateText = document.createTextNode(" " + commentData["date"]);
    date.appendChild(dateText);
    const commentText = document.createElement("p");
    const text = document.createTextNode(commentData["text"]);
    commentText.appendChild(text);
    commentInfo.appendChild(commenter);
    commentInfo.appendChild(date);
    commentInfo.appendChild(commentText);
    comment.appendChild(commentInfo);


    // comment raak and buttons
    const commentRank = document.createElement("div");
    commentRank.classList.add("comment-rank");
    commentRank.innerHTML = `

    <button class="btn btn-default" class = "increment" id="${index + "increment"}">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up-circle" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z"/>
        </svg>
    </button>
    <div class = "comment-score" id="${index + "score"}"><b>${commentData["score"]}</b></div>
    <button class="btn btn-default" class = "decrement" id="${index + "decrement"}">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-circle" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z"/>
        </svg>
    </button>`;
    comment.appendChild(commentRank);
    commentSection.appendChild(comment);
    const bre = document.createElement("br");
    commentSection.appendChild(bre);
}

function addIncDec(commentData, intIndex){
    const index = intIndex.toString();
    document.getElementById(index + "increment").addEventListener('click', function(){
        console.log("clicked");
        if(document.getElementById(index + "decrement").disabled){
            commentData.score+=1;
        }
        commentData.score +=1;
        commentData.title = r;
        commentData.index = index;
        (async () => {
            const rawResponse = await fetch('/updateScore', {
                method: 'POST',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(commentData)
            });
            const content = await rawResponse.json();
            
            console.log(content);
    })();
    
    const updatedScore = document.getElementById(index + "score");
    updatedScore.innerHTML = `<b>${commentData["score"]}</b>`
    document.getElementById(index + "increment").disabled = true;
    document.getElementById(index + "decrement").disabled = false;

});

    document.getElementById(index + "decrement").addEventListener('click', function(){
        console.log("clicked");
        if(document.getElementById(index + "increment").disabled){
            commentData.score-=1;
        }
        commentData.score -=1;
        commentData.title = r;
        commentData.index = index;
        (async () => {
            const rawResponse = await fetch('/updateScore', {
                method: 'POST',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(commentData)
            });
            const content = await rawResponse.json();
            
            console.log(content);
        })();
        
        const updatedScore = document.getElementById(index + "score");
        updatedScore.innerHTML = `<b>${commentData["score"]}</b>`
        document.getElementById(index + "increment").disabled = false;
        document.getElementById(index + "decrement").disabled = true;
    });
}