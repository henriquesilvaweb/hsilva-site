const WHATSAPP_NUMBER = "5522999230493";

const form = document.querySelector("#briefing-form");
const steps = [...document.querySelectorAll(".form-step")];
const previousButton = document.querySelector("#prev-button");
const nextButton = document.querySelector("#next-button");
const submitButton = document.querySelector("#submit-button");
const clearButton = document.querySelector("#clear-button");
const formMessage = document.querySelector("#form-message");
const currentStepNumber = document.querySelector("#current-step-number");
const totalSteps = document.querySelector("#total-steps");
const progressTitle = document.querySelector("#progress-title");
const progressFill = document.querySelector("#progress-fill");
const progressBar = document.querySelector("[role='progressbar']");
const domainField = document.querySelector("#domain-field");
const domainInput = document.querySelector("#domain");

let currentStep = 0;

const sectionMap = [
  {
    title: "EMPRESA",
    fields: ["company", "responsible", "phone", "email", "address", "instagram", "socials"]
  },
  {
    title: "SOBRE A EMPRESA",
    fields: ["history", "companyAge", "mainServices", "serviceArea", "teamSize"]
  },
  {
    title: "PÚBLICO",
    fields: ["audience", "idealClient"]
  },
  {
    title: "OBJETIVO DO SITE",
    fields: ["siteGoals", "mainGoal"]
  },
  {
    title: "SERVIÇOS E CONTEÚDO",
    fields: ["websiteServices", "commonQuestions", "siteQuestions", "oneOffService", "legalInfo"]
  },
  {
    title: "POSICIONAMENTO",
    fields: ["qualities", "threeQualities"]
  },
  {
    title: "DIFERENCIAIS",
    fields: ["whyChoose", "advantages", "specialExperience"]
  },
  {
    title: "IDENTIDADE VISUAL",
    fields: ["brandAssets", "assetSharing"]
  },
  {
    title: "PREFERÊNCIAS VISUAIS",
    fields: ["colorsUse", "colorsAvoid", "sitesLike", "whatLike", "sitesDislike", "whatAvoid"]
  },
  {
    title: "ESTRUTURA DO SITE",
    fields: ["pages"]
  },
  {
    title: "FOTOS",
    fields: ["photos"]
  },
  {
    title: "CONTATO PRINCIPAL",
    fields: ["mainContact"]
  },
  {
    title: "DOMÍNIO E HOSPEDAGEM",
    fields: ["hasDomain", "domain", "hasHosting"]
  },
  {
    title: "PRAZO E APROVAÇÃO",
    fields: ["launchDate", "approver", "otherApprovers"]
  },
  {
    title: "OBSERVAÇÕES",
    fields: ["notes"]
  }
];

function showMessage(message) {
  formMessage.textContent = message;
  formMessage.classList.add("visible");
  formMessage.focus();
}

function clearMessage() {
  formMessage.textContent = "";
  formMessage.classList.remove("visible");
}

function updateStep(shouldScroll = true) {
  steps.forEach((step, index) => {
    step.classList.toggle("active", index === currentStep);
    step.setAttribute("aria-hidden", index === currentStep ? "false" : "true");
  });

  const stepPosition = currentStep + 1;
  const progress = (stepPosition / steps.length) * 100;

  currentStepNumber.textContent = stepPosition;
  totalSteps.textContent = steps.length;
  progressTitle.textContent = steps[currentStep].dataset.stepTitle;
  progressFill.style.width = `${progress}%`;
  progressBar.setAttribute("aria-valuemax", steps.length);
  progressBar.setAttribute("aria-valuenow", stepPosition);

  previousButton.style.visibility = currentStep === 0 ? "hidden" : "visible";
  nextButton.style.display = currentStep === steps.length - 1 ? "none" : "inline-flex";
  submitButton.style.display = currentStep === steps.length - 1 ? "inline-flex" : "none";

  clearMessage();
  if (shouldScroll) {
    document.querySelector(".form-section").scrollIntoView({ behavior: "smooth", block: "start" });
  }
  steps[currentStep].querySelector("legend").focus?.();
}

function validateCurrentStep() {
  const step = steps[currentStep];
  const requiredFields = [...step.querySelectorAll("[required]")];
  const requiredGroups = [...step.querySelectorAll("[data-required-group]")];
  let firstInvalid = null;

  step.querySelectorAll(".invalid").forEach((element) => element.classList.remove("invalid"));

  requiredFields.forEach((field) => {
    if ((field.type === "radio" || field.type === "checkbox") && field.name) {
      return;
    }

    if (!field.checkValidity()) {
      field.classList.add("invalid");
      firstInvalid ??= field;
    }
  });

  requiredGroups.forEach((group) => {
    const isChecked = group.querySelector("input:checked");
    if (!isChecked) {
      group.classList.add("invalid");
      firstInvalid ??= group.querySelector("input");
    }
  });

  const requiredRadioNames = [...new Set(
    requiredFields.filter((field) => field.type === "radio").map((field) => field.name)
  )];

  requiredRadioNames.forEach((name) => {
    if (!step.querySelector(`[name="${name}"]:checked`)) {
      const radio = step.querySelector(`[name="${name}"]`);
      radio.closest(".choice-grid")?.classList.add("invalid");
      firstInvalid ??= radio;
    }
  });

  if (firstInvalid) {
    showMessage("Revise os campos obrigatórios destacados antes de avançar.");
    firstInvalid.focus();
    return false;
  }

  clearMessage();
  return true;
}

function getFieldLabel(fieldName) {
  const field = form.elements[fieldName];
  const element = field instanceof RadioNodeList ? field[0] : field;
  return element?.dataset.label
    || element?.closest(".field")?.querySelector("label, .field-label")?.textContent.replace("*", "").trim()
    || fieldName;
}

function getFieldValue(fieldName) {
  const fields = [...form.querySelectorAll(`[name="${fieldName}"]`)];
  if (!fields.length) return "";

  const firstField = fields[0];
  if (firstField.type === "checkbox") {
    return fields.filter((field) => field.checked).map((field) => field.value).join(", ");
  }

  if (firstField.type === "radio") {
    return fields.find((field) => field.checked)?.value || "";
  }

  return firstField.value.trim();
}

function buildMessage() {
  const sections = sectionMap.map((section) => {
    const answers = section.fields
      .map((fieldName) => {
        const value = getFieldValue(fieldName);
        if (!value) return null;
        return `${getFieldLabel(fieldName)}: ${value}`;
      })
      .filter(Boolean);

    return answers.length ? `*${section.title}*\n${answers.join("\n")}` : null;
  }).filter(Boolean);

  return `*BRIEFING — NOVO PROJETO*\n\n${sections.join("\n\n")}`;
}

nextButton.addEventListener("click", () => {
  if (!validateCurrentStep()) return;
  currentStep += 1;
  updateStep();
});

previousButton.addEventListener("click", () => {
  currentStep = Math.max(0, currentStep - 1);
  updateStep();
});

form.addEventListener("input", (event) => {
  event.target.classList.remove("invalid");
  event.target.closest(".choice-grid")?.classList.remove("invalid");
  clearMessage();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!validateCurrentStep()) return;

  const message = buildMessage();
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
});

clearButton.addEventListener("click", () => {
  const shouldClear = window.confirm("Deseja apagar todas as respostas do briefing?");
  if (!shouldClear) return;

  form.reset();
  domainField.hidden = true;
  domainInput.required = false;
  currentStep = 0;
  updateStep();
  document.querySelector("#company").focus();
});

form.querySelectorAll("[name='hasDomain']").forEach((radio) => {
  radio.addEventListener("change", () => {
    const hasDomain = form.querySelector("[name='hasDomain']:checked")?.value === "Sim";
    domainField.hidden = !hasDomain;
    domainInput.required = hasDomain;
    if (!hasDomain) domainInput.value = "";
  });
});

updateStep(false);
