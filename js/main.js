import {getQuestion,addQuestion, getPass} from "./firebase.js";
const urlParams = new URLSearchParams(window.location.search);
let questionCount = 0;
function getCurrentDateTime() {
    const dateTime = new Date();
    return dateTime.toLocaleString();
}

function displayConfirmationMessage(result) {
    document.getElementById("output").style.display = "block";
    const confirmationElement = document.getElementById("confirmationText");
   if(result){
    questionCount++;
    confirmationElement.textContent = `Question ${questionCount} submitted on ${getCurrentDateTime()}`;
    confirmationElement.style.color="green";
   }else{
    confirmationElement.textContent = `Question submitted fail`;
    confirmationElement.style.color="red";
   }
}

async function saveMessage(question,year) {
   const result = await addQuestion({
    question: question,
    //question: question.replace(/\n/g, "<br>"),
    timestamp: getCurrentDateTime(),
    year:parseInt(year)
  });
  if(result!= null){
    displayConfirmationMessage(true);
  }
  else{
    displayConfirmationMessage(false);
  }
}

function submitForm(event) {
    event.preventDefault();
    const questionInput = document.getElementById("question");
    const Year = document.getElementById("year").value;
    const question = questionInput.value.trim();

    if (question !== "") {
      saveMessage(question,Year); // Save the question to Firebase database
      questionInput.value = "";
    }
}

if(window.location.pathname == "/"){
    const year = urlParams.get("year") || null;
    const yearValue = parseInt(year);
    if(year == null){
        document.body.innerHTML=`
        <center class="mt-5">Note: Please mention your Year of Passing at the end of the URL like "/?year="<center>
        `
    }else{
        const questionListElement = document.getElementById("questionList");
        const searchInputElement = document.getElementById("searchInput");
        const questions = await getQuestion(yearValue);
        let Qcount = Object.keys(questions).length;
        console.log(Qcount);
        if(Qcount === 0){
            questionListElement.innerHTML=""
            const listItem = document.createElement("li");
            listItem.className = "list-group-item";
            listItem.innerHTML = `No of Question is Zero`;
            questionListElement.appendChild(listItem);
            
        }else{
            questionListElement.innerHTML="";
        }
       
        const entries = Object.entries(questions);
                let  count = 0;
                entries.forEach(([id, data], index) => {
                    count++;
                    const listItem = document.createElement("li");
                    listItem.className = "list-group-item";
                    listItem.innerHTML = `
                      <div class="row">
                        <div class="col-6 text-left">
                          <b class="text-success">Question Number: ${count}</b>
                        </div>
                        <div class="col-6 text-right">
                          <p class="text-primary">${data.data().timestamp}</p>
                        </div>
                      </div>
                      <br>${data.data().question.replace(/\n/g, "<br>")}<hr>`;
                    questionListElement.appendChild(listItem);
                  });
        
        document.getElementById("displayQuestionFormat").addEventListener("change",()=>{
            const format = document.getElementById("displayQuestionFormat").value;
            if(format == "one2n"){
                const entries = Object.entries(questions);
                let  count = 0;
                questionListElement.innerHTML="";
                entries.forEach(([id, data], index) => {
                    count++;
                    const listItem = document.createElement("li");
                    listItem.className = "list-group-item";
                    listItem.innerHTML = `
                      <div class="row">
                        <div class="col-6 text-left">
                          <b class="text-success">Question Number: ${count}</b>
                        </div>
                        <div class="col-6 text-right">
                          <p class="text-primary">${data.data().timestamp}</p>
                        </div>
                      </div>
                      <br>${data.data().question.replace(/\n/g, "<br>")}<hr>`;
                    questionListElement.appendChild(listItem);
                  });
            }else{
                const entries = Object.entries(questions).reverse();
                let count = Object.keys(questions).length;
                questionListElement.innerHTML="";
                entries.forEach(([id, data], index) => {
                    const listItem = document.createElement("li");
                    listItem.className = "list-group-item";
                    listItem.innerHTML = `
                      <div class="row">
                        <div class="col-6 text-left">
                          <b class="text-success">Question Number: ${count}</b>
                        </div>
                        <div class="col-6 text-right">
                          <p class="text-primary">${data.data().timestamp}</p>
                        </div>
                      </div>
                      <br>${data.data().question.replace(/\n/g, "<br>")}<hr>`;
                    questionListElement.appendChild(listItem);
                    count--;
                  });
            }

        });


        
         // Add event listener to search input
         searchInputElement.addEventListener("input", () => {
            const searchTerm = searchInputElement.value.toLowerCase();
            const listItems = questionListElement.getElementsByClassName(
              "list-group-item"
            );
    
            for (let i = 0; i < listItems.length; i++) {
              const listItem = listItems[i];
              const questionText = listItem.innerText.toLowerCase();
    
              if (questionText.includes(searchTerm)) {
                listItem.style.display = "block";
              } else {
                listItem.style.display = "none";
              }
            }
          });
         // Display the live date at the top of the page
         const liveDateElement = document.getElementById("liveDate");
         setInterval(() => {
            const currentDate = new Date();
            const options = {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric"
            };
            liveDateElement.textContent = currentDate.toLocaleDateString(
              undefined,
              options
            );
          }, 1000); // Update every second
    }
   
}else{
    const pass = urlParams.get("pass") || null;
    const passValue = parseInt(pass);
    if (passValue === await  getPass()) {
        sessionStorage.setItem("pass",passValue);
        window.location.href="/uploadquestion"
    }
    if (sessionStorage.getItem("pass") == await  getPass()){
        document
          .getElementById("questionForm")
          .addEventListener("submit", submitForm);
    }else{
        document.body.innerHTML="<center><h3 class='text-danger'>Access Denied<h3></center>"
    }
}
