<script>
  let selectedFile = null;
  const previewContainer = document.getElementById('previewContainer');

  function showPreview(file){
    const reader = new FileReader();
    reader.onload = e => {
      previewContainer.innerHTML =
        `<img src="${e.target.result}" alt="Payslip Preview">`;
    };
    reader.readAsDataURL(file);
  }

  document.getElementById('cameraInput').addEventListener('change', e => {
    if(e.target.files.length){
      selectedFile = e.target.files[0];
      showPreview(selectedFile);
    }
  });

  document.getElementById('galleryInput').addEventListener('change', e => {
    if(e.target.files.length){
      selectedFile = e.target.files[0];
      showPreview(selectedFile);
    }
  });

  function processSelectedFile(){
    if(!selectedFile){
      alert("Please take a photo or upload a payslip first!");
      return;
    }
    processPayslip(selectedFile);
  }

  // ================= OCR PROCESS =================

  function processPayslip(file){
    document.getElementById("loading").innerText =
      "Reading payslip… please wait";

    Tesseract.recognize(file, 'eng', {
      logger: m => console.log(m)
    })
    .then(({ data: { text } }) => {
      document.getElementById("loading").innerText = "";
      const cleanText = normalizeText(text);
      console.log("OCR TEXT:", cleanText);

      let gross =
        extractAmount(cleanText, GROSS_KEYWORDS) ||
        sumComponents(cleanText);

      let pension = extractAmount(cleanText, PENSION_KEYWORDS) || 0;
      let currentPAYE =
        extractAmount(cleanText, PAYE_KEYWORDS) || 0;

      if(!gross){
        alert(
          "Could not confidently detect Gross Pay.\n" +
          "Tip: ensure payslip is clear and well-lit."
        );
        return;
      }

      calculateNewPAYE(gross, pension, currentPAYE);
    })
    .catch(err => {
      console.error(err);
      alert("Error reading payslip");
    });
  }

  // ================= TEXT NORMALIZATION =================

  function normalizeText(text){
    return text
      .toUpperCase()
      .replace(/₦/g,"")
      .replace(/\s+/g," ")
      .replace(/,/g,"");
  }

  // ================= KEYWORDS =================

  const GROSS_KEYWORDS = [
    "GROSS PAY",
    "GROSS SALARY",
    "TOTAL EMOLUMENT",
    "TOTAL PAY",
    "TOTAL EARNINGS",
    "GROSS"
  ];

  const PENSION_KEYWORDS = [
    "PENSION",
    "PFA",
    "RETIREMENT"
  ];

  const PAYE_KEYWORDS = [
    "PAYE",
    "PAY AS YOU EARN",
    "TAX"
  ];

  // ================= AMOUNT EXTRACTION =================

  function extractAmount(text, keywords){
    for(let key of keywords){
      const regex = new RegExp(
        key + "[^0-9]{0,20}([0-9]{2,9}(?:\\.\\d{2})?)"
      );
      const match = text.match(regex);
      if(match){
        return Number(match[1]);
      }
    }
    return null;
  }

  // ================= FALLBACK: SUM BASIC + ALLOWANCES =================

  function sumComponents(text){
    let total = 0;
    const components = [
      "BASIC",
      "HOUSING",
      "RENT",
      "TRANSPORT",
      "MEAL",
      "UTILITY",
      "ALLOWANCE"
    ];

    for(let comp of components){
      const regex =
        new RegExp(comp + "[^0-9]{0,20}([0-9]{2,9})","g");
      let match;
      while((match = regex.exec(text)) !== null){
        total += Number(match[1]);
      }
    }
    return total > 0 ? total : null;
  }

  // ================= PAYE CALCULATION =================

  function calculateNewPAYE(monthlyGross, pensionMonthly, currentPAYE){
    const annualIncome = monthlyGross * 12;
    const pensionAnnual = pensionMonthly * 12;
    const taxableIncome = annualIncome - pensionAnnual;

    let tax = 0;

    if(taxableIncome > 800000){
      let remaining = taxableIncome - 800000;
      const bands = [
        { limit: 2200000, rate: 0.15 },
        { limit: 9000000, rate: 0.18 },
        { limit: 13000000, rate: 0.21 },
        { limit: 25000000, rate: 0.23 },
        { limit: Infinity, rate: 0.25 }
      ];

      for(let band of bands){
        if(remaining <= 0) break;
        let amount = Math.min(band.limit, remaining);
        tax += amount * band.rate;
        remaining -= amount;
      }
    }

    const monthlyNewPAYE = tax / 12;
    const difference = currentPAYE - monthlyNewPAYE;

    document.getElementById("result").innerHTML = `
      <p><b>Detected Gross Pay:</b> ₦${monthlyGross.toLocaleString()}</p>
      <p><b>Detected Pension:</b> ₦${pensionMonthly.toLocaleString()}</p>
      <p><b>Current PAYE:</b> ₦${currentPAYE.toLocaleString()}</p>
      <hr>
      <p><b>Correct PAYE (New Law):</b> ₦${monthlyNewPAYE.toLocaleString()}</p>
      <p><b>Difference:</b> ₦${difference.toLocaleString()}</p>
    `;
  }
</script>
