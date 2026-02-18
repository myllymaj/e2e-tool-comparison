// Disable parallel execution to ensure deterministic E2E test behavior.
// Tests share the same application instance and browser state,
// so running them sequentially prevents interference and flaky results.
[assembly: DoNotParallelize]