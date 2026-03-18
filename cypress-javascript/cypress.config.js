const { defineConfig } = require("cypress");

module.exports = defineConfig({
  allowCypressEnv: false,

  e2e: {
    viewportWidth: 1280,
    viewportHeight: 800,

    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});