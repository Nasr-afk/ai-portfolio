const terminal = document.getElementById('terminal');
const historyKey = 'storyModeProgress';

const story = [
  { q: "Welcome, human. What is your name?", key: 'name' },
  { q: (ans) => `Ah, ${capitalize(ans)}, nice to meet you. Would you like to explore my background or projects? (type: background/projects)`, key: 'firstChoice' },
  { q: (ans) => ans === 'background' ? "I studied Computer Science and have experience with full-stack web dev, especially MERN stack. Next? (skills/projects)" : "Here are some of my cool projects: AI Study Buddy, Prominder AI, and a University Ride-Pooling app. Want to hear about my skills or background? (skills/background)", key: 'secondChoice' },
  { q: "Here's a summary of my key skills: JavaScript, React, Node.js, MongoDB, DSA, and more. Want my contact info or end this chat? (contact/end)", key: 'finalChoice' },
  { q: "Email: yourname@example.com | LinkedIn: linkedin.com/in/yourname | GitHub: github.com/yourhandle. Type 'end' to finish.", key: 'contact' },
  { q: "Thanks for exploring. May our paths cross again. Refresh to restart. Goodbye.", key: 'end' },
];

let progress = JSON.parse(localStorage.getItem(historyKey)) || { step: 0, answers: {} };

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function typeText(text, delay = 30, callback) {
  let index = 0;
  const line = document.createElement('div');
  terminal.appendChild(line);
  terminal.scrollTop = terminal.scrollHeight;

  function typeChar() {
    if (index < text.length) {
      line.textContent += text.charAt(index);
      index++;
      terminal.scrollTop = terminal.scrollHeight;
      setTimeout(typeChar, delay);
    } else {
      line.classList.add('fade-in');
      if (callback) callback();
    }
  }
  typeChar();
}

function askQuestion() {
  const step = progress.step;
  if (step >= story.length) return;

  const question = story[step];
  const prompt = typeof question.q === 'function' ? question.q(progress.answers[question.key === 'firstChoice' ? 'name' : 'firstChoice']) : question.q;

  typeText(prompt, 25, () => {
    const inputLine = document.createElement('div');
    inputLine.className = 'input-line blinking-cursor';

    const input = document.createElement('input');
    input.type = 'text';
    input.autofocus = true;

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const answer = input.value.trim().toLowerCase();
        progress.answers[question.key] = answer;
        progress.step++;
        localStorage.setItem(historyKey, JSON.stringify(progress));
        print(`> ${input.value}`);
        inputLine.remove();
        setTimeout(askQuestion, 500);
      }
    });

    inputLine.appendChild(input);
    terminal.appendChild(inputLine);
    input.focus();
    terminal.scrollTop = terminal.scrollHeight;
  });
}

function print(text, className = 'fade-in') {
  const line = document.createElement('div');
  line.textContent = text;
  line.className = className;
  terminal.appendChild(line);
  terminal.scrollTop = terminal.scrollHeight;
}

askQuestion();

// Dark/Light Mode Toggle
const toggleButton = document.getElementById('theme-toggle');
const body = document.body;

// Check saved theme in localStorage
if (localStorage.getItem('theme') === 'dark') {
  body.classList.add('dark');
}

toggleButton.addEventListener('click', () => {
  body.classList.toggle('dark');
  const theme = body.classList.contains('dark') ? 'dark' : 'light';
  localStorage.setItem('theme', theme);
});
