// document.getElementById('red').classList.add("hidden");// console.log(document.getElementById('red').innerText);
const dishes = {};
dishes["Franklin/Sushi/Score"] = {incremented: false, decremented: false};

document.getElementById("Franklin/Sushi/Score/increment").addEventListener('click', function(){
    increment("Franklin/Sushi/Score")
});
document.getElementById("Franklin/Sushi/Score/decrement").addEventListener('click', function(){
    decrement("Franklin/Sushi/Score")
});
document.getElementById("post").addEventListener(function(){
    const title = document.getElementById("postTitle").value;
    const des = document.getElementById("postDescription").value;
    const loc = document.getElementById("postLocation").value;
    const img = document.getElementById("formFile").value; 
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
    // Create post html
}
