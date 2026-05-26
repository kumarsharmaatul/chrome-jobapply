export async function parseResumeFile(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  const text = await extractText(file, ext);
  return { rawText: text, parsed: parseTextToProfile(text) };
}

async function extractText(file, ext) {
  if (ext === 'txt') return normalize(await file.text());
  if (ext === 'pdf') return normalize(await extractBinaryText(file));
  if (ext === 'docx') return normalize(await extractBinaryText(file));
  throw new Error('Unsupported file type. Use PDF/DOCX/TXT.');
}

async function extractBinaryText(file) {
  const buf = await file.arrayBuffer();
  const decoded = new TextDecoder('latin1').decode(buf);
  return decoded.replace(/<[^>]+>/g, ' ').replace(/[^\x20-\x7E\n]/g, ' ');
}

function normalize(text) {
  return text.replace(/\r/g, '\n').replace(/\n{2,}/g, '\n').trim();
}

function parseTextToProfile(text) {
  const lines = text.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  const profile = {
    fullName: guessName(lines),
    email: firstMatch(text, /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i),
    phone: firstMatch(text, /(\+?\d[\d\s().-]{8,}\d)/),
    address: '',
    linkedIn: firstMatch(text, /https?:\/\/(www\.)?linkedin\.com\/[^\s]+/i),
    github: firstMatch(text, /https?:\/\/(www\.)?github\.com\/[^\s]+/i),
    portfolio: firstMatch(text, /https?:\/\/[^\s]+/i),
    skills: collectSection(lines, /(skills|technologies|competencies)/i),
    education: collectSection(lines, /(education|qualification)/i),
    experience: collectSection(lines, /(experience|employment|work history)/i),
    currentCompany: '',
    jobTitles: '',
    certifications: collectSection(lines, /(certification|license)/i),
    expectedSalary: inferScalar(text, /(expected\s*salary|expected\s*ctc|salary\s*expectation)[:\-]?\s*([^\n]+)/i),
    noticePeriod: inferScalar(text, /(notice\s*period|joining\s*in)[:\-]?\s*([^\n]+)/i),
    preferredLocation: inferScalar(text, /(preferred\s*location|location\s*preference)[:\-]?\s*([^\n]+)/i),
    coverLetterTemplate: ''
  };
  return profile;
}

function guessName(lines) {
  const first = lines[0] || '';
  if (/@|\d/.test(first)) return '';
  return first.slice(0, 80);
}

function inferScalar(text, regex) {
  const m = text.match(regex);
  return (m?.[2] || '').trim();
}

function firstMatch(text, regex) {
  return (text.match(regex) || [''])[0].trim();
}

function collectSection(lines, sectionRegex) {
  const start = lines.findIndex((l) => sectionRegex.test(l));
  if (start < 0) return '';
  return lines.slice(start + 1, start + 8).join('\n');
}
