// this is background
window.addEventListener('DOMContentLoaded', () => {
 VANTA.BIRDS({
   el: "#vanta",
   mouseControls: true,
   touchControls: true,
   gyroControls: false,
   minHeight: 200.00,
   minWidth: 200.00,
   scale: 1.00,
   scaleMobile: 1.00,
   color1: "#d29f80",
   colorMode: "lerp",
   // backgroundAlpha:0.00
 });


});

//this is main blur and opacity animation
setTimeout(() => {
 const main = document.querySelector("main");
 main.style.opacity = 1;
 main.style.filter = "blur(0px)";
}, 1000);


 const khmerTexts = [
   `ែស្នហាមានរសជាតិយ៉ាងមិចទៅ? តើអាចប្រាប់បងបានទេពាលពៅ? យប់នេះមិនចង់អោយអូននាំផ្លូវ ជូនទៅកន្លែងដែលមិនគួរទៅ`,
   `ទឹកដីកម្ពុជាមានប្រវត្តិសាស្ត្រយូរលង់ និងវប្បធម៌ដ៏សម្បូរបែប។ ប្រាសាទអង្គរវត្តគឺជានិមិត្តរូបនៃប្រទេសកម្ពុជា និងជាសំណង់ស្ថាបត្យកម្មដ៏ធំជាងគេបំផុតលើពិភពលោក។`,
   `ភាសាខ្មែរគឺជាភាសាផ្លូវការរបស់ប្រទេសកម្ពុជា។ វាមានអក្សរក្រមពិសេសរបស់ខ្លួន និងមានប្រវត្តិចាប់ពីសតវត្សទី៧។`,
   `បច្ចេកវិទ្យាបានកំពុងផ្លាស់ប្តូរជីវិតរស់នៅរបស់យើងជារៀងរាល់ថ្ងៃ។ ការប្រើប្រាស់កុំព្យូទ័រ និងទូរស័ព្ទវៃឆ្លាតកាន់តែទូលំទូលាយនៅក្នុងសង្គមខ្មែរ។`
 ];
 
 // Current game text
 let currentText = khmerTexts[0];
 let currentTextArray = currentText.split('');


 function Task(text,numwords,activeWordCount,activeIndex, hasError,accuracy)
 {
   this.text = text; // The text to be typed
   this.numwords = numwords; // The number of words in the text
   this.activeWordCount = activeWordCount; // The number of active words in the text
   this.activeIndex = activeIndex; // The index of the currently active word
   this.hasError = hasError; // Whether there is an error in the current word
   this.accuracy = accuracy; // The accuracy of the typing so far
   this.correctChars = 0; // The number of correct characters typed
   this.incorrectChars = 0; // The number of incorrect characters typed
   this.finished = false; // Whether the task is finished
 }
 function numWordsInString(str){
   return str.split(' ').length; // Count the number of words in the string
   
 }
 function createTask(str){
   return new Task(str, numWordsInString(str), 0, 0, false, 0);
 }

 function getNewTaskStr(){
   if (randomize){
     let result = "";

     for (let i = 0; i < 25; i++) {
       let outer_index = Math.floor(Math.random() * khmerTexts.length);
       let inner_index = Math.floor(Math.random() * numWordsInString(khmerTexts[outer_index]));
       var sanitizedString = khmerTexts[outer_index].replace(/[.,!_\-\+=$?\[\]()]/g, '').toLowerCase();

       var wordsArray = sanitizedString.split(/\s+/).filter(word => word !== '');

       result = wordsArray[inner_index] + " ";
     }
     return result.slice(0, -1); // Remove the trailing space
   }else{
     let index = Math.floor(Math.random() * khmerTexts.length);
     while (index === currentTaskID) {
       index = Math.floor(Math.random() * khmerTexts.length);
     }
     currentTaskID = index;
     return khmerTexts[index]; // Return the new task string
   }
 }
 let sample_text = document.getElementById("sample");
 
 let input_text = document.getElementById("input");
 let wpm_text = document.getElementById("wpm");
 let num_word_text = document.getElementById("num_words");
 let percentage_text = document.getElementById("percentage");
 let accuracy_text = document.getElementById("accuracy");

 let new_btn = document.getElementById("new");
 let randomize_btn = document.getElementById("randomize");
 let visible_input = document.getElementById("visibleinput");
 let hide_btn = document.getElementById("hideinput");
 let currentTaskID = 0; // Initialize the current task ID
 let randomize = false;
 function resetTaskState(){
   if (sample_text.classList.contains("green")){
     sample_text.classList.remove("green");
   }
   visible_input.value = ""; // Clear the input field
   currentText = createTask(getNewTaskStr()); // Get a new task string
   sample_text.innerHTML = strToHTML(currentText.text,0,0);
   // Display the task string
   input_text.value = ""; // Clear the input field
   
   percentage_text.innerText = "0%"; // Reset the percentage text
   accuracy_text.innerText = "0%"; // Reset the accuracy text
   wpm_text.innerText = "0"; // Reset the WPM text
   num_word_text.innerText = currentText.numwords; // Display the number of words in the task string
   
   input_text.focus(); // Focus on the input field
 }

 let default_content = "`ែស្នហាមានរសជាតិយ៉ាងមិចទៅ? តើអាចប្រាប់បងបានទេពាលពៅ? យប់នេះមិនចង់អោយអូននាំផ្លូវ ជូនទៅកន្លែងដែលមិនគួរទៅ"

 let content = default_content

 let newStr = getNewTaskStr();
 currentTask = createTask(newStr); // ✅ fix the call
 sample_text.innerHTML = strToHTML(currentTask.text, 0, 0); // ✅

 let start_time = 0;
 let end_time = 0;

 

 let inputhidden = false; // Initialize the input hidden state

 function strToHTML(str, correct_end,error_end)
 {
   let result = '<span class="blue">'+ str.substring(0,correct_end)+'</span><span class="red">'+ str.substring(correct_end,error_end)+'</span>';

   if (error_end > correct_end){
     result += str.substring(error_end,str.length);

   }else{
     result += '<span class="cursor">'+ str.substring(correct_end,error_end+1)+'</span>';
     result += str.substring(correct_end+1,str.length);
   }
   return result ;
 }

 function updateSampleHighlight(event){
   if (event != -1 && !currentTask.hasError && event.key !== 'Enter'){
     // input_text.value += event.key; // Append the typed character to the input field

     let currentCharText = currentTask.text[currentTask.activeIndex];
     let input = event.key;

     if (currentCharText === input) {
       currentTask.hasError = false; // No error in the current character
       currentTask.activeIndex++;

       if (currentCharText===input){
         currentTask.activeWordCount++;

       }
     }else{
       currentTask.hasError = true; // Error in the current character
       currentTask.incorrectChars++;
     }
   }
   if (input_text.value.length == 1)
   {
     start_time = new Date().getTime(); // Record the start time
   }
   if (currentTask.activeIndex == currentTask.text.length){
     sample_text.innerHTML = currentTask.text;
     sample_text.classList.add("green");
     currentTask.finished = true;
     currentTask.activeWordCount++;

   }else{
     sample_text.innerHTML = strToHTML(currentTask.text,currentTask.activeIndex,input_text.value.length); // Highlight the current character in the task string
   }

   end_time = new Date().getTime(); // Record the end time
   var timeInSeconds = (end_time - start_time) / 1000; // Calculate the time taken in seconds
   var wordsPerMinute = (currentTask.activeWordCount / (timeInSeconds > 0 ? timeInSeconds : 0.000001)) * 60; 

   wpm_text.innerText = wordsPerMinute.toFixed(2).toString();
   
   num_word_text.innerText = currentTask.activeWordCount; // Display the number of words in the task string

   let result = (currentTask.activeIndex / sample_text.innerText.length) * 100; // Calculate the percentage of completion

   let roundedResult = result.toFixed(2); // Round the result to 2 decimal places

   let roundedResultString = roundedResult.toString(); // Convert the result to a string

   percentage_text.innerText = roundedResultString + "%"; // Display the percentage of completion

   let accuracy = 100.0;

   if (currentTask.incorrectChars || currentTask.correctChars){
     accuracy = currentTask.correctChars / (currentTask.correctChars + currentTask.incorrectChars) * 100.0; // Calculate the accuracy
   }
   accuracy_text.innerText = accuracy.toFixed(2).toString() + '%'; // Display the accuracy
 }
 visible_input.addEventListener("input", (event) => {
visible_input.value = ">";

console.log(event.key);
 console.log("Expected:", currentTask.text[currentTask.activeIndex]);
console.log("Typed:", input);


if (!currentTask.finished && char) {
 updateSampleHighlight({key: char});
} else {
 if (event.key === 'r') {
  resetTaskState();
  event.preventDefault();
  visible_input.value = ">";
 }
}
});
visible_input.addEventListener("keydown", function (event) {
 // Don't process if user is holding down Control (to allow shortcuts like Ctrl+R to reload)
 if (event.ctrlKey || event.metaKey) return;

 if (!currentTask.finished) {
   updateSampleHighlight(event); // this handles the live typing check
 } else {
   if (event.key === "r") {
     resetTaskState();            // resets the typing task
     event.preventDefault();      // prevent default browser refresh
     visible_input.value = ">";   // reset the input field
   }
 }
});


visible_input.addEventListener("focus", () => {
if (!visible_input.value) {
 visible_input.value = ">";
}
sample_text.classList.remove("gray");
});

visible_input.addEventListener("focusout", () => {
visible_input.value = "";
if (!sample_text.classList.contains("green")) {
 sample_text.classList.add("gray");
}
});

 randomize_btn.addEventListener("click",() => {
   randomize_btn.blur();

   randomize = !randomize; // Toggle the randomize state
   if (randomize){
     randomize_btn.classList.add("button-active");}
     else{
       randomize_btn.className = "";
     } // Add the active class to the randomize button
     resetTaskState(); // Reset the task state
 });
 new_btn.addEventListener("click",() => {
   new_btn.blur(); // Remove focus from the button
   input_text.focus();
   resetTaskState(); // Reset the task state
 });

 window.onload = () => {
   input_text.click();
 }

 input_text.addEventListener("click",() => {
   input_text.focus();
 });
hide_btn.addEventListener("click",() => {
 inputhidden = !inputhidden; // Toggle the input hidden state
 if (inputhidden){
   hide_btn.classList.add("button-active"); // Add the active class to the hide button
     visible_input.className = "";
     visible_input.classList.add("gray"); // Hide the input field
     }
 });

 
