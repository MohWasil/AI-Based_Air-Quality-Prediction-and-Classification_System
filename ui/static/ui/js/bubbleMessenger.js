// Bubble Messenger

const messengerBubble = document.getElementById("messengerBubble");
const chatBox = document.getElementById("chatBox");
let isChatBoxOpen = false;

// Toggle chat box visibility
messengerBubble.addEventListener("click", () => {
  isChatBoxOpen = !isChatBoxOpen;
  chatBox.style.display = isChatBoxOpen ? "block" : "none";
  if (isChatBoxOpen) {
    const bubbleRect = messengerBubble.getBoundingClientRect();
    chatBox.style.top = `${bubbleRect.bottom + 10}px`;
    chatBox.style.left = `${Math.min(
      bubbleRect.left,
      window.innerWidth - chatBox.offsetWidth - 10
    )}px`;
  }
});

// Draggable function for the messenger bubble
messengerBubble.onmousedown = function (event) {
  event.preventDefault();
  dragStart(event.clientX, event.clientY);

  function onMouseMove(event) {
    dragMove(event.clientX, event.clientY);
  }

  function onMouseUp() {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  }

  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
};

// Touch events for mobile devices
messengerBubble.ontouchstart = function (event) {
  const touch = event.touches[0];
  dragStart(touch.clientX, touch.clientY);

  function onTouchMove(event) {
    const touch = event.touches[0];
    dragMove(touch.clientX, touch.clientY);
  }

  function onTouchEnd() {
    document.removeEventListener("touchmove", onTouchMove);
    document.removeEventListener("touchend", onTouchEnd);
  }

  document.addEventListener("touchmove", onTouchMove);
  document.addEventListener("touchend", onTouchEnd);
};

function dragStart(startX, startY) {
  const rect = messengerBubble.getBoundingClientRect();
  shiftX = startX - rect.left;
  shiftY = startY - rect.top;
}

function dragMove(pageX, pageY) {
  const newX = Math.max(
    0,
    Math.min(pageX - shiftX, window.innerWidth - messengerBubble.offsetWidth)
  );
  const newY = Math.max(
    0,
    Math.min(pageY - shiftY, window.innerHeight - messengerBubble.offsetHeight)
  );
  messengerBubble.style.left = `${newX}px`;
  messengerBubble.style.top = `${newY}px`;

  if (isChatBoxOpen) {
    chatBox.style.top = `${newY + messengerBubble.offsetHeight + 10}px`;
    chatBox.style.left = `${Math.min(
      newX,
      window.innerWidth - chatBox.offsetWidth - 10
    )}px`;
  }
}
// Typing
function showDescription(type) {
  const descriptions = {
    induviaccount:
      "To open an account on the air Prediction website as an individual user, register with your personal details, including email and password. The platform allows you to access predictions and career insights tailored to your profile. Even in offline mode, important updates or recommendations are sent directly to your account for convenience.",
    orgaccount:
      "Organizations wishing to open an account on the Hire Prediction website must use an official business email; personal email addresses are not eligible for registration. As a registered organization, you'll gain access to tailored analytics, team-wide predictions, and exclusive tools to enhance hiring strategies. This ensures a professional and secure experience designed to meet organizational needs.",
  };

  let description = descriptions[type];
  let index = 0;
  const displayElement = document.getElementById("description");
  displayElement.innerHTML = "<span class='typing'></span>";

  function typeWriter() {
    if (index < description.length) {
      displayElement.querySelector(".typing").textContent +=
        description.charAt(index);
      index++;
      setTimeout(typeWriter, 50);
    } else {
      displayElement.querySelector(".typing").classList.remove("typing");
      addOrderButton(); // Order Now
    }
  }

  function addOrderButton() {
    const button = document.createElement("a");
    button.textContent = "Register Now";
    button.classList.add("d-block", "mt-3");
    button.href = "loginair.html";
    button.role = "button";

    //Css Aplly to the Botton
    button.style.backgroundColor = "#538221";
    button.style.color = "white";
    button.style.borderRadius = "2px";
    button.style.textAlign = "center";
    button.style.padding = "10px 20px";
    button.style.textDecoration = "none";

    // Hover
    button.onmouseover = function () {
      button.style.backgroundColor = "##659334";
    };
    button.onmouseout = function () {
      button.style.backgroundColor = "##659334";
    };

    button.onclick = function () {
      // Prompt to the User asking
      alert("Do you Register?");
    };

    displayElement.appendChild(button);
  }

  typeWriter();
}

// bubble Messenger Valaidition
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("chatFooter");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      event.stopPropagation();
    }

    form.classList.add("was-validated");
    const question = {
      name: document.getElementById("bubblemessengerName").value,
      phone: document.getElementById("bubblemessengerPhone").value,
      email: document.getElementById("bubblemessengerEmail").value,
      question: document.getElementById("bubblemessengerQuestion").value,
    };
    // console.log(question);
    fetch("/api/feedbacks/questions/", {
      method: "post",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(question),
    }).then((res) => console.log(res));
  });

  // Custom validation for Phone field
  const phoneInput = document.getElementById("bubblemessengerPhone");
  phoneInput.addEventListener("input", () => {
    const pattern = /^\+?[0-9\s\-]{7,15}$/;
    if (!pattern.test(phoneInput.value)) {
      phoneInput.setCustomValidity("Invalid phone number");
    } else {
      phoneInput.setCustomValidity("");
    }
  });
});
