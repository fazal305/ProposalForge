/**
 * Seed values for the developer's own profile — used to prefill Settings on first run
 * and as the {{developer.*}} variable source until edited in-app.
 * Editable at any time from /settings; nothing here is hardcoded into the renderer.
 */
export const DEFAULT_DEVELOPER_PROFILE = {
  name: 'Fazal Abbas',
  businessName: null,
  title: 'Full-Stack Software Developer',
  email: 'fazalabbas2002@gmail.com',
  phone: '+92 370 1274689',
  location: 'Karachi, Pakistan',
  portfolioUrl: 'https://fazal.is-a.dev/',
  githubUrl: 'https://github.com/fazal305',
  linkedinUrl: 'https://pk.linkedin.com/in/fazal-abbas-4653dg86',
  bio: '[YOUR BIO — a few sentences about your experience, focus areas, and what makes you the right developer for this project.]',
  skills: ['[YOUR SKILL 1]', '[YOUR SKILL 2]', '[YOUR SKILL 3]'],
  experience: '[YOUR YEARS OF EXPERIENCE / BACKGROUND SUMMARY]',
  currency: 'USD',
  hourlyRate: 20,
  defaultPricingMode: 'HOURLY',
}
