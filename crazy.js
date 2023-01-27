function disableButtons(array){
  for(const a of array){
    a.disabled = true;
  }
  document.getElementById('next').disabled = false;
  updatePoints();
}

function storeFlags(flagName){
  if(!sessionStorage.getItem("storedFlags")){
    let newflag = JSON.stringify([flagName]);
    sessionStorage.setItem("storedFlags", newflag);
    return;
  }

  let flags = JSON.parse(sessionStorage.getItem("storedFlags"));

  if (Object.keys(flags).length >= sessionStorage.getItem("limit")){
    sessionStorage.setItem("storedFlags", "");
    return true;
  }

  for(const flag of flags){
    if(flag == flagName){
      return false;
    }
  }
  flags.push(flagName);
  
  sessionStorage.setItem("storedFlags", JSON.stringify(flags));

  document.getElementById("points").textContent = Object.keys(flags).length;

  return true;
}

function updatePoints(){
  document.getElementById("points").textContent = `Points: ${sessionStorage.getItem("points") ?? 0}`;
}

fetch('https://restcountries.com/v3.1/all')
  .then(response => response.json())
  .then(data => {
    updatePoints();

    let x = Math.floor(Math.random() * data.length);

    let img_link = data[x]['flags']['png'];
    let name = data[x]['name']['common'];

    !sessionStorage.getItem("limit") ? sessionStorage.setItem("limit", Object.keys(data).length) : null;

    while(true){
      if(!storeFlags(name)){
        x = Math.floor(Math.random() * data.length);

        img_link = data[x]['flags']['png'];
        name = data[x]['name']['common'];
        continue;
      }
      break;
    }

    let element = document.getElementById("flag");
    let buttons = document.getElementsByClassName("option");

    element.src = img_link;

    let rand_index = Math.floor(Math.random() * buttons.length);
    let rightAnswerButton = buttons[rand_index];

    for (const btn of buttons) {
      if(btn === rightAnswerButton){
        continue;
      }

      let rand_index = Math.floor(Math.random() * data.length);
      let rand_name = data[rand_index]['name']['common'];


      //wrong answer
      btn.textContent = rand_name;

      for(const btn2 of buttons){
        if(btn2.textContent == btn.textContent){ //verify if there is a button with the same name and change it
          rand_index = Math.floor(Math.random() * data.length);
          rand_name = data[rand_index]['name']['common'];

          btn.textContent = rand_name;
        }
      }

      btn.addEventListener("click", event => {
        btn.style.background = "red";
        rightAnswerButton.style.background = "green";

        sessionStorage.setItem("points", 0); // 0 points

        disableButtons(buttons);
      })
    }

    //right answer
    rightAnswerButton.textContent = name;
    rightAnswerButton.addEventListener("click", event => {

      rightAnswerButton.style.background = "green";

      let currentPoints = !sessionStorage.getItem("points") ? 0 : parseInt(sessionStorage.getItem("points"));
      currentPoints++;
      sessionStorage.setItem("points", currentPoints);

      disableButtons(buttons);  
    });

});
