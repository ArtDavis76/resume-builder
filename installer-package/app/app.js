const storageKey = "resume-builder-v1";

const sampleData = {
  name: "Your Name",
  targetRole: "Customer Success Specialist",
  phone: "",
  email: "",
  location: "",
  link: "",
  summary:
    "Reliable, people-centered professional with experience coordinating daily tasks, communicating clearly, and helping customers or team members solve problems. Known for staying organized, learning quickly, and following through with care.",
  skills: "Customer service, scheduling, communication, organization, problem solving, Microsoft Office, data entry",
  keywords: "customer service, communication, scheduling, problem solving, Microsoft Office",
  highlights: "Bilingual communication\nTrusted with sensitive information\nStrong attendance and follow-through",
  experience: [
    {
      role: "Customer Support Associate",
      company: "Company Name",
      location: "City, ST",
      dates: "2024 - Present",
      bullets:
        "Help customers resolve questions with calm, clear communication\nTrack requests and follow up to make sure tasks are completed\nMaintain organized records and support daily team operations"
    }
  ],
  education: [
    {
      school: "School or Program Name",
      credential: "Certificate or Degree",
      location: "City, ST",
      dates: "2026"
    }
  ],
  density: "comfortable"
};

let state = loadState();

const form = document.querySelector("#resumeForm");
const preview = document.querySelector("#resumePreview");
const experienceList = document.querySelector("#experienceList");
const educationList = document.querySelector("#educationList");
const keywordResults = document.querySelector("#keywordResults");
const formatResults = document.querySelector("#formatResults");

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    return saved ? { ...sampleData, ...saved } : structuredClone(sampleData);
  } catch {
    return structuredClone(sampleData);
  }
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function splitLines(value = "") {
  return value
    .split(/\n|;/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitKeywords(value = "") {
  return value
    .split(/,|\n/)
    .map((item) => item.trim())
    .filter((item) => item.length > 2)
    .slice(0, 18);
}

function fillStaticFields() {
  new FormData(form).forEach((_, key) => {
    const field = form.elements[key];
    if (field && key in state) {
      field.value = state[key] || "";
    }
  });
}

function updateFromStaticFields() {
  const data = new FormData(form);
  ["name", "targetRole", "phone", "email", "location", "link", "summary", "skills", "keywords", "highlights"].forEach((key) => {
    state[key] = data.get(key) || "";
  });
}

function createTextInput(label, value, onInput, placeholder = "") {
  const wrapper = document.createElement("label");
  wrapper.textContent = label;
  const input = document.createElement("input");
  input.value = value || "";
  input.placeholder = placeholder;
  input.addEventListener("input", () => onInput(input.value));
  wrapper.append(input);
  return wrapper;
}

function createTextarea(label, value, onInput, placeholder = "") {
  const wrapper = document.createElement("label");
  wrapper.textContent = label;
  const textarea = document.createElement("textarea");
  textarea.rows = 5;
  textarea.value = value || "";
  textarea.placeholder = placeholder;
  textarea.addEventListener("input", () => onInput(textarea.value));
  wrapper.append(textarea);
  return wrapper;
}

function renderDynamicLists() {
  experienceList.innerHTML = "";
  state.experience.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "entry-card";
    card.innerHTML = `
      <div class="card-header">
        <p class="card-title">Role ${index + 1}</p>
        <button class="remove-button" type="button" title="Remove role" aria-label="Remove role">
          <i data-lucide="trash-2" aria-hidden="true"></i>
        </button>
      </div>
    `;
    card.querySelector("button").addEventListener("click", () => {
      state.experience.splice(index, 1);
      commit();
    });

    const grid = document.createElement("div");
    grid.className = "field-grid two";
    grid.append(
      createTextInput("Job title", item.role, (value) => updateEntry("experience", index, "role", value), "Server, caregiver, assistant"),
      createTextInput("Company", item.company, (value) => updateEntry("experience", index, "company", value), "Company or organization"),
      createTextInput("Location", item.location, (value) => updateEntry("experience", index, "location", value), "City, ST"),
      createTextInput("Dates", item.dates, (value) => updateEntry("experience", index, "dates", value), "2023 - Present")
    );
    card.append(grid);
    card.append(
      createTextarea(
        "Achievement bullets",
        item.bullets,
        (value) => updateEntry("experience", index, "bullets", value),
        "Start with action verbs. Add numbers, tools, customers, or outcomes when possible. One bullet per line."
      )
    );
    experienceList.append(card);
  });

  educationList.innerHTML = "";
  state.education.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "entry-card";
    card.innerHTML = `
      <div class="card-header">
        <p class="card-title">Education ${index + 1}</p>
        <button class="remove-button" type="button" title="Remove education" aria-label="Remove education">
          <i data-lucide="trash-2" aria-hidden="true"></i>
        </button>
      </div>
    `;
    card.querySelector("button").addEventListener("click", () => {
      state.education.splice(index, 1);
      commit();
    });

    const grid = document.createElement("div");
    grid.className = "field-grid two";
    grid.append(
      createTextInput("School or program", item.school, (value) => updateEntry("education", index, "school", value), "School name"),
      createTextInput("Credential", item.credential, (value) => updateEntry("education", index, "credential", value), "Diploma, certificate, degree"),
      createTextInput("Location", item.location, (value) => updateEntry("education", index, "location", value), "City, ST"),
      createTextInput("Dates", item.dates, (value) => updateEntry("education", index, "dates", value), "Expected 2026")
    );
    card.append(grid);
    educationList.append(card);
  });

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function updateEntry(collection, index, key, value) {
  state[collection][index][key] = value;
  commit(false);
}

function renderPreview() {
  const contacts = [state.phone, state.email, state.location, state.link].filter(Boolean);
  const experience = state.experience.filter((item) => item.role || item.company || item.bullets);
  const education = state.education.filter((item) => item.school || item.credential);
  const skills = splitKeywords(state.skills);
  const highlights = splitLines(state.highlights);

  preview.className = `resume-page ${state.density}`;
  preview.innerHTML = `
    <header class="resume-head">
      <h2 class="resume-name">${escapeHtml(state.name || "Your Name")}</h2>
      <p class="resume-role">${escapeHtml(state.targetRole || "Target Role")}</p>
      <div class="contact-line">${contacts.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>
    </header>
    ${renderSection("Professional Summary", state.summary ? `<p>${escapeHtml(state.summary)}</p>` : `<p class="empty-note">Add a concise professional summary.</p>`)}
    ${renderSection("Core Skills", skills.length ? `<p class="skills-line">${skills.map(escapeHtml).join(" | ")}</p>` : `<p class="empty-note">Add core skills.</p>`)}
    ${renderSection(
      "Professional Experience",
      experience.length
        ? experience
            .map(
              (item) => `
          <div class="resume-item">
            <div class="resume-line">
              <span>${escapeHtml(item.role || "Role")}${item.company ? `, ${escapeHtml(item.company)}` : ""}</span>
              <span>${escapeHtml(item.dates || "")}</span>
            </div>
            <div class="resume-subline">${escapeHtml(item.location || "")}</div>
            ${renderBullets(item.bullets)}
          </div>
        `
            )
            .join("")
        : `<p class="empty-note">Add recent roles or responsibility areas.</p>`
    )}
    ${renderSection(
      "Education",
      education.length
        ? education
            .map(
              (item) => `
          <div class="resume-item">
            <div class="resume-line">
              <span>${escapeHtml(item.credential || "Credential")}</span>
              <span>${escapeHtml(item.dates || "")}</span>
            </div>
            <div class="resume-subline">${escapeHtml([item.school, item.location].filter(Boolean).join(" | "))}</div>
          </div>
        `
            )
            .join("")
        : `<p class="empty-note">Add education, training, or certifications.</p>`
    )}
    ${highlights.length ? renderSection("Additional Highlights", `<ul>${highlights.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`) : ""}
  `;
}

function renderSection(title, content) {
  return `<section class="resume-section"><h3>${escapeHtml(title)}</h3>${content}</section>`;
}

function renderBullets(value) {
  const bullets = splitLines(value);
  if (!bullets.length) {
    return "";
  }
  return `<ul>${bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function renderKeywordCheck() {
  const resumeText = [
    state.summary,
    state.skills,
    state.highlights,
    ...state.experience.map((item) => Object.values(item).join(" ")),
    ...state.education.map((item) => Object.values(item).join(" "))
  ]
    .join(" ")
    .toLowerCase();
  const keywords = splitKeywords(state.keywords);

  keywordResults.innerHTML =
    keywords.length === 0
      ? `<span class="keyword-chip">Paste keywords to compare them with the resume.</span>`
      : keywords
          .map((keyword) => {
            const present = resumeText.includes(keyword.toLowerCase());
            return `<span class="keyword-chip ${present ? "present" : "missing"}">${escapeHtml(keyword)} ${present ? "included" : "missing"}</span>`;
          })
          .join("");
}

function renderFormatCheck() {
  if (!formatResults) {
    return;
  }
  const checks = [
    { label: "Target role", ok: Boolean(state.targetRole.trim()) },
    { label: "Contact info", ok: Boolean(state.phone.trim() && state.email.trim()) },
    { label: "Short summary", ok: state.summary.trim().length >= 80 && state.summary.trim().length <= 420 },
    { label: "Core skills", ok: splitKeywords(state.skills).length >= 6 },
    { label: "Experience bullets", ok: state.experience.some((item) => splitLines(item.bullets).length >= 2) },
    { label: "Keyword targeting", ok: splitKeywords(state.keywords).length >= 4 }
  ];

  formatResults.innerHTML = checks
    .map((check) => `<span class="format-chip ${check.ok ? "good" : "warn"}">${escapeHtml(check.label)} ${check.ok ? "ready" : "needs work"}</span>`)
    .join("");
}

function commit(rerenderLists = true) {
  updateFromStaticFields();
  saveState();
  if (rerenderLists) {
    renderDynamicLists();
  }
  renderPreview();
  renderKeywordCheck();
  renderFormatCheck();
}

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((item) => item.classList.toggle("active", item === tab));
    document.querySelectorAll(".form-section").forEach((panel) => {
      panel.classList.toggle("active", panel.dataset.panel === tab.dataset.section);
    });
  });
});

document.querySelectorAll("[data-add]").forEach((button) => {
  button.addEventListener("click", () => {
    const collection = button.dataset.add;
    state[collection].push(
      collection === "experience"
        ? { role: "", company: "", location: "", dates: "", bullets: "" }
        : { school: "", credential: "", location: "", dates: "" }
    );
    commit();
  });
});

document.querySelectorAll(".density").forEach((button) => {
  button.addEventListener("click", () => {
    state.density = button.dataset.density;
    document.querySelectorAll(".density").forEach((item) => item.classList.toggle("active", item === button));
    commit(false);
  });
});

form.addEventListener("input", () => commit(false));

document.querySelector("#printResume").addEventListener("click", () => window.print());

document.querySelector("#saveJson").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "resume-builder-backup.json";
  link.click();
  URL.revokeObjectURL(url);
});

document.querySelector("#importJson").addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) {
    return;
  }
  try {
    const imported = JSON.parse(await file.text());
    state = { ...sampleData, ...imported };
    fillStaticFields();
    document.querySelectorAll(".density").forEach((item) => item.classList.toggle("active", item.dataset.density === state.density));
    commit();
  } catch {
    alert("That backup file could not be imported.");
  } finally {
    event.target.value = "";
  }
});

document.querySelector("#resetDemo").addEventListener("click", () => {
  const confirmed = confirm("Reset the resume builder to the starter version?");
  if (!confirmed) {
    return;
  }
  state = structuredClone(sampleData);
  fillStaticFields();
  document.querySelectorAll(".density").forEach((item) => item.classList.toggle("active", item.dataset.density === state.density));
  commit();
});

fillStaticFields();
document.querySelectorAll(".density").forEach((item) => item.classList.toggle("active", item.dataset.density === state.density));
renderDynamicLists();
renderPreview();
renderKeywordCheck();
renderFormatCheck();

window.addEventListener("load", () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }
});
