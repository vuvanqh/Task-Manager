import "./helpers/helpers.js";

describe("E2E Authentication", () => {
    it("User can register", () => {
        cy.visit("/register");
        cy.get('input[placeholder="Username"]').type("user");
        cy.get('input[placeholder="Email"]').type("user@gmail.com");
        cy.get('input[placeholder="Password"]').type("qwerty1234");
        cy.get('input[placeholder="Confirm Password"]').type("qwerty1234");
        cy.get('button[type="submit"]').click();

        cy.url().should("include", "/");
    });

    it("User can login and logout", () => {
        cy.login("user", "qwerty1234");
        cy.contains("button", "Logout").click();
        cy.url().should("include", "/");
    });

    describe("Password reset request and confirm", () => {
        it("Requests reset and confirms with token", () => {
            cy.intercept("POST", "/auth/reset/request").as("resetRequest");
            cy.visit("/reset");

            cy.get('input[placeholder="Email"]').type("user@gmail.com");
            cy.get('button[type="submit"]').click();

            cy.wait("@resetRequest").then(({request, response}) => {
                expect(request.body).to.have.property("email", "user@gmail.com");
                expect(response.statusCode).to.eq(200);});

            cy.intercept("POST", "/auth/reset/confirm", {
                    statusCode: 200,
                    body: { success: true }
                }).as("resetConfirm");
            cy.visit("/reset/confirm");

            cy.get('input[placeholder="Token"]').type("token");
            cy.get('input[placeholder="New Password"]').type("newpass123");
            cy.get('input[placeholder="Confirm Password"]').type("newpass123");
            cy.get('button[type="submit"]').click();

            cy.wait("@resetConfirm").then(({request, response}) => {
                expect(request.body).to.have.property("token", "token");
                expect(request.body).to.have.property("new_passwd", "newpass123");
                expect(response.statusCode).to.eq(200);
            });

            cy.url().should("include", "/login");
    });
})});