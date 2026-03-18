/// <summary>
/// Scenario 3 - Cart Interaction
///
/// Verifies cart functionality including:
/// - Adding products to cart
/// - Sale price correctness
/// - Quantity updates and total calculation
/// - Stock reduction and limits
/// - Cart UI synchronization and reset behavior
/// </summary>

describe('Cart Interaction Scenario', () => {

    beforeEach(() => {
        // Intercept product data request
        cy.intercept('GET', '**/products.json').as('getProducts')

        cy.visit('http://localhost:4200')

        // Reset application state
        cy.window().then(win => win.localStorage.clear())

        cy.get('[data-cy="navbar"]').should('be.visible')
    })

    it('should handle cart interactions correctly', () => {

        const totalProducts = 13
        const remainingClicksToDepleteStock = 3

        // Open products page
        cy.get('[data-cy="nav-products"]').click()
        cy.url().should('match', /\/products$/)

        // Wait for loading
        cy.get('[data-cy="loading"]').should('be.visible')
        cy.wait('@getProducts')
        cy.get('[data-cy="loading"]').should('not.exist')

        cy.get('[data-cy="products-page"]').should('be.visible')
        cy.get('[data-cy="product-item"]').should('have.length', totalProducts)

        // Target Pizza product
        cy.contains('[data-cy="product-item"]', 'Pizza').as('pizzaProduct')
        cy.get('@pizzaProduct').should('have.length', 1)

        // Verify sale UI
        cy.get('@pizzaProduct').find('[data-cy="sale-badge"]').should('be.visible')
        cy.get('@pizzaProduct').find('.old-price').should('be.visible')
        cy.get('@pizzaProduct').find('.sale-price').should('contain.text', '8 €')

        // Verify cart starts empty
        cy.get('[data-cy="open-cart"]').click()
        cy.get('[data-cy="cart-modal"]').should('be.visible')
        cy.get('[data-cy="cart-empty"]').should('be.visible')
        cy.get('[data-cy="cart-item"]').should('have.length', 0)

        cy.get('[data-cy="close-cart"]').click()
        cy.get('[data-cy="cart-modal"]').should('not.exist')

        // Add product
        cy.get('@pizzaProduct').find('[data-cy="add-to-cart"]').click()

        // Toast + cart count
        cy.get('[data-cy="add-toast"]').should('be.visible')
        cy.get('[data-cy="add-toast"]').should('not.exist')
        cy.get('[data-cy="cart-count"]').should('contain.text', '1')

        // Open cart
        cy.get('[data-cy="open-cart"]').click()
        cy.get('[data-cy="cart-modal"]').should('be.visible')
        cy.get('[data-cy="cart-item"]').should('have.length', 1)

        cy.get('[data-cy="cart-item"]').first().as('cartItem')

        cy.get('@cartItem').should('contain.text', 'Pizza')

        cy.get('@cartItem')
            .find('[data-cy="item-quantity"]')
            .should('contain.text', '1')

        cy.get('[data-cy="cart-total"]').should('contain.text', '8.00€')

        // Increase quantity
        cy.get('@cartItem').find('[data-cy="increase-item"]').click()

        cy.get('@cartItem')
            .find('[data-cy="item-quantity"]')
            .should('contain.text', '2')

        cy.get('[data-cy="cart-count"]').should('contain.text', '2')
        cy.get('[data-cy="cart-total"]').should('contain.text', '16.00€')

        // Decrease quantity
        cy.get('@cartItem').find('[data-cy="decrease-item"]').click()

        cy.get('@cartItem').find('[data-cy="item-quantity"]').should('contain.text', '1')

        cy.get('[data-cy="cart-count"]').should('contain.text', '1')

        // Stock behavior
        cy.get('@pizzaProduct').find('.product-stock').as('stock')

        cy.get('@stock').invoke('text').then((previousStock) => {
            cy.get('@pizzaProduct').find('[data-cy="add-to-cart"]').click()

            cy.get('@stock').should(($el) => {
                expect($el.text()).not.to.eq(previousStock)
            })
        })

        // Deplete stock
        for (let i = 0; i < remainingClicksToDepleteStock; i++) {
            cy.get('@pizzaProduct').find('[data-cy="add-to-cart"]').click()
        }

        cy.get('@pizzaProduct').find('.product-stock').should('contain.text', 'Stock: 0')

        cy.get('@pizzaProduct').find('[data-cy="add-to-cart"]').should('be.disabled')

        cy.get('@pizzaProduct').contains('Out of stock').should('be.visible')

        // Checkout enabled
        cy.get('[data-cy="checkout-button"]').should('be.enabled')

        // Remove item
        cy.get('@cartItem').find('[data-cy="remove-item"]').click()

        cy.get('[data-cy="cart-item"]').should('have.length', 0)
        cy.get('[data-cy="cart-empty"]').should('be.visible')

        // Reset UI
        cy.get('[data-cy="cart-count"]').should('not.exist')
        cy.contains('[data-cy="cart-item"]', 'Pizza').should('not.exist')
        cy.get('[data-cy="cart-total"]').should('not.exist')

        // Close cart
        cy.get('[data-cy="close-cart"]').click()
        cy.get('[data-cy="cart-modal"]').should('not.exist')
    })
})