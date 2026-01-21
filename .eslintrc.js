module.exports = {
  root: true,
  extends: ["expo", "prettier"],
  rules: {
    semi: ["error", "never"],
    quotes: ["error", "single", { avoidEscape: true }],
  },
};
