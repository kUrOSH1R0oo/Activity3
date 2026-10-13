/* Onii-Chan Cafe - all JavaScript lives here (no inline <script> logic). */

// Teasing lines shown when you hover a menu card
const whispers = {
  tempura: "Careful, it's hot... but you like it that way, right?",
  ebi: "Mmm, so juicy. Don't make a mess, okay?",
  curry: "I can't hide how I feel... it's getting spicy in here.",
  omu: "Say 'aaah'... I'll feed you if you ask nicely.",
  veg: "Eat your vegetables. Then maybe you'll get a reward.",
  tako: "Blow on it first. Yes, like that. Good.",
  berry: "You're blushing. Is it the strawberries, or me?",
  matcha: "Sweet and a little bitter. Just like me.",
  pudding: "Look at it wobble. Don't stare, you'll make it shy.",
};

let spicyMode = false;
let orderItems = [];
let toastTimer = null;

// Small helper: pop a message at the bottom of the screen
function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.innerHTML = message;
  toast.style.opacity = "1";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { toast.style.opacity = "0"; }, 2200);
}

/* 1) onclick: switch between Sweet and Spicy mode (recolors the whole site and changes the text) */
function toggleTeaseMode() {
  spicyMode = !spicyMode;
  const root = document.documentElement;
  const btn = document.getElementById("modeBtn");
  const tagline = document.getElementById("tagline");
  const spicyColors = {
    "--pink": "#ee3b4b",
    "--pink-deep": "#a8141f",
    "--blush": "#ffc9b8",
    "--paper": "#ffe6da"
  };

  for (const name in spicyColors) {
    if (spicyMode) {
      root.style.setProperty(name, spicyColors[name]);
    } else {
      root.style.removeProperty(name);
    }
  }

  if (spicyMode) {
    btn.innerHTML = "Cool me down";
    if (tagline) tagline.innerHTML = "You asked for it... the tempura is extra hot tonight.";
    showToast("Spicy mode on. Don't say we didn't warn you.");
  } else {
    btn.innerHTML = "Turn up the heat";
    if (tagline) tagline.innerHTML = "Come a little closer... the tempura is hot, and so are we.";
    showToast("Back to sweet mode. Good choice.");
  }
}

/* 2) onclick: ring the bell for a random flirty greeting */
function ringBell() {
  const greeting = document.getElementById("greeting");
  const art = document.getElementById("heroArt");
  if (!greeting) return;
  const lines = [
    "Welcome home, Onii-chan~ We saved your favorite seat.",
    "Oh? You came back for more? We like that.",
    "Sit down, relax. Let us take care of you tonight.",
    "You're late... but we'll forgive you if you order the tempura."
  ];
  greeting.innerHTML = lines[Math.floor(Math.random() * lines.length)];
  greeting.style.transform = "scale(1.05)";
  setTimeout(function () { greeting.style.transform = "scale(1)"; }, 300);
  if (art) art.style.transform = "rotate(" + (Math.random() * 20 - 10) + "deg)";
}

/* 3) onmouseover / onmouseout: the best seller card teases you */
function teaseBestseller() {
  document.getElementById("bestsellerTitle").innerHTML = "Hands off... unless you're buying";
  document.getElementById("bestsellerText").innerHTML = "Hot, golden and a little rough around the edges. Order it before someone else does.";
  document.getElementById("bestsellerCard").style.backgroundColor = "#ffc2d6";
}
function calmBestseller() {
  document.getElementById("bestsellerTitle").innerHTML = "Fried Tempura Set";
  document.getElementById("bestsellerText").innerHTML = "Golden, crispy shrimp tempura served piping hot, with a dipping sauce you'll want to lick off the plate. ₱280";
  document.getElementById("bestsellerCard").style.backgroundColor = "";
}

/* 4) onmouseover / onmouseout on menu cards: show and hide a whisper */
function showWhisper(id) {
  const el = document.getElementById("whisper-" + id);
  if (el) el.innerHTML = whispers[id];
}
function hideWhisper(id) {
  const el = document.getElementById("whisper-" + id);
  if (el) el.innerHTML = "";
}

/* 5) onchange: filter the menu by category */
function filterMenu() {
  const chosen = document.getElementById("categorySelect").value;
  const cards = document.getElementsByClassName("menu-card");
  const heading = document.getElementById("menuHeading");
  let shown = 0;
  for (let i = 0; i < cards.length; i++) {
    const match = chosen === "All" || cards[i].dataset.category === chosen;
    cards[i].style.display = match ? "flex" : "none";
    if (match) shown++;
  }
  heading.innerHTML = chosen === "All" ? "The Full Menu" : chosen + " (" + shown + ")";
  document.getElementById("searchBox").value = "";
  document.getElementById("emptyMsg").style.display = shown === 0 ? "block" : "none";
}

/* 6) oninput: live search while you type */
function searchMenu() {
  const term = document.getElementById("searchBox").value.toLowerCase().trim();
  const cards = document.getElementsByClassName("menu-card");
  let shown = 0;
  for (let i = 0; i < cards.length; i++) {
    const match = cards[i].dataset.name.indexOf(term) !== -1;
    cards[i].style.display = match ? "flex" : "none";
    if (match) shown++;
  }
  document.getElementById("categorySelect").value = "All";
  document.getElementById("menuHeading").innerHTML = term ? "Found " + shown + " for you" : "The Full Menu";
  document.getElementById("emptyMsg").style.display = shown === 0 ? "block" : "none";
}

/* 7) onclick: add a dish to the order tray */
function addToOrder(name, price) {
  orderItems.push({ name: name, price: price });
  renderOrder();
  showToast("Added " + name + ". Good choice~");
}

/* 8) onclick: clear the order tray */
function clearOrder() {
  orderItems = [];
  renderOrder();
  showToast("Tray cleared. Changing your mind already?");
}

// Redraws the order panel (innerHTML + style changes)
function renderOrder() {
  const list = document.getElementById("orderList");
  const total = document.getElementById("orderTotal");
  const note = document.getElementById("orderNote");
  let sum = 0;
  let html = "";
  for (let i = 0; i < orderItems.length; i++) {
    sum += orderItems[i].price;
    html += "<li><span>" + orderItems[i].name + "</span><span>P" + orderItems[i].price + "</span></li>";
  }
  list.innerHTML = html;
  total.innerHTML = "Total: ₱" + sum;
  total.style.fontSize = orderItems.length ? "1.6rem" : "1.3rem";
  if (orderItems.length === 0) {
    note.innerHTML = "Nothing here yet. Don't be shy.";
  } else if (orderItems.length < 3) {
    note.innerHTML = orderItems.length + " item(s). Just getting started, hmm?";
  } else {
    note.innerHTML = orderItems.length + " items! Someone's hungry tonight";
  }
}

// Hides a photo that failed to load so the emoji behind it shows instead
function hideBrokenImage(img) {
  img.style.display = "none";
}
