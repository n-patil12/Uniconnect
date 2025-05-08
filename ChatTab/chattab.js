function openNav() {
    document.getElementById("mySidebar").style.width = "250px";
    document.querySelector(".closebtn").style.visibility = "visible";
    document.querySelector(".closebtn").style.display = "block";
}
  
function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.querySelector(".closebtn").style.display = "none";
}

function openForm() {
    console.log("hit");
    document.getElementById("myForm").style.display = "block";
}
  
function closeForm() {
    document.getElementById("myForm").style.display = "none";
}

function appendMsg(){
    console.log("ee");
    var text = document.getElementById("msg").value;
    var msgNew = document.createElement('div');
    msgNew.textContent = text;
    msgNew.className = "container darker";
    
    var img = document.createElement('img');
    img.src = "../Profile_Builder/profile_pic.jpg"
    
    msgNew.appendChild(img);

    const time = new Date();
    let [hour, minutes, seconds] = [
        time.getHours(),
        time.getMinutes(),
        time.getSeconds(),
    ];
    
    if (hour > 12){
        hour = hour - 12;
    }

    var timestamp = document.createElement('span');
    const paddedMinutes = String(minutes).padStart(2, '0');
    timestamp.textContent = hour + ":" + paddedMinutes;
    timestamp.className = "time-right";

    msgNew.appendChild(timestamp);
    

    document.getElementsByClassName("scrollable-chat")[0].appendChild(msgNew);
}
