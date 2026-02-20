/// <summary>
/// Test Scenario — Product Filtering.
///
/// This test scenario verifies filtering functionality on the Products page.
/// It ensures that selecting different categories updates the displayed
/// product list correctly after asynchronous loading.
///
/// Purpose:
/// To evaluate interaction with form controls, handling of dynamically
/// updated content, and the reliability of assertions on collections of
/// elements in a single-page application context using Cypress.
/// </summary>
describe('Product Filtering Scenario', () => {

  beforeEach(() => {
    // Navigate to the home page to ensure a consistent initial state
    cy.visit('http://localhost:4200')

    // Confirm that the Home page is displayed
    cy.get('[data-cy="home-title"]').should('be.visible')
  })

  it('should filter products by category', () => {

    // Navigate to the Products page
    cy.get('[data-cy="nav-products"]').should('be.visible')
    cy.get('[data-cy="nav-products"]').click()

    // Verify navigation to the Products route (strict match)
    cy.url().should('include', '/products')

    // Wait for asynchronous loading to complete
    cy.get('[data-cy="loading"]').should('be.visible')
    cy.get('[data-cy="loading"]').should('not.exist')

    // Confirm that the Products page is displayed
    cy.get('[data-cy="products-page"]').should('be.visible')

    // Verify default filter state ("All") and full product list
    cy.get('[data-cy="filter-select"]').should('have.value', 'all')
    cy.get('[data-cy="product-item"]').should('have.length', 4)

    // Verify initial product order and content
    cy.get('[data-cy="product-item"]').eq(0).should('contain.text', 'Pizza (food)')
    cy.get('[data-cy="product-item"]').eq(1).should('contain.text', 'Burger (food)')
    cy.get('[data-cy="product-item"]').eq(2).should('contain.text', 'Cola (drink)')
    cy.get('[data-cy="product-item"]').eq(3).should('contain.text', 'Water (drink)')

    // Apply "Food" filter and verify filtered results
    cy.get('[data-cy="filter-select"]').select('food')
    cy.get('[data-cy="filter-select"]').should('have.value', 'food')

    cy.get('[data-cy="product-item"]').should('have.length', 2)
    cy.get('[data-cy="product-item"]').eq(0).should('contain.text', 'Pizza (food)')
    cy.get('[data-cy="product-item"]').eq(1).should('contain.text', 'Burger (food)')

    // Verify that drink items are no longer present
    cy.contains('[data-cy="product-item"]', 'Cola').should('not.exist')
    cy.contains('[data-cy="product-item"]', 'Water').should('not.exist')

    // Apply "Drink" filter and verify filtered results
    cy.get('[data-cy="filter-select"]').select('drink')
    cy.get('[data-cy="filter-select"]').should('have.value', 'drink')

    cy.get('[data-cy="product-item"]').should('have.length', 2)
    cy.get('[data-cy="product-item"]').eq(0).should('contain.text', 'Cola (drink)')
    cy.get('[data-cy="product-item"]').eq(1).should('contain.text', 'Water (drink)')

    // Reset filter to "All" and verify full list is restored
    cy.get('[data-cy="filter-select"]').select('all')
    cy.get('[data-cy="filter-select"]').should('have.value', 'all')

    cy.get('[data-cy="product-item"]').should('have.length', 4)
  })
})