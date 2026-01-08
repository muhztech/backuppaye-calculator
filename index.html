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

// ================= PAYE CALCULATOR =================

function calculatePAYE() {
  const monthlySalary = Number(
    document.getElementById("monthlySalary").value
  );

  if (!monthlySalary || monthlySalary <= 0) {
    alert("Enter a valid monthly salary");
    return;
  }

  const annualIncome = monthlySalary * 12;

  if (annualIncome <= EXEMPT_LIMIT) {
    document.getElementById("payeResult").innerHTML = `
      <p><b>Annual Income:</b> ₦${annualIncome.toLocaleString()}</p>
      <p><b>Status:</b> <span style="color:green">EXEMPT</span></p>
      <p>No PAYE payable under the new tax law.</p>
    `;
    return;
  }

  const taxableIncome = annualIncome - EXEMPT_LIMIT;
  const annualTax = computeTax(taxableIncome);
  const monthlyTax = annualTax / 12;

  document.getElementById("payeResult").innerHTML = `
    <p><b>Annual Income:</b> ₦${annualIncome.toLocaleString()}</p>
    <p><b>Taxable Income:</b> ₦${taxableIncome.toLocaleString()}</p>
    <hr>
    <p><b>Annual PAYE:</b> ₦${annualTax.toLocaleString()}</p>
    <p><b>Monthly PAYE:</b> ₦${monthlyTax.toLocaleString()}</p>
  `;
}

// ================= PIT CALCULATOR =================

function calculatePIT() {
  const incomeType = document.getElementById("incomeType").value;
  const incomeAmount = Number(
    document.getElementById("incomeAmount").value
  );
  const deductions =
    Number(document.getElementById("deductions").value) || 0;

  if (!incomeAmount || incomeAmount <= 0) {
    alert("Enter a valid income amount");
    return;
  }

  const annualIncome =
    incomeType === "monthly" ? incomeAmount * 12 : incomeAmount;

  const taxableIncome = annualIncome - deductions;

  if (taxableIncome <= EXEMPT_LIMIT) {
    document.getElementById("pitResult").innerHTML = `
      <p><b>Annual Income:</b> ₦${annualIncome.toLocaleString()}</p>
      <p><b>Status:</b> <span style="color:green">EXEMPT</span></p>
      <p>This income is fully exempt under the new tax reform.</p>
    `;
    return;
  }

  const excess = taxableIncome - EXEMPT_LIMIT;
  const annualTax = computeTax(excess);
  const monthlyTax = annualTax / 12;

  document.getElementById("pitResult").innerHTML = `
    <p><b>Annual Income:</b> ₦${annualIncome.toLocaleString()}</p>
    <p><b>Deductions:</b> ₦${deductions.toLocaleString()}</p>
    <p><b>Taxable Income:</b> ₦${taxableIncome.toLocaleString()}</p>
    <hr>
    <p><b>Annual PIT:</b> ₦${annualTax.toLocaleString()}</p>
    <p><b>Monthly PIT:</b> ₦${monthlyTax.toLocaleString()}</p>
  `;
}
