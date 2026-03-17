# Playwright (.NET / C#) — E2E Tests

This project contains end-to-end (E2E) tests implemented using Playwright for .NET (C#).

The tests target the Angular single-page application used in the Bachelor’s thesis to compare Playwright and Cypress through equivalent test scenarios.

---

## Prerequisites

- .NET SDK (8.0 or newer recommended)
- Node.js (required for the Angular test application)
- Playwright browsers

Install Playwright browsers (first time only):

dotnet tool install --global Microsoft.Playwright.CLI
playwright install

---

## Running Tests

Run all tests:

dotnet test

Run tests with detailed (verbose) logging:

dotnet test --logger "console;verbosity=detailed"

Run a specific test class:

dotnet test --filter FullyQualifiedName~NavigationScenarioTests

Run a specific test method:

dotnet test --filter FullyQualifiedName~NavigationScenarioTests.NavigationAndModalScenarioTest

---

## Debugging Tests

### Enable Playwright Inspector (PWDEBUG)

PowerShell:

$env:PWDEBUG=1

Command Prompt:

set PWDEBUG=1

Run tests:

dotnet test

When debugging is enabled, Playwright will:

- Launch the browser in headed mode
- Pause execution between steps
- Open the Playwright Inspector for step-by-step debugging

Disable debugging:

PowerShell:

$env:PWDEBUG=0

---

## Implemented Test Scenarios

Each test class corresponds to a scenario used in the thesis comparison:

- Navigation and Modal Scenario  
  Verifies routing between pages and modal interaction behavior

- Product Search and Filtering Scenario  
  Tests dynamic filtering, searching, and empty states

- Cart Interaction Scenario  
  Validates cart operations, quantity updates, price calculation, and stock handling

- Full User Workflow Scenario  
  Simulates a complete purchase flow including confirmation, processing state, and receipt validation

---

## Testing Approach

- Stable selectors are used via data-testid attributes
- Tests use deterministic setup via localStorage.clear()
- Assertions include both positive and negative checks
- Asynchronous behavior is handled using Playwright’s auto-waiting and explicit assertions (Expect)
- A shared base test class (E2EBaseTest) is used to standardize browser and page setup

This ensures reliable and reproducible test execution across runs.

---

## Project Structure

PlaywrightTests/
  Tests/
    NavigationScenarioTests.cs
    ProductFilteringScenarioTests.cs
    CartInteractionScenarioTests.cs
    FullUserWorkflowScenarioTests.cs

Each test class represents one scenario in the comparative study.

---

## Tracing

Playwright tracing is enabled per test.

Trace files are saved in:

/playwright-traces/

To view a trace:

playwright show-trace <trace-file>

Tracing provides:

- Step-by-step execution timeline
- DOM snapshots
- Network activity
- Console logs

---

## Troubleshooting

### Browsers fail to launch

playwright install

### Tests cannot connect to the application

Ensure the Angular test application is running at:

http://localhost:4200

---

## Notes for Thesis

This implementation is designed to provide a controlled and consistent environment for comparing Playwright with Cypress.

All scenarios are deterministic and based on mock data to ensure that observed differences are caused by the testing frameworks rather than application variability.