/// <summary>
/// Scenario 1 - Navigation and Modal Interaction
///
/// Verifies client-side navigation between application routes,
/// including URL updates and correct page rendering.
///
/// Also validates modal behavior:
/// - Opening and closing interactions
/// - Backdrop click handling
/// - UI state changes (disabled/enabled elements)
/// </summary>

describe('Navigation and Modal Scenario', () => {

  beforeEach(() => {
    cy.visit('http://localhost:4200')

    cy.get('[data-cy="app-header"]').should('be.visible')
    cy.get('[data-cy="navbar"]').should('be.visible')
    cy.get('[data-cy="footer"]').should('be.visible')
  })

  it('should handle navigation and modal interactions correctly', () => {

    // Open modal and verify visibility
    cy.get('[data-cy="open-modal-button"]').click()

    cy.get('[data-cy="modal"]').should('be.visible')
    cy.get('[data-cy="modal-text"]').should('be.visible')
    cy.get('[data-cy="modal-backdrop"]').should('be.visible')

    // Verify disabled state
    cy.get('[data-cy="open-modal-button"]').should('be.disabled')

    // Clicking inside modal should not close ite
    cy.get('[data-cy="modal"]').click()
    cy.get('[data-cy="modal"]').should('be.visible')

    // Close modal via button
    cy.get('[data-cy="close-modal-button"]').click()

    cy.get('[data-cy="modal"]').should('not.exist')
    cy.get('[data-cy="modal-backdrop"]').should('not.exist')

    // Verify enabled state
    cy.get('[data-cy="open-modal-button"]').should('be.enabled')

    // Re-open and close via backdrop
    cy.get('[data-cy="open-modal-button"]').click()

    cy.get('[data-cy="modal"]').should('be.visible')
    cy.get('[data-cy="modal-backdrop"]').click('topLeft')

    cy.get('[data-cy="modal"]').should('not.exist')
    cy.get('[data-cy="modal-backdrop"]').should('not.exist')

    // Navigate to products
    cy.get('[data-cy="nav-products"]').click()

    cy.url().should('match', /\/products$/)
    cy.url().should('not.include', '/about')
    cy.get('[data-cy="home-title"]').should('not.exist')

    // Cypress automatically retries assertions until they pass or timeout
    cy.get('[data-cy="loading"]').should('be.visible')
    cy.get('[data-cy="loading"]', { timeout: 10000 }).should('not.exist')

    // Verify products page
    cy.get('[data-cy="products-page"]').should('be.visible')
    cy.get('[data-cy="product-list"]').should('be.visible')
    cy.get('[data-cy="products-title"]').should('be.visible')

    // Navigate to about
    cy.get('[data-cy="nav-about"]').click()

    cy.url().should('match', /\/about$/)
    cy.url().should('not.include', '/products')

    cy.get('[data-cy="products-page"]').should('not.exist')
    cy.get('[data-cy="about-title"]').should('be.visible')

    // Back to home
    cy.get('[data-cy="nav-home"]').click()

    cy.url().should('eq', 'http://localhost:4200/')
    cy.get('[data-cy="about-title"]').should('not.exist')
    cy.get('[data-cy="products-page"]').should('not.exist')
  })
})