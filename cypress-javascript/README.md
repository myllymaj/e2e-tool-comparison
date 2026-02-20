# Cypress E2E Tests --- JavaScript Implementation

This directory contains the **Cypress (JavaScript)** implementation of
the end-to-end test scenarios developed for the E2E tool comparison
thesis.\
The tests execute the same functional scenarios as the Playwright
(.NET/C#) implementation against the same Angular single-page
application.

## Test Scenarios

The following scenarios are implemented:

-   **Navigation Scenario** --- Verifies client-side routing between
    pages
-   **Product Filtering Scenario** --- Verifies filtering of dynamic
    content
-   **Modal Interaction Scenario** --- Verifies opening and closing a
    modal overlay

Each scenario simulates realistic user interactions and validates DOM
updates.

------------------------------------------------------------------------

## Installation

Install dependencies:

``` bash
npm install
```

------------------------------------------------------------------------

## Running Tests

### Open Cypress Test Runner (Interactive Mode)

``` bash
npx cypress open
```

This launches the Cypress GUI where tests can be run interactively.

------------------------------------------------------------------------

### Run Tests Headlessly

``` bash
npx cypress run
```

Runs all tests in headless mode.

------------------------------------------------------------------------

### Run a Specific Spec File

``` bash
npx cypress run --spec "cypress/e2e/navigation.cy.js"
```

Examples:

``` bash
npx cypress run --spec "cypress/e2e/product-filtering.cy.js"
npx cypress run --spec "cypress/e2e/modal-interaction.cy.js"
```

------------------------------------------------------------------------

## Running Tests in a Specific Browser

Cypress supports multiple browsers.

### Chrome (default)

``` bash
npx cypress run --browser chrome
```

### Electron

``` bash
npx cypress run --browser electron
```

### Edge

``` bash
npx cypress run --browser edge
```

------------------------------------------------------------------------

## Debugging

### Interactive Debugging

Use the GUI:

``` bash
npx cypress open
```

You can:

-   Step through commands
-   Inspect DOM snapshots
-   View command logs
-   Use browser DevTools

------------------------------------------------------------------------

### Console Logging

Cypress automatically logs commands in the test runner UI.\
Additional debugging can be done using:

``` js
cy.log('Debug message')
```

------------------------------------------------------------------------

## Notes on Test Behavior

-   Cypress executes tests inside the browser environment.
-   Commands are asynchronous and queued automatically.
-   Assertions retry until they pass or time out.
-   Visibility checks use Cypress' definition of visibility, which may
    differ from Playwright (e.g., elements covered by overlays).

------------------------------------------------------------------------

## Purpose in the Thesis

This implementation enables a practical comparison between Cypress and
Playwright in terms of:

-   Test architecture
-   Synchronization behavior
-   Assertion mechanisms
-   Developer workflow
-   Reliability in dynamic single-page applications

The Cypress tests mirror the functional scope of the Playwright tests
while using Cypress-specific idioms and practices.
