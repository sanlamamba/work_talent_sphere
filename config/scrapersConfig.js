const Bottleneck = require("bottleneck");

const targetSubreddits = [
  "forhire",
  "remotejs",
  "designjobs",
  "hiring",
  "jobbit",
  "freelance",
  "remotework",
];

const jobTypes = {
  design: [
    "design",
    "ui/ux",
    "graphic",
    "illustration",
    "figma",
    "photoshop",
    "framer",
    "logo",
    "print",
    "branding",
    "typography",
    "typographic",
    "typographer",
    "typographic designer",
    "typography designer",
    "designer",
    "ui",
    "ux",
    "user interface",
    "user experience",
    "web design",
    "web designer",
    "graphic design",
    "graphic designer",
  ],
  dev: [
    "development",
    "programmer",
    "developer",
    "coding",
    "javascript",
    "python",
    "backend",
    "frontend",
    "front",
    "back",
    "fullstack",
    "full-stack",
    "full stack",
    "web",
    "mobile",
    "app",
    "software",
    "engineer",
    "wordpress",
    "shopify",
    "react",
    "angular",
    "vue",
    "node",
    "php",
    "laravel",
    "symfony",
    "django",
    "flask",
    "express",
    "ruby",
    "rails",
    "java",
    "kotlin",
    "swift",
    "ios",
    "android",
    "typescript",
    "rust",
    "elixir",
    "golang",
    "c",
    "c++",
    "c#",
    "html",
    "css",
    "sass",
    "less",
    "bootstrap",
    "tailwind",
    "bulma",
    "materialize",
    "material-ui",
    "ant-design",
    "chakra-ui",
    "styled-components",
    "redux",
    "mobx",
    "graphql",
    "rest",
    "api",
    "AI",
    "machine learning",
    "ai",
    "data science",
    "big data",
    "data analyst",
    "data engineer",
    "data visualization",
    "data warehousing",
    "data mining",
    "data modeling",
    "data integration",
    "data migration",
    "data quality",
    "data governance",
    "data architecture",
    "data analytics",
    "data management",
    "sql",
    "nosql",
    "database",
    "database management",
  ],
  marketing: [
    "marketing",
    "seo",
    "advertising",
    "social media",
    "branding",
    "content",
    "copywriting",
    "cold email",
    "email marketing",
    "growth hacking",
    "influencer marketing",
    "lead generation",
    "link building",
    "marketing automation",
    "ppc",
    "pr",
    "product marketing",
    "public relations",
    "sem",
    "smm",
    "social media marketing",
    "video marketing",
    "web analytics",
    "content marketing",
    "digital marketing",
    "affiliate marketing",
    "google analytics",
    "google ads",
    "facebook ads",
    "instagram marketing",
    "linkedin marketing",
    "pinterest marketing",
    "quora marketing",
    "reddit marketing",
    "snapchat marketing",
    "tiktok marketing",
    "twitter marketing",
  ],
  nsfw: ["nsfw", "adult", "18+", "explicit", "nude"],
};

const supportedCurrencies = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  CAD: "CAD",
  AUD: "AUD",
  INR: "₹",
  JPY: "¥",
  CHF: "CHF",
};

const priceRegex = new RegExp(
  `(?:\\b(${Object.keys(supportedCurrencies).join("|")})\\b|(${Object.values(
    supportedCurrencies
  ).join("|")}))\\s?(\\d{1,3}(?:[.,]\\d{3})*(?:[.,]\\d+)?)(?!\\w)`,
  "gi"
);

const limiter = new Bottleneck({
  minTime: 500,
  maxConcurrent: 3,
});

const JOB_TYPE_COLORS = {
  design: "#FF5733",
  development: "#33A1FF",
  marketing: "#33FF99",
  nsfw: "#FF3333",
  default: "#4caf50",
};

const boards = ["biz", "g", "ic", "gd"];

module.exports = {
  name: "scrapersConfig",
  description: "Configurations for scrapers",
  targetSubreddits: targetSubreddits,
  jobTypes: jobTypes,
  supportedCurrencies: supportedCurrencies,
  priceRegex: priceRegex,
  limiter: limiter,
  boards: boards,
  colors: JOB_TYPE_COLORS,
};
