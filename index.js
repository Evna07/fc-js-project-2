const url = "https://api.nbp.pl/api/exchangerates/rates/a/";
const container = document.querySelector("#appContainer");
const currecyList = document.querySelector("#currenciesList");
const buttonSubmit = document.querySelector("#getCurrencies");
const amount = document.querySelector("#userAmount");
const totalResult = document.createElement("span");
totalResult.classList.add("total-result");
totalResult.textContent = "";
const loader = document.createElement("span");
const errorLabel = document.createElement("label");
errorLabel.classList.add("error-label");

const currencies = ["EUR", "USD", "CHF"];

const userForm = document.querySelector("#userForm");
userForm.addEventListener("submit", (event) => {
  event.preventDefault();
});

currencies.forEach((currency) => {
  const optionCurrecy = document.createElement("option");
  optionCurrecy.value = currency;
  optionCurrecy.textContent = currency;
  currecyList.appendChild(optionCurrecy);
});

const addErrorLabel = (errMsg) => {
  totalResult.textContent = "";
  errorLabel.textContent = errMsg;
  container.appendChild(errorLabel);
  loader.remove();
  amount.value = "";
};

const clearLabel = () => {
  errorLabel.remove();
};

currecyList.addEventListener("change", () => {
  totalResult.remove();
});

const displayLoading = () => {
  container.appendChild(loader);
  totalResult.remove();
  loader.classList.add("loader");
};

const hideLoading = () => {
  loader.remove();
};

const getRate = () => {
  displayLoading();
  fetch(`${url}${currecyList.value}/`)
    .then((response) => response.json())
    .then((data) => {
      hideLoading();
      const rate = data?.rates?.[0]?.mid;
      if (rate) {
        const rateValue = Number(rate);
        result(rateValue);
      } else {
        addErrorLabel("Nie można uzyskać wartości kursu waluty.");
      }
    })
    .catch((err) => {
      addErrorLabel("Request Error");
    });
};

const result = (rateValue) => {
  container.appendChild(totalResult);
  const inputVal = amount.value;
  const result = inputVal * rateValue;
  if (amount.value !== "") {
    totalResult.textContent = `${Number(inputVal).toFixed(2)} ${
      currecyList.value
    } = ${result.toFixed(2)} PLN`;
  } else {
    totalResult.remove();
  }

  amount.value = "";
};

const validateInput = () => {
  if (amount.value === "") {
    errorLabel.textContent = "Kwota nie może być pusta";
    container.appendChild(errorLabel);
    totalResult.remove();
    return false;
  } else if (amount.value < 0.01) {
    errorLabel.textContent = "Kwota nie może być mniejsza niż 0.01";
    container.appendChild(errorLabel);
    amount.value = "";
    totalResult.remove();
    return false;
  }
  errorLabel.remove();
  getRate();
  clearLabel();
};

userForm.addEventListener("submit", () => {
  errorLabel.remove();
  validateInput();
});
