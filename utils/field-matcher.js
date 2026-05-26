(() => {
  const synonyms = {
    fullName: ["full name", "name", "candidate name", "first name", "last name"],
    email: ["email", "email address"],
    phone: ["phone", "mobile", "mobile number", "contact number", "telephone"],
    address: ["address", "current location", "city", "state"],
    linkedIn: ["linkedin", "linkedin profile"],
    github: ["github", "github profile"],
    portfolio: ["portfolio", "website", "personal site", "portfolio url"],
    expectedSalary: ["salary", "ctc", "expected ctc", "current ctc", "compensation"],
    noticePeriod: ["notice", "notice period", "joining"],
    experience: ["experience", "years of experience", "total experience"],
    skills: ["skills", "key skills", "tech stack", "competencies"],
    preferredLocation: ["preferred location", "location preference", "desired location"],
    coverLetterTemplate: ["cover letter", "motivation", "why are you a fit"]
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
    const nearby = el.closest("div, section, form")?.innerText?.slice(0, 220) || "";
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
