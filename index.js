const url = "http://api.nbp.pl/api/exchangerates/rates/a/";
const main = document.querySelector(".main");
const h2 = document.createElement("h2");
h2.textContent = "Przelicznik walut";
h2.classList.add("header");
main.appendChild(h2);
const form = document.createElement("form");
form.setAttribute("onSubmit", "return false");
main.appendChild(form);
const input = document.createElement("input");
input.setAttribute("type", "number");
input.setAttribute("placeholder", "podaj liczbę");
input.setAttribute("required", true);
input.classList.add("input-field");
form.appendChild(input);
const select = document.createElement("select");
select.setAttribute("type", "select");
select.classList.add("select-list");
form.appendChild(select);
const button = document.createElement("button");
button.setAttribute("id", "getCurrencies");
button.classList.add("button-submit");
button.setAttribute("type", "submit");
button.textContent = "Przelicz";
form.appendChild(button);
const spanWynik = document.createElement("span");
spanWynik.classList.add("span-result");
spanWynik.textContent = "";
const loader = document.createElement("span");
const errorLabel = document.createElement("label");
errorLabel.classList.add("error-label");

const currencies = ["EUR", "USD", "CHF"];

currencies.forEach((currency) => {
  const option = document.createElement("option");
  option.value = currency;
  option.textContent = currency;
  select.appendChild(option);
});

const addErrorLabel = () => {
  spanWynik.textContent = "";
  errorLabel.textContent = "Request Error";
  main.appendChild(errorLabel);
  loader.remove();
  input.value = "";
};

const clearLabel = () => {
  errorLabel.remove();
};

select.addEventListener("change", () => {
  spanWynik.remove();
});

const displayLoading = () => {
  main.appendChild(loader);
  spanWynik.remove();
  loader.classList.add("loader");
};

const hideLoading = () => {
  loader.remove();
};

const getRate = () => {
  displayLoading();
  fetch(`${url}${select.value}/`)
    .then((response) => response.json())
    .then((data) => {
      hideLoading();
      const rateValue = Number(data.rates[0].mid);
      result(rateValue);
    })
    .catch((err) => {
      addErrorLabel(err);
    });
};

const result = (rateValue) => {
  main.appendChild(spanWynik);
  const inputVal = input.value;
  const result = inputVal * rateValue;
  if (input.value !== "") {
    spanWynik.textContent = `${Number(inputVal).toFixed(2)} ${
      select.value
    } = ${result.toFixed(2)} PLN`;
  } else spanWynik.remove();

  input.value = "";
};

const validateInput = () => {
  if (input.value === "") {
    errorLabel.textContent = "Kwota nie może być pusta";
    main.appendChild(errorLabel);
    spanWynik.remove();
    return false;
  } else if (input.value < 0.01) {
    errorLabel.textContent = "Kwota nie może być mniejsza niż 0.01";
    main.appendChild(errorLabel);
    spanWynik.remove();
    return false;
  }
  errorLabel.remove();
  getRate();
  clearLabel();
};

button.addEventListener("click", () => {
  errorLabel.remove();
  validateInput();
});
