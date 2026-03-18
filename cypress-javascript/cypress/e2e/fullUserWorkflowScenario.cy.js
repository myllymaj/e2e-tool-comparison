/// <summary>
/// Scenario 4 - Full User Workflow
///
/// Validates the complete purchase flow including:
/// - Product selection and cart updates
/// - Checkout confirmation dialog (including cancel flow)
/// - Processing state and UI locking
/// - Success feedback and receipt validation
/// - State reset after purchase
/// </summary>

describe('Full User Workflow Scenario', () => {

    beforeEach(() => {
        cy.intercept('GET', '**/products.json').as('getProducts')

        cy.visit('http://localhost:4200')

        cy.window().then(win => win.localStorage.clear())

        cy.get('[data-cy="navbar"]').should('be.visible')
    })

    it('should complete full purchase workflow correctly', () => {

        const noteText = "No onions please"

        // Navigate to products page
        cy.get('[data-cy="nav-products"]').click()
        cy.url().should('match', /\/products$/)

        // Wait for products to load
        cy.get('[data-cy="loading"]').should('be.visible')
        cy.wait('@getProducts')
        cy.get('[data-cy="loading"]').should('not.exist')

        cy.get('[data-cy="products-page"]').should('be.visible')

        // Select two products
        cy.get('[data-cy="product-item"]').first().as('firstProduct')
        cy.get('[data-cy="product-item"]').eq(1).as('secondProduct')

        // Add products to cart
        cy.get('@firstProduct').find('[data-cy="add-to-cart"]').click()
        cy.get('[data-cy="add-toast"]').should('be.visible')

        cy.get('@secondProduct').find('[data-cy="add-to-cart"]').click()
        cy.get('[data-cy="cart-count"]').should('contain.text', '2')

        // Open cart and verify contents
        cy.get('[data-cy="open-cart"]').click()
        cy.get('[data-cy="cart-modal"]').should('be.visible')
        cy.get('[data-cy="cart-item"]').should('have.length', 2)

        cy.get('[data-cy="cart-total"]').should('not.contain.text', '0.00€')

        // Open confirmation dialog
        cy.get('[data-cy="checkout-button"]').click()

        cy.get('[data-cy="confirm-modal"]').should('be.visible')
        cy.get('[data-cy="confirm-modal-content"]').should('contain.text', 'Confirm purchase')
        cy.get('[data-cy="confirm-yes"]').should('be.visible')
        cy.get('[data-cy="confirm-no"]').should('be.visible')

        // Ensure processing has not started
        cy.get('[data-cy="purchase-loading"]').should('not.exist')

        // Enter delivery note
        cy.get('[data-cy="delivery-note"]').should('be.enabled')
        cy.get('[data-cy="note-counter"]').should('contain.text', '0/100')

        cy.get('[data-cy="delivery-note"]').type(noteText)
        cy.get('[data-cy="note-counter"]').should('contain.text', `${noteText.length}/100`)

        // Cancel once to verify flow
        cy.get('[data-cy="confirm-no"]').click()
        cy.get('[data-cy="confirm-modal"]').should('not.exist')

        // Re-open confirmation dialog
        cy.get('[data-cy="checkout-button"]').click()
        cy.get('[data-cy="confirm-modal"]').should('be.visible')

        // Ensure note is not yet confirmed
        cy.get('[data-cy="delivery-note-confirmation"]').should('not.exist')

        // Confirm purchase
        cy.get('[data-cy="confirm-yes"]').click()

        // Verify processing state
        cy.get('[data-cy="purchase-loading"]').should('exist').and('be.visible')
        cy.get('[data-cy="spinner"]').should('be.visible')

        // Verify UI is locked during processing
        cy.get('[data-cy="checkout-button"]').should('be.disabled')
        cy.get('[data-cy="cart-item"]').first()
            .find('[data-cy="increase-item"]').should('be.disabled')

        cy.get('[data-cy="confirm-modal"]').should('not.exist')

        // Verify success state
        cy.get('[data-cy="purchase-success"]').should('be.visible')
        cy.get('[data-cy="purchase-success"]').should('contain.text', 'Purchase successful!')

        // Verify delivery note is displayed
        cy.get('[data-cy="delivery-note-confirmation"]').should('contain.text', noteText)

        // Validate receipt
        cy.get('[data-cy="thank-you-modal"]').should('be.visible')
        cy.get('[data-cy="receipt-item"]').should('have.length', 2)
        cy.get('[data-cy="receipt-item"]').first().should('contain.text', '×')

        cy.get('[data-cy="receipt-total"]').should('contain.text', '17.00 €')

        // Close receipt
        cy.get('[data-cy="continue-shopping"]').click()
        cy.get('[data-cy="thank-you-modal"]').should('not.exist')

        // Verify state reset
        cy.get('[data-cy="cart-count"]').should('not.exist')

        cy.get('[data-cy="open-cart"]').click()
        cy.get('[data-cy="cart-modal"]').should('be.visible')
        cy.get('[data-cy="cart-empty"]').should('be.visible')
        cy.get('[data-cy="cart-item"]').should('have.length', 0)

        // Verify UI is interactive again
        cy.get('@firstProduct').find('[data-cy="add-to-cart"]').should('be.enabled')

        // Verify URL remains unchanged
        cy.url().should('match', /\/products$/)

        // Verify success message disappears
        cy.get('[data-cy="purchase-success"]').should('not.exist')
    })
})