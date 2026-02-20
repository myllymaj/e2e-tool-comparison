/// <summary>
/// Test Scenario — Navigation.
///
/// This test scenario verifies client-side navigation between pages
/// using the application's menu links. It ensures that routing updates
/// the URL correctly and that the corresponding page content is rendered.
///
/// Purpose:
/// To evaluate interaction with navigation elements, routing behavior,
/// page transitions, and the reliability of assertions in a
/// single-page application context using Cypress.
/// </summary>
describe('Navigation Scenario', () => {

  beforeEach(() => {
    // Navigate to the home page to ensure a consistent initial state
    cy.visit('http://localhost:4200')

    // Confirm that the Home page is displayed
    cy.get('[data-cy="home-title"]').should('be.visible')
  })

  it('should navigate between pages using the menu links', () => {

    // Verify that the navigation bar is visible
    cy.get('[data-cy="navbar"]').should('be.visible')

    // Navigate to the Products page
    cy.get('[data-cy="nav-products"]').should('be.visible')
    cy.get('[data-cy="nav-products"]').click()

    // Verify navigation to the Products route
    cy.url().should('include', '/products')

    // Home content should no longer be present 
    cy.get('[data-cy="home-title"]').should('not.exist')

    // Wait for asynchronous loading to complete
    cy.get('[data-cy="loading"]', { timeout: 10000 })
      .should('not.exist')

    // Confirm that the Products page content is displayed
    cy.get('[data-cy="products-page"]').should('be.visible')
    cy.get('[data-cy="products-title"]').should('be.visible')
    cy.get('[data-cy="product-item"]').should('have.length', 4)

    // Navigate to the About page
    cy.get('[data-cy="nav-about"]').should('be.visible')
    cy.get('[data-cy="nav-about"]').click()

    // Verify navigation to the About route
    cy.url().should('include', '/about')

    // Products content should be gone 
    cy.get('[data-cy="products-page"]').should('not.exist')

    cy.get('[data-cy="about-title"]').should('be.visible')

    // Navigate back to the Home page
    cy.get('[data-cy="nav-home"]').should('be.visible')
    cy.get('[data-cy="nav-home"]').click()

    // Verify navigation back to the root route
    cy.url().should('include', '/')

    // About content should be gone 
    cy.get('[data-cy="about-title"]').should('not.exist')

    cy.get('[data-cy="home-title"]').should('be.visible')
  })
})