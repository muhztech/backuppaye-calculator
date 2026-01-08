// ================= COMMON TAX LOGIC =================

const EXEMPT_LIMIT = 1200000;

const TAX_BANDS = [
  { limit: 2200000, rate: 0.15 },
  { limit: 9000000, rate: 0.18 },
  { limit: 13000000, rate: 0.21 },
  { limit: 25000000, rate: 0.23 },
  { limit: Infinity, rate: 0.25 }
];

function computeTax(amount) {
  let remaining = amount;
  let tax = 0;

  for (let band of TAX_BANDS) {
    if (remaining <= 0) break;
    let taxable = Math.min(band.limit, remaining);
    tax += taxable * band.rate;
    remaining -= taxable;
  }
  return tax;
}

// ================= PAYE =================

function calculatePAYE() {
  const monthlySalaryEl = document.getElementById("monthlySalary");
  const resultEl = document.getElementById("payeResult");

  if (!monthlySalaryEl || !resultEl) {
    alert("PAYE elements not found in HTML");
    return;
  }

  const monthlySalary = Number(monthlySalaryEl.value);

  if (monthlySalary <= 0) {
    alert("Enter a valid monthly salary");
    return;
  }

  const annualIncome = monthlySalary * 12;

  if (annualIncome <= EXEMPT_LIMIT) {
    resultEl.innerHTML =
      "<p><b>Annual Income:</b> ₦" + annualIncome.toLocaleString() + "</p>" +
      "<p><b>Status:</b> <span style='color:green'>EXEMPT</span></p>" +
      "<p>No PAYE payable under the new tax law.</p>";
    return;
  }

  const taxableIncome = annualIncome - EXEMPT_LIMIT;
  const annualTax = computeTax(taxableIncome);
  const monthlyTax = annualTax / 12;

  resultEl.innerHTML =
    "<p><b>Annual Income:</b> ₦" + annualIncome.toLocaleString() + "</p>" +
    "<p><b>Taxable Income:</b> ₦" + taxableIncome.toLocaleString() + "</p>" +
    "<hr>" +
    "<p><b>Annual PAYE:</b> ₦" + annualTax.toLocaleString() + "</p>" +
    "<p><b>Monthly PAYE:</b> ₦" + monthlyTax.toLocaleString() + "</p>";
}

// ================= PIT =================

function calculatePIT() {
  const incomeTypeEl = document.getElementById("incomeType");
  const incomeAmountEl = document.getElementById("incomeAmount");
  const deductionsEl = document.getElementById("deductions");
  const resultEl = document.getElementById("pitResult");

  if (!incomeTypeEl || !incomeAmountEl || !resultEl) {
    alert("PIT elements not found in HTML");
    return;
  }

  const incomeType = incomeTypeEl.value;
  const incomeAmount = Number(incomeAmountEl.value);
  const deductions = Number(deductionsEl.value) || 0;

  if (incomeAmount <= 0) {
    alert("Enter a valid income amount");
    return;
  }

  const annualIncome =
    incomeType === "monthly" ? incomeAmount * 12 : incomeAmount;

  const taxableIncome = annualIncome - deductions;

  if (taxableIncome <= EXEMPT_LIMIT) {
    resultEl.innerHTML =
      "<p><b>Annual Income:</b> ₦" + annualIncome.toLocaleString() + "</p>" +
      "<p><b>Status:</b> <span style='color:green'>EXEMPT</span></p>" +
      "<p>This income is fully exempt under the new tax reform.</p>";
    return;
  }

  const excess = taxableIncome - EXEMPT_LIMIT;
  const annualTax = computeTax(excess);
  const monthlyTax = annualTax / 12;

  resultEl.innerHTML =
    "<p><b>Annual Income:</b> ₦" + annualIncome.toLocaleString() + "</p>" +
    "<p><b>Deductions:</b> ₦" + deductions.toLocaleString() + "</p>" +
    "<p><b>Taxable Income:</b> ₦" + taxableIncome.toLocaleString() + "</p>" +
    "<hr>" +
    "<p><b>Annual PIT:</b> ₦" + annualTax.toLocaleString() + "</p>" +
    "<p><b>Monthly PIT:</b> ₦" + monthlyTax.toLocaleString() + "</p>";
}
