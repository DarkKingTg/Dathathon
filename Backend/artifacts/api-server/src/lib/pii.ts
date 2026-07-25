const aadhaarRegex = /\b\d{4}\s?\d{4}\s?\d{4}\b/g;
const panRegex = /\b[A-Z]{5}[0-9]{4}[A-Z]\b/g;
const phoneRegex = /(?:\+91[-\s]?)?\d{10}\b/g;
const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const addressRegex = /\b\d+\s+(?:street|road|lane|avenue|block|sector)\b[\w\s,]*/gi;

export const redactPII = (text: string): string =>
  text
    .replace(aadhaarRegex, "[REDACTED_AADHAAR]")
    .replace(panRegex, "[REDACTED_PAN]")
    .replace(phoneRegex, "[REDACTED_PHONE]")
    .replace(emailRegex, "[REDACTED_EMAIL]")
    .replace(addressRegex, "[REDACTED_ADDRESS]");

export const anonymizeText = (text: string): string => {
  const namePattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\b/g;
  return text.replace(namePattern, "[REDACTED_NAME]");
};
