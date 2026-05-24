const messagesEl = document.querySelector("#messages");
const form = document.querySelector("#chatForm");
const input = document.querySelector("#messageInput");
const resetButton = document.querySelector("#resetButton");
const reservationCard = document.querySelector("#reservationCard");

const templates = {
  plan:
    "12月の土日に、僕・妻・息子（3歳）で、1泊2日の箱根旅行に行きたいと思っているんだけど、5万円の予算で、おすすめの宿、周辺の飲食店でランチ・ディナーの予約をお願い。",
  book: "いいプランだね。これで予約しておいて。",
};

const initialMessages = [
  {
    role: "assistant",
    text:
      "こんにちは。じゃらんの宿泊候補とホットペッパーグルメの飲食店候補をまとめて、予算内の旅行プランを提案します。",
  },
];

let messages = [...initialMessages];
let proposed = false;
let booked = false;

function renderMessages() {
  messagesEl.innerHTML = "";

  messages.forEach((message) => {
    const wrapper = document.createElement("article");
    wrapper.className = `message ${message.role}`;

    const sender = document.createElement("div");
    sender.className = "sender";
    sender.textContent = message.role === "user" ? "You" : "Ring AI";

    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.textContent = message.text;

    wrapper.append(sender, bubble);

    if (message.plan) {
      wrapper.append(createPlanCard());
    }

    messagesEl.append(wrapper);
  });

  messagesEl.scrollTop = messagesEl.scrollHeight;
  reservationCard.style.outline = booked ? "3px solid rgba(27, 127, 99, 0.25)" : "0";
}

function createPlanCard() {
  const card = document.createElement("div");
  card.className = "plan-card";
  card.innerHTML = `
    <h3>提案プラン</h3>
    <div class="plan-grid">
      <div class="plan-item">
        <span>じゃらん</span>
        <strong>箱根湯本 やすらぎテラス</strong>
        <p>大人2名 + 幼児1名、夕朝食付きファミリープラン。宿泊費 39,600円。</p>
      </div>
      <div class="plan-item">
        <span>Hot Pepper</span>
        <strong>箱根イタリアン ルーチェ</strong>
        <p>初日 12:30、ベビーチェアあり。ランチ予算 6,600円。</p>
      </div>
      <div class="plan-item">
        <span>夕食</span>
        <strong>宿の夕食付きプラン</strong>
        <p>移動を減らして、お子さま連れでも過ごしやすい導線です。</p>
      </div>
    </div>
    <div class="total-bar">
      <span>宿泊 + ランチ + 入湯税等</span>
      <strong>49,200円</strong>
    </div>
  `;
  return card;
}

function pushUserMessage(text) {
  messages.push({ role: "user", text });
}

function pushAssistantMessage(message) {
  messages.push(message);
}

function getAssistantResponse(text) {
  const normalized = text.replace(/\s/g, "");

  if (/予約|お願い|これで|確定|取って/.test(normalized) && proposed) {
    booked = true;
    return {
      role: "assistant",
      text:
        "承知しました。こちらの内容で予約手続きを進めます。\n\n予約内容は、お客様のメールアドレスにお送りします。宿泊予約番号と飲食店予約番号も、同じメールにまとめて記載します。",
    };
  }

  if (/箱根|旅行|12月|土日|5万|予算|息子|ランチ|ディナー/.test(normalized)) {
    proposed = true;
    return {
      role: "assistant",
      text:
        "おすすめの宿は「箱根湯本 やすらぎテラス」です。\n\nランチは周辺の「箱根イタリアン ルーチェ」を 12:30 で押さえる想定がよさそうです。ディナーは宿の夕食付きプランに含まれているため、お子さま連れでも移動が少なく安心です。\n\n合計は 49,200円です。",
      plan: true,
    };
  }

  return {
    role: "assistant",
    text:
      "このモックでは、箱根1泊2日・家族3名・5万円以内の旅行相談と予約確定の流れを体験できます。サンプル入力から試してみてください。",
  };
}

function handleSubmit(event) {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  pushUserMessage(text);
  input.value = "";
  renderMessages();

  window.setTimeout(() => {
    pushAssistantMessage(getAssistantResponse(text));
    renderMessages();
  }, 450);
}

function resetConversation() {
  messages = [...initialMessages];
  proposed = false;
  booked = false;
  input.value = "";
  renderMessages();
}

form.addEventListener("submit", handleSubmit);
resetButton.addEventListener("click", resetConversation);

document.querySelectorAll("[data-template]").forEach((button) => {
  button.addEventListener("click", () => {
    input.value = templates[button.dataset.template];
    input.focus();
  });
});

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
    form.requestSubmit();
  }
});

renderMessages();
