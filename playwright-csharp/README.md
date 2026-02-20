# Playwright (.NET / C#) — E2E Tests

This project contains end-to-end (E2E) tests implemented with Playwright for .NET (C#). The tests target the sample Angular single-page application used in the thesis to compare Playwright and Cypress.

## Prerequisites

- .NET SDK (8.0 or newer recommended)
- Node.js (only required by the test application)
- Playwright browsers installed

Install Playwright browsers (first time only):

```bash
dotnet tool install --global Microsoft.Playwright.CLI
playwright install
```

---

## Running Tests

Run all tests:

```bash
dotnet test
```

Run tests with detailed (verbose) logging:

```bash
dotnet test --logger "console;verbosity=detailed"
```

Run a specific test class:

```bash
dotnet test --filter FullyQualifiedName~NavigationScenarioTests
```

Run a specific test method:

```bash
dotnet test --filter FullyQualifiedName~NavigationScenarioTests.NavigationTest
```

---

## Debugging Tests

### Enable Playwright Inspector (pwdebug)

PowerShell:

```powershell
$env:PWDEBUG=1
```

Command Prompt:

```cmd
set PWDEBUG=1
```

Disable debugging:

PowerShell:

```powershell
$env:PWDEBUG=0
```

Run tests while debugging is enabled:

```bash
dotnet test
```

When enabled, Playwright will:

- Launch browsers in headed mode
- Pause execution
- Open the Playwright Inspector for step‑by‑step debugging

---

## Notes for Thesis Comparison

- Tests use `data-testid` attributes for stable element selection.
- Each scenario represents common SPA interactions:
  - Navigation
  - Product filtering
  - Modal interaction
- Assertions include both positive and negative checks to verify UI state transitions.

---

## Project Structure

```
PlaywrightTests/
  Tests/
    NavigationScenarioTests.cs
    ProductFilteringScenarioTests.cs
    ModalInteractionScenarioTests.cs
```

Each test class corresponds to one scenario used in the tool comparison.

---

## Troubleshooting

If browsers fail to launch:

```bash
playwright install
```

If tests cannot connect to the application, ensure the Angular test app is running at:

```
http://localhost:4200
```

