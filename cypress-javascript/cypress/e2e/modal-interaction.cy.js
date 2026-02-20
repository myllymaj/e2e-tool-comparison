/// <summary>
/// Test Scenario — Modal Interaction.
///
/// This test scenario verifies that a modal window on the home page
/// can be opened and closed correctly without affecting application routing.
/// It evaluates dynamic UI behavior, visibility changes, and state transitions,
/// such as button enablement and overlay handling.
///
/// Purpose:
/// To evaluate interaction with dynamic UI components, synchronization
/// between user actions and DOM updates, and the reliability of assertions
/// in a single-page application context using Cypress.
/// </summary>
describe('Modal Interaction Scenario', () => {

    beforeEach(() => {
        // Navigate to the home page to ensure a consistent initial state
        cy.visit('http://localhost:4200')

        // Confirm that the Home page is displayed
        cy.get('[data-cy="home-title"]').should('be.visible')
    })

    it('should open and close the modal without affecting the route', () => {

        // Verify modal and related elements are initially not present
        cy.get('[data-cy="modal"]').should('not.exist')
        cy.get('[data-cy="modal-text"]').should('not.exist')
        cy.get('[data-cy="close-modal-button"]').should('not.exist')

        // Open the modal
        cy.get('[data-cy="open-modal-button"]')
            .should('be.visible')
            .and('not.be.disabled')
            .click()

        // Verify modal does not change route (overlay, not navigation)
        cy.url().should('eq', 'http://localhost:4200/')

        // Verify modal and backdrop are displayed
        cy.get('[data-cy="modal"]').should('be.visible')
        cy.get('[data-cy="modal-text"]').should('be.visible')

        // Backdrop exists but may be covered by the modal
        cy.get('[data-cy="modal-backdrop"]').should('exist')

        // Verify underlying page content is still present (overlay, not navigation)
        cy.get('[data-cy="home-title"]').should('exist')

        // Verify trigger button is disabled while modal is open
        cy.get('[data-cy="open-modal-button"]').should('be.disabled')

        // Verify modal content
        cy.get('[data-cy="modal-text"]')
            .should('contain.text', 'This is a modal window.')

        // Close the modal
        cy.get('[data-cy="close-modal-button"]')
            .should('be.visible')
            .and('not.be.disabled')
            .click()

        // Verify modal, backdrop, and modal content are removed
        cy.get('[data-cy="modal"]').should('not.exist')
        cy.get('[data-cy="modal-backdrop"]').should('not.exist')
        cy.get('[data-cy="modal-text"]').should('not.exist')
        cy.get('[data-cy="close-modal-button"]').should('not.exist')

        // Verify trigger button is enabled again
        cy.get('[data-cy="open-modal-button"]').should('not.be.disabled')
    })
})