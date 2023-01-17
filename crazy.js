function disableButtons(array){
  for(const a of array){
    a.disabled = true;
  }
  document.getElementById('next').disabled = false;
  updatePoints();
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
