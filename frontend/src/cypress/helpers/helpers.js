Cypress.Commands.add("login", (username, password) => {
    cy.visit("/login");
    cy.get('input[placeholder="Username"]').type(username);
    cy.get('input[placeholder="Password"]').type(password);
    cy.get('button[type="submit"]').click();
});

Cypress.Commands.add("createProject", (name, description) => {
    cy.contains("button","+ New Project").should("be.visible").click();
    cy.get('input[placeholder="Project Name"]').type(name);
    cy.get('textarea[placeholder="Project Description"]').type(description);
    cy.contains("button","Create").click();
});