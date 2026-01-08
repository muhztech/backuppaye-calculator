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
      <p><strong>Annual Income:</strong> ₦${annualIncome.toLocaleString()}</p>
      <p><strong>Status:</strong> <span style="color:green;">EXEMPT</span></p>
      <hr>
      <p>No PAYE payable under the new tax law.</p>
    `;
    return;
  }

  const taxableIncome = annualIncome - EXEMPT_LIMIT;
  const annualTax = computeTax(taxableIncome);
  const monthlyTax = annualTax / 12;

  document.getElementById("payeResult").innerHTML = `
    <p><strong>Annual Income:</strong> ₦${annualIncome.toLocaleString()}</p>
    <p><strong>Taxable Income:</strong> ₦${taxableIncome.toLocaleString()}</p>
    <hr>
    <p><strong>Annual PAYE:</strong> ₦${annualTax.toLocaleString()}</p>
    <p><strong>Monthly PAYE:</strong> ₦${monthlyTax.toLocaleString()}</p>
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
    incomeType === "monthly"
      ? incomeAmount * 12
      : incomeAmount;

  const taxableIncome = annualIncome - deductions;

  if (taxableIncome <= EXEMPT_LIMIT) {
    document.getElementById("pitResult").innerHTML = `
      <p><strong>Annual Income:</strong> ₦${annualIncome.toLocaleString()}</p>
      <p><strong>Status:</strong> <span style="color:green;">EXEMPT</span></p>
      <hr>
      <p>This income is fully exempt under the new tax reform.</p>
    `;
    return;
  }

  const excess = taxableIncome - EXEMPT_LIMIT;
  const annualTax = computeTax(excess);
  const monthlyTax = annualTax / 12;

  document.getElementById("pitResult").innerHTML = `
    <p><strong>Annual Income:</strong> ₦${annualIncome.toLocaleString()}</p>
    <p><strong>Deductions:</strong> ₦${deductions.toLocaleString()}</p>
    <p><strong>Taxable Income:</strong> ₦${taxableIncome.toLocaleString()}</p>
    <hr>
    <p><strong>Annual PIT:</strong> ₦${annualTax.toLocaleString()}</p>
    <p><strong>Monthly PIT:</strong> ₦${monthlyTax.toLocaleString()}</p>
  `;
}
