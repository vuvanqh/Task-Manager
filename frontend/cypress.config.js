import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    devServer: {
      framework: "react",
      bundler: "webpack",
    },
    specPattern: "src/cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
  },
  e2e: {
    baseUrl: "http://localhost:5173",
    specPattern: [
      "src/cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",  
      "src/cypress/e2e/**/*.cy.{js,jsx,ts,tsx}" 
    ],
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
