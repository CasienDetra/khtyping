// Background animation (keeping this part as it's critical for UI)
window.addEventListener("DOMContentLoaded", () => {
  VANTA.WAVES({
    el: "#vanta",
  mouseControls: true,
  touchControls: true,
  gyroControls: false,
  minHeight: 200.00,
  minWidth: 200.00,
  scale: 1.00,
  scaleMobile: 1.00,
  color: 0x00000,
  shininess: 106.00,
  waveHeight: 23.00,
  waveSpeed: 0.40,
  zoom: 1.23
  });
});

setTimeout(() => {
  const main = document.querySelector("main");
  main.style.opacity = 1;
  main.style.filter = "blur(0px)";
}, 1000);

const khmerTexts = [
  `ែស្នហាមានរសជាតិយ៉ាងមិចទៅ? តើអាចប្រាប់បងបានទេពាលពៅ? យប់នេះមិនចង់អោយអូននាំផ្លូវ ជូនទៅកន្លែងដែលមិនគួរទៅ`,
  `បច្ចេកវិទ្យាបានកំពុងផ្លាស់ប្តូរជីវិតរស់នៅរបស់យើងជារៀងរាល់ថ្ងៃ។ ការប្រើប្រាស់កុំព្យូទ័រ និងទូរស័ព្ទវៃឆ្លាតកាន់តែទូលំទូលាយនៅក្នុងសង្គមខ្មែរ។`,
];

//declare 
function Task(text) {
  this.text = text;
  this.numwords = text.split(" ").length;
  this.activeWordCount = 0;
  this.activeIndex = 0;
  this.hasError = false;
  this.correctChars = 0;
  this.incorrectChars = 0;
  this.finished = false;
}

document.addEventListener("DOMContentLoaded", () => {
  const elements = {
    sample: document.getElementById("sample"),
    input: document.getElementById("input"),
    wpm: document.getElementById("wpm"),
    numWords: document.getElementById("num_words"),
    percentage: document.getElementById("percentage"),
    accuracy: document.getElementById("accuracy"),
    newBtn: document.getElementById("new"),
    randomizeBtn: document.getElementById("randomize"),
    visibleInput: document.getElementById("visibleinput"),
    hideBtn: document.getElementById("hideinput"),
  };

  let currentTaskID = 0;
  let randomize = false;
  let currentTask;
  let startTime = 0;
  let inputHidden = false;
  let isComposing = false; 

  function getNewTaskStr() {
    if (randomize) {
      const index = Math.floor(Math.random() * khmerTexts.length);
      const text = khmerTexts[index];
      const words = text.split(/\s+/).filter((word) => word !== "");
      const wordIndex = Math.floor(Math.random() * words.length);
      return words[wordIndex];
    } else {
      const index = Math.floor(Math.random() * khmerTexts.length);
      currentTaskID = index;
      return khmerTexts[index];
    }
  }

  function strToHTML(str, correctEnd) {
    if (correctEnd === 0) {
      return `<span class="cursor">${str.charAt(0)}</span>${str.substring(1)}`;
    } else if (correctEnd === str.length) {
      return `<span class="blue">${str}</span>`;
    } else {
      return (
        `<span class="blue">${str.substring(0, correctEnd)}</span>` +
        `<span class="cursor">${str.charAt(correctEnd)}</span>` +
        `${str.substring(correctEnd + 1)}`
      );
    }
  }

  // Reset
  function resetTaskState() {
    elements.sample.classList.remove("green", "gray");
    elements.visibleInput.value = ">";
    currentTask = new Task(getNewTaskStr());
    elements.sample.innerHTML = strToHTML(currentTask.text, 0);
    elements.input.value = "";
    elements.percentage.innerText = "0%";
    elements.accuracy.innerText = "0%";
    elements.wpm.innerText = "0";
    elements.numWords.innerText = currentTask.numwords;
    startTime = 0;
    elements.visibleInput.focus();
  }

  function compareKhmerChars(expected, typed) {
    return expected.normalize("NFC") === typed.normalize("NFC");
  }

  function updateUI(typedText) {
    if (currentTask.finished || isComposing) return;

    const expectedText = currentTask.text.substring(currentTask.activeIndex);
    let newCorrectChars = 0;
    let newIncorrectChars = 0;
    let newActiveIndex = currentTask.activeIndex;

    for (let i = 0; i < typedText.length; i++) {
      const typedChar = typedText[i];
      const expectedChar = expectedText[i];

      if (expectedChar && compareKhmerChars(expectedChar, typedChar)) {
        newCorrectChars++;
        newActiveIndex++;
      } else {
        newIncorrectChars++;
        currentTask.hasError = true;
      }
    }

    currentTask.correctChars += newCorrectChars;
    currentTask.incorrectChars += newIncorrectChars;
    currentTask.activeIndex = newActiveIndex;

    if (startTime === 0) {
      startTime = new Date().getTime();
    }

    if (currentTask.activeIndex === currentTask.text.length) {
      elements.sample.innerHTML = currentTask.text;
      elements.sample.classList.add("green");
      currentTask.finished = true;
      currentTask.activeWordCount = currentTask.numwords;
    } else {
      elements.sample.innerHTML = strToHTML(
        currentTask.text,
        currentTask.activeIndex,
      );
    }

    // Update stats
    const endTime = new Date().getTime();
    const timeInSeconds = (endTime - startTime) / 1000;
    const wpm =
      timeInSeconds > 0
        ? (currentTask.activeWordCount / timeInSeconds) * 60
        : 0;

    elements.wpm.innerText = wpm.toFixed(2);
    elements.numWords.innerText = currentTask.activeWordCount;
    elements.percentage.innerText =
      ((currentTask.activeIndex / currentTask.text.length) * 100).toFixed(2) +
      "%";

    const totalChars = currentTask.correctChars + currentTask.incorrectChars;
    const accuracy =
      totalChars > 0 ? (currentTask.correctChars / totalChars) * 100 : 100;
    elements.accuracy.innerText = accuracy.toFixed(2) + "%";
  }

  // Initialize first task
  currentTask = new Task(getNewTaskStr());
  elements.sample.innerHTML = strToHTML(currentTask.text, 0);
  elements.numWords.innerText = currentTask.numwords;

  elements.visibleInput.addEventListener("input", function (event) {
    if (isComposing) return; 

    const typedText = elements.visibleInput.value.substring(1); 

    if (typedText.length > 0 && !currentTask.finished) {
      updateUI(typedText);
    }

    if (!isComposing && !currentTask.finished) {
      elements.visibleInput.value = ">";
    }
  });

  elements.visibleInput.addEventListener("compositionstart", () => {
    isComposing = true;
  });

  elements.visibleInput.addEventListener("compositionend", (event) => {
    isComposing = false;
    const typedText = elements.visibleInput.value.substring(1); 
    if (typedText.length > 0 && !currentTask.finished) {
      updateUI(typedText);
    }
    elements.visibleInput.value = ">"; 
  });

  elements.visibleInput.addEventListener("keydown", function (event) {
    if (
      event.key === "r" &&
      currentTask.finished &&
      !event.ctrlKey &&
      !event.metaKey
    ) {
      event.preventDefault();
      resetTaskState();
    }
    if (event.key === "Backspace" && elements.visibleInput.value === ">") {
      event.preventDefault();
    }
  });

  elements.visibleInput.addEventListener("focus", () => {
    if (!elements.visibleInput.value) {
      elements.visibleInput.value = ">";
    }
    elements.sample.classList.remove("gray");
  });

  elements.visibleInput.addEventListener("focusout", () => {
    if (!inputHidden) {
      elements.visibleInput.value = "";
      if (!elements.sample.classList.contains("green")) {
        elements.sample.classList.add("gray");
      }
    }
  });

  // Button handlers
  elements.randomizeBtn.addEventListener("click", () => {
    elements.randomizeBtn.blur();
    randomize = !randomize;
    elements.randomizeBtn.classList.toggle("button-active", randomize);
    resetTaskState();
  });

  elements.newBtn.addEventListener("click", () => {
    elements.newBtn.blur();
    resetTaskState();
  });

  elements.hideBtn.addEventListener("click", () => {
    elements.hideBtn.blur();
    inputHidden = !inputHidden;
    elements.hideBtn.classList.toggle("button-active", inputHidden);
    elements.visibleInput.classList.toggle("gray", inputHidden);
  });


  elements.visibleInput.focus();
});
