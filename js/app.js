// Background animation (keeping this part as it's critical for UI)
window.addEventListener("DOMContentLoaded", () => {
  VANTA.BIRDS({
    el: "#vanta",
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.0,
    minWidth: 200.0,
    scale: 1.0,
    scaleMobile: 1.0,
    color1: "#d29f80",
    colorMode: "lerp",
  });
});

// Main blur and opacity animation
setTimeout(() => {
  const main = document.querySelector("main");
  main.style.opacity = 1;
  main.style.filter = "blur(0px)";
}, 1000);

const khmerTexts = [
  `ែស្នហាមានរសជាតិយ៉ាងមិចទៅ? តើអាចប្រាប់បងបានទេពាលពៅ? យប់នេះមិនចង់អោយអូននាំផ្លូវ ជូនទៅកន្លែងដែលមិនគួរទៅ`,
  `បច្ចេកវិទ្យាបានកំពុងផ្លាស់ប្តូរជីវិតរស់នៅរបស់យើងជារៀងរាល់ថ្ងៃ។ ការប្រើប្រាស់កុំព្យូទ័រ និងទូរស័ព្ទវៃឆ្លាតកាន់តែទូលំទូលាយនៅក្នុងសង្គមខ្មែរ។`,
];

// Task class encapsulates the typing task state and logic
class Task {
  constructor(text) {
    this.text = text;
    this.words = text.trim().split(/\s+/);
    this.numWords = this.words.length;
    this.activeIndex = 0;
    this.activeWordCount = 0;
    this.correctChars = 0;
    this.incorrectChars = 0;
    this.hasError = false;
    this.finished = false;
  }

  get currentChar() {
    return this.text.charAt(this.activeIndex);
  }

  incrementIndex() {
    this.activeIndex++;
    if (
      this.currentChar === " " ||
      this.activeIndex === this.text.length
    ) {
      this.activeWordCount++;
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Cache DOM elements
  const elements = {
    sample: document.getElementById("sample"),
    visibleInput: document.getElementById("visibleinput"),
    wpm: document.getElementById("wpm"),
    numWords: document.getElementById("num_words"),
    percentage: document.getElementById("percentage"),
    accuracy: document.getElementById("accuracy"),
    newBtn: document.getElementById("new"),
    randomizeBtn: document.getElementById("randomize"),
    hideBtn: document.getElementById("hideinput"),
  };

  let currentTask = null;
  let randomizeMode = false;
  let startTime = 0;
  let inputHidden = false;

  // Utility: Normalize and compare Khmer characters
  const compareKhmerChars = (expected, typed) =>
    expected.normalize("NFC") === typed.normalize("NFC");

  // Get a new task string based on mode
  function getNewTaskText() {
    if (randomizeMode) {
      // Pick a random word from a random text
      const randomText =
        khmerTexts[Math.floor(Math.random() * khmerTexts.length)];
      const words = randomText.trim().split(/\s+/);
      return words[Math.floor(Math.random() * words.length)];
    } else {
      // Pick a random full text
      return khmerTexts[Math.floor(Math.random() * khmerTexts.length)];
    }
  }

  // Render the sample text with cursor and highlighting
  function renderSampleText(text, cursorPos) {
    if (cursorPos === 0) {
      return `<span class="cursor">${text.charAt(0)}</span>${text.slice(1)}`;
    } else if (cursorPos >= text.length) {
      return `<span class="blue">${text}</span>`;
    } else {
      return (
        `<span class="blue">${text.slice(0, cursorPos)}</span>` +
        `<span class="cursor">${text.charAt(cursorPos)}</span>` +
        text.slice(cursorPos + 1)
      );
    }
  }

  // Reset and initialize the task state and UI
  function resetTask() {
    elements.sample.classList.remove("green", "gray");
    currentTask = new Task(getNewTaskText());
    elements.sample.innerHTML = renderSampleText(currentTask.text, 0);
    elements.visibleInput.value = ">";
    elements.percentage.textContent = "0%";
    elements.accuracy.textContent = "0%";
    elements.wpm.textContent = "0";
    elements.numWords.textContent = currentTask.numWords;
    startTime = 0;
    elements.visibleInput.focus();
  }

  // Update UI and task state based on typed character
  function handleTypedChar(char) {
    if (currentTask.finished) return;

    const expectedChar = currentTask.currentChar;

    if (compareKhmerChars(expectedChar, char)) {
      currentTask.correctChars++;
      currentTask.incrementIndex();
    } else {
      currentTask.hasError = true;
      currentTask.incorrectChars++;
    }

    if (startTime === 0) {
      startTime = Date.now();
    }

    // Check if task finished
    if (currentTask.activeIndex >= currentTask.text.length) {
      elements.sample.textContent = currentTask.text;
      elements.sample.classList.add("green");
      currentTask.finished = true;
      currentTask.activeWordCount = currentTask.numWords;
    } else {
      elements.sample.innerHTML = renderSampleText(
        currentTask.text,
        currentTask.activeIndex,
      );
    }

    updateStats();
  }

  // Update stats: WPM, accuracy, progress
  function updateStats() {
    const elapsedSeconds = (Date.now() - startTime) / 1000 || 1;
    const wpm = (currentTask.activeWordCount / elapsedSeconds) * 60;

    elements.wpm.textContent = wpm.toFixed(2);
    elements.numWords.textContent = currentTask.activeWordCount;
    elements.percentage.textContent = (
      (currentTask.activeIndex / currentTask.text.length) *
      100
    ).toFixed(2) + "%";

    const totalChars = currentTask.correctChars + currentTask.incorrectChars;
    const accuracy =
      totalChars > 0
        ? (currentTask.correctChars / totalChars) * 100
        : 100;

    elements.accuracy.textContent = accuracy.toFixed(2) + "%";
  }

  // Event: Input handler for visible input box
  elements.visibleInput.addEventListener("input", () => {
    const inputValue = elements.visibleInput.value;
    const typedChars = inputValue.slice(1); // Remove the leading '>'

    if (typedChars && !currentTask.finished) {
      for (const char of typedChars) {
        handleTypedChar(char);
      }
    }

    // Reset input to '>' after processing
    elements.visibleInput.value = ">";
  });

  // Event: Restart task on 'r' key if finished
  elements.visibleInput.addEventListener("keydown", (event) => {
    if (
      event.key.toLowerCase() === "r" &&
      currentTask.finished &&
      !event.ctrlKey &&
      !event.metaKey
    ) {
      event.preventDefault();
      resetTask();
    }
  });

  // Focus and blur handlers for visible input
  elements.visibleInput.addEventListener("focus", () => {
    if (!elements.visibleInput.value) {
      elements.visibleInput.value = ">";
    }
    elements.sample.classList.remove("gray");
  });

  elements.visibleInput.addEventListener("blur", () => {
    if (!inputHidden) {
      elements.visibleInput.value = "";
      if (!elements.sample.classList.contains("green")) {
        elements.sample.classList.add("gray");
      }
    }
  });

  // Button click handlers
  elements.randomizeBtn.addEventListener("click", () => {
    randomizeMode = !randomizeMode;
    elements.randomizeBtn.classList.toggle("button-active", randomizeMode);
    resetTask();
  });

  elements.newBtn.addEventListener("click", () => {
    resetTask();
  });

  elements.hideBtn.addEventListener("click", () => {
    inputHidden = !inputHidden;
    elements.hideBtn.classList.toggle("button-active", inputHidden);
    elements.visibleInput.classList.toggle("gray", inputHidden);
  });

  // Initialize first task on page load
  resetTask();
});
