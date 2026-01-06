const from = document.getElementById("from");
const to = document.getElementById("to");
const historyList = document.getElementById("history");
const resultBox = document.getElementById("result");
const statusBox = document.getElementById("status");

let rates = {};
let history = JSON.parse(localStorage.getItem("history")) || [];

const currencyList = [
    "USD", "NPR", "INR", "PKR", "CNY",
    "JPY", "AED", "EUR", "GBP"
];

// Load conversion history
function loadHistory() {
    historyList.innerHTML = "";
    history.forEach(item => {
        const li = document.createElement("li");
        li.innerText = item;
        historyList.appendChild(li);
    });
}

// Fetch live exchange rates
async function loadRates() {
    if (!navigator.onLine) {
        statusBox.innerText = "❌ No internet connection";
        return;
    }

    try {
        const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
        const data = await response.json();
        rates = data.rates;

        currencyList.forEach(code => {
            from.innerHTML += `<option value="${code}">${code}</option>`;
            to.innerHTML += `<option value="${code}">${code}</option>`;
        });

        statusBox.innerText = "✅ Live exchange rates loaded";
        autoDetectCurrency();
    } catch {
        statusBox.innerText = "❌ Failed to load rates";
    }
}

// Auto-detect country currency
async function autoDetectCurrency() {
    try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();

        if (currencyList.includes(data.currency)) {
            from.value = data.currency;
        }
    } catch {
        // Silent fail
    }
}

function convert() {
    const amount = document.getElementById("amount").value;
    const f = from.value;
    const t = to.value;

    if (amount <= 0) {
        resultBox.innerText = "Enter a valid amount";
        return;
    }

    const converted = (amount / rates[f]) * rates[t];
    const text = `${amount} ${f} → ${converted.toFixed(2)} ${t}`;

    resultBox.innerText = text;

    history.unshift(text);
    history = history.slice(0, 10); // keep last 10
    localStorage.setItem("history", JSON.stringify(history));
    loadHistory();
}

function toggleDark() {
    document.body.classList.toggle("dark");
}

// Initial load
loadRates();
loadHistory();
