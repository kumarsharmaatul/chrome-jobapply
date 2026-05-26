(() => {
  const synonyms = {
    fullName: ["full name", "name", "candidate name", "first name", "last name", "given name", "family name"],
    email: ["email", "email address", "e-mail"],
    phone: ["phone", "mobile", "mobile number", "contact number", "telephone", "cell phone"],
    address: ["address", "current location", "city", "state", "postal code", "zip code", "country", "street"],
    linkedIn: ["linkedin", "linkedin profile", "linkedin url"],
    github: ["github", "github profile", "github url"],
    portfolio: ["portfolio", "website", "personal site", "portfolio url", "personal url"],
    expectedSalary: ["salary", "ctc", "expected ctc", "current ctc", "compensation", "remuneration"],
    noticePeriod: ["notice", "notice period", "joining", "availability", "how soon"],
    experience: ["experience", "years of experience", "total experience", "work history"],
    skills: ["skills", "key skills", "tech stack", "competencies", "expertise"],
    preferredLocation: ["preferred location", "location preference", "desired location", "relocate"],
    education: ["education", "qualification", "degree", "university", "college", "school"],
    currentCompany: ["current company", "present company", "employer"],
    jobTitles: ["job title", "designation", "role", "position"],
    certifications: ["certification", "license", "certified"],
    coverLetterTemplate: ["cover letter", "motivation", "why are you a fit", "personal statement"]
  };

  function getLabelText(el) {
    const forLabel = el.id ? document.querySelector(`label[for="${CSS.escape(el.id)}"]`) : null;
    return [el.labels?.[0]?.innerText, forLabel?.innerText].filter(Boolean).join(" ");
  }

  function describeField(el) {
    return [el.name, el.id, el.placeholder, el.getAttribute("aria-label"), getLabelText(el)]
      .filter(Boolean)
      .join(" | ")
      .slice(0, 120);
  }

  function getDescriptor(el) {
    const nearby = el.closest("div, section, form, .form-group, .field-wrapper")?.innerText?.slice(0, 250) || "";
    return [describeField(el), nearby].filter(Boolean).join(" ").toLowerCase();
  }

  function matchProfileKey(el) {
    const descriptor = getDescriptor(el);
    let winner = null;
    let score = 0;

    Object.entries(synonyms).forEach(([key, words]) => {
      const current = words.reduce((acc, phrase) => acc + (descriptor.includes(phrase) ? phrase.length : 0), 0);
      if (current > score) {
        winner = key;
        score = current;
      }
    });

    return { key: winner, score };
  }

  window.AIAFMatcher = { matchProfileKey, describeField };
})();
