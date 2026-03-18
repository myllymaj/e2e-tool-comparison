/// <summary>
/// Scenario 2 - Product Search and Filtering
///
/// Verifies product filtering and search functionality,
/// including asynchronous loading and UI updates.
///
/// Covers:
/// - Category filtering
/// - Search by name and category
/// - Combined filter and search
/// - Empty state handling
/// </summary>

describe('Product Search and Filtering Scenario', () => {

  beforeEach(() => {
    // Intercept product data request
    cy.intercept('GET', '**/products.json').as('getProducts')

    cy.visit('http://localhost:4200')

    // Reset application state
    cy.window().then(win => win.localStorage.clear())

    cy.get('[data-cy="navbar"]').should('be.visible')
  })

  it('should filter and search products correctly', () => {

    const totalProducts = 13
    const foodCount = 5
    const drinkCount = 5
    const snackCount = 3
    const pizzaResults = 2

    // Open products page
    cy.get('[data-cy="nav-products"]').click()
    cy.url().should('match', /\/products$/)

    // Wait for data loading to complete
    cy.get('[data-cy="loading"]').should('be.visible')
    cy.wait('@getProducts')
    cy.get('[data-cy="loading"]', { timeout: 10000 }).should('not.exist')

    cy.get('[data-cy="products-page"]').should('be.visible')

    // Default state
    cy.get('[data-cy="product-item"]').should('have.length', totalProducts)
    cy.get('[data-cy="product-count"]').should('contain.text', totalProducts)

    // Filtering
    cy.get('[data-cy="filter-food"]').click()
    cy.get('[data-cy="product-item"]').should('have.length', foodCount)
    cy.get('[data-cy="product-count"]').should('contain.text', foodCount)

    cy.contains('[data-cy="product-item"]', 'Cola').should('not.exist')
    cy.contains('[data-cy="product-item"]', 'Water').should('not.exist')

    // Filter: Drinks
    cy.get('[data-cy="filter-drinks"]').click()
    cy.get('[data-cy="product-item"]').should('have.length', drinkCount)

    // Ensure all items are drinks
    cy.get('[data-cy="product-item"]').each(($el) => {
      cy.wrap($el).should('contain.text', 'drink')
    })

    cy.get('[data-cy="filter-snacks"]').click()
    cy.get('[data-cy="product-item"]').should('have.length', snackCount)

    // Reset filters
    cy.get('[data-cy="filter-all"]').click()
    cy.get('[data-cy="product-item"]').should('have.length', totalProducts)
    cy.get('[data-cy="product-count"]').should('contain.text', totalProducts)

    // Search by name
    cy.get('[data-cy="search-input"]').should('be.visible').and('be.enabled').clear().type('pizza')

    cy.get('[data-cy="product-item"]').should('have.length', pizzaResults)
    cy.get('[data-cy="product-item"]').first().should('contain.text', 'Pizza')
    cy.get('[data-cy="no-products"]').should('not.exist')

    // Search by category
    cy.get('[data-cy="search-input"]').clear().type('drink')
    cy.get('[data-cy="product-item"]').should('have.length', drinkCount)

    // Ensure all items are drinks
    cy.get('[data-cy="product-item"]').each(($el) => {
      cy.wrap($el).should('contain.text', 'drink')
    })

    cy.url().should('match', /\/products$/)

    // Combined filter and search
    cy.get('[data-cy="search-input"]').clear().type('pizza')
    cy.get('[data-cy="filter-food"]').click()
    cy.get('[data-cy="product-item"]').should('have.length', pizzaResults)

    // Empty state
    cy.get('[data-cy="search-input"]').clear().type('notarealproduct')
    cy.get('[data-cy="no-products"]').should('be.visible')
    cy.get('[data-cy="product-item"]').should('have.length', 0)

    // Reset state
    cy.get('[data-cy="filter-all"]').click()
    cy.get('[data-cy="search-input"]').clear()

    cy.get('[data-cy="search-input"]').should('have.value', '')
    cy.get('[data-cy="product-item"]').should('have.length', totalProducts)
    cy.get('[data-cy="product-count"]').should('contain.text', totalProducts)
    cy.get('[data-cy="no-products"]').should('not.exist')
  })
})