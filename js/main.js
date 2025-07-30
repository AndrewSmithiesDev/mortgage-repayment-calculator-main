//Clear form
const emptyResults = document.querySelector(".empty-results");

const completedResults = document.querySelector(".completed-results");

function resetForm() {
  const form = document.querySelector("#calc-form");
  form.reset();
  document.querySelectorAll(".mortgage-radios").forEach((wrapper) => {
    wrapper.classList.remove("radio-focus");
  });
  form
    .querySelectorAll(".is-invalid")
    .forEach((el) => el.classList.remove("is-invalid"));
  form
    .querySelectorAll(".invalid-feedback")
    .forEach((el) => (el.style.display = "none"));
  if (emptyResults) emptyResults.style.display = "flex";
  if (completedResults) completedResults.style.display = "none";
}

//Add focus lime colour for left label (can't use CSS +label)

const mortgageAmount = document.querySelector("#mortgage-amount");
const limeLabel = mortgageAmount.previousElementSibling;

mortgageAmount.addEventListener("focus", () => {
  limeLabel.classList.add("focus-lime");
  limeLabel.classList.add("text-slate900");
});

mortgageAmount.addEventListener("blur", () => {
  limeLabel.classList.remove("focus-lime");
  limeLabel.classList.remove("text-slate900");
});

//Change css of radio div when changed

const radioInputs = document.querySelectorAll('input[name="mortgage-type"]');

radioInputs.forEach((input) => {
  input.addEventListener("change", () => {
    document.querySelectorAll(".mortgage-radios").forEach((wrapper) => {
      wrapper.classList.remove("radio-focus");
    });

    const wrapper = input.closest(".mortgage-radios");
    if (wrapper) {
      wrapper.classList.add("radio-focus");
    }
  });
});

//Form validation

document.getElementById("calc-form").addEventListener("submit", function (e) {
  e.preventDefault(); // Stop actual form submission

  let isValid = true;

  const requiredFields = ["mortgage-amount", "mortgage-term", "interest-rate"];

  requiredFields.forEach((id) => {
    const input = document.getElementById(id);
    const feedback = input.closest(".mb-3").querySelector(".invalid-feedback");

    if (!input.value.trim()) {
      input.classList.add("is-invalid");
      feedback.style.display = "block";
      isValid = false;
    } else {
      input.classList.remove("is-invalid");
      feedback.style.display = "none";
    }
  });

  // Validate radio buttons (mortgage type)
  const radios = document.querySelectorAll('input[name="mortgage-type"]');
  const radioGroup = document.querySelector(
    ".form-check.mortgage-radios"
  ).parentElement;
  const radioFeedback = radioGroup.querySelector(".invalid-feedback");

  const radioChecked = Array.from(radios).some((r) => r.checked);

  if (!radioChecked) {
    radioFeedback.style.display = "block";
    isValid = false;
  } else {
    radioFeedback.style.display = "none";
  }

  if (isValid) {
    // Calculations
    const inputText = document.querySelectorAll('input[type="text"]');

    const inputAmount = document.querySelector("#mortgage-amount").value;

    const inputTerm = document.querySelector("#mortgage-term").value;

    const inputRate = document.querySelector("#interest-rate").value;

    const typeRepayment = document.querySelector("#repayment");

    const typeInterest = document.querySelector("#interest");

    const repayMonthly = document.querySelector("#monthly-repayments");

    const repayTerm = document.querySelector("#repay-term");

    const interest = inputRate / 100 / 12;

    const numberOfPayments = inputTerm * 12;

    const repaymentMonthly =
      (inputAmount * interest * (1 + interest) ** numberOfPayments) /
      ((1 + interest) ** numberOfPayments - 1);

    const repaymentMonthlyRounded = repaymentMonthly.toFixed(2);

    const repaymentTotal = (repaymentMonthlyRounded * numberOfPayments).toFixed(
      2
    );

    const interestOnlyMonthly = inputAmount * interest;
    const interestOnlyTerm = interestOnlyMonthly * numberOfPayments;

    const interestOnlyMonthlyRounded = interestOnlyMonthly.toFixed(2);

    const interestOnlyTermRounded = interestOnlyTerm.toFixed(2);

    const selectedType = document.querySelector(
      'input[name="mortgage-type"]:checked'
    ).value;

    if (selectedType === "repayment") {
      repayMonthly.textContent = `£${repaymentMonthlyRounded}`;
      repayTerm.textContent = `£${repaymentTotal}`;
    } else if (selectedType === "interest") {
      repayMonthly.textContent = `£${interestOnlyMonthlyRounded}`;
      repayTerm.textContent = `£${interestOnlyTermRounded}`;
    }

    if (emptyResults) emptyResults.style.display = "none";
    if (completedResults) completedResults.style.display = "flex";
  }
});
