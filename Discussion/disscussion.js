let list = document.getElementById("discussion-list");
let btn = document.getElementById("reply-button");

btn.addEventListener("click", () => {
    let start = document.querySelector(".no-reply");
    if(start){start.remove();}

    let reply = document.getElementById("temp-reply");
    let clone = reply.content.cloneNode(true);
    list.appendChild(clone);
    
    let hr = document.createElement("hr");
    list.appendChild(hr);

    let btn2 = document.getElementById("reply-check");
    if(btn2){
    btn2.addEventListener("click", () => {
        let r = list.querySelector(".reply");
        let t = r.getElementById("reply-text");
        t.contenteditable = "false";

    });
}

});