export const isValidEmail = (email) => {
  return /\S+@\S+\.\S+/.test(email);
};
export const isValidPassword = (password) => {
  return password.length >= 6;
};
export const isValidName = (name) => {
  return name.length >= 3;
};

export const isValidLanguage = (lang) => {
  const languages = ["cpp", "java", "python", "javascript", "c", "rust", "go", "csharp"]
  return languages.includes(lang)
}

export const isValidDifficulty = (difficulty) => {
  const difficulties = ["EASY", "MEDIUM", "HARD"]
  return difficulties.includes(difficulty)
}

export const isValidPlatform = (platform) => {
  const platforms = ["LEETCODE", "CSES", "CODEFORCES", "CODECHEF"]
  return platforms.includes(platform)
}

export const validateRequiredFields = (field, body) => {
  const missing = []
  for (const f of field) {
    if (body[f] == undefined || body[f] == null || (typeof body[f] === "string" && body[f].trim() === "")) {
      missing.push(f)
    }
  }
  return missing
}