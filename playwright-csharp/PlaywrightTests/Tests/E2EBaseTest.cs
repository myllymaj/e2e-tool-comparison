using Microsoft.Playwright.MSTest;

namespace PlaywrightTests.Tests;

public class E2EBaseTest : PageTest
{
    private string? _tracePath;

    [TestInitialize]
    public async Task BaseSetup()
    {
        // Set a consistent viewport size to ensure uniform layout across tests
        await Page.SetViewportSizeAsync(1280, 800);

        // Prepare directory for storing Playwright trace files
        var traceDir = Path.Combine(
            TestContext.TestRunDirectory!,
            "playwright-traces"
        );

        Directory.CreateDirectory(traceDir);

        // Generate a unique trace file name using class and test names
        var fileName = $"{TestContext.FullyQualifiedTestClassName}.{TestContext.TestName}.zip"
            .Replace(":", "_");

        _tracePath = Path.Combine(traceDir, fileName);

        // Start Playwright tracing for debugging and analysis
        await Context.Tracing.StartAsync(new()
        {
            Title = TestContext.TestName,
            Screenshots = true,
            Snapshots = true,
            Sources = true
        });
    }

    [TestCleanup]
    public async Task BaseCleanup()
    {
        // Stop tracing and save the trace file
        await Context.Tracing.StopAsync(new()
        {
            Path = _tracePath
        });

        // Extract class name for concise reporting
        var className = TestContext.FullyQualifiedTestClassName
            .Split('.')
            .Last();

        // Retrieve test outcome
        var status = TestContext.CurrentTestOutcome
            .ToString()
            .ToLower();

        // Output test result summary to the console
        Console.WriteLine($"E2E test {className}.{TestContext.TestName} {status}:");

        // Output relative path to the saved trace file
        var traceFile = Path.GetFileName(_tracePath);
        Console.WriteLine($"Trace saved to: playwright-traces/{traceFile}");
    }
}