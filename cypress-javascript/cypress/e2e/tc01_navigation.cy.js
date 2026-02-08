describe("TC01 - Navigation", () => {
  it("shows expected title", () => {
    cy.visit("https://example.com");
    cy.title().should("eq", "Example Domain");
  });
});
