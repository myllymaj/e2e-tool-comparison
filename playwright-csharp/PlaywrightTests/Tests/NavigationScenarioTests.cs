using System.Text.RegularExpressions;

namespace PlaywrightTests.Tests
{
    /// <summary>
    /// Test Scenario — Navigation.
    ///
    /// This test scenario verifies client-side navigation between pages
    /// using the application's menu links. It ensures that routing updates
    /// the URL correctly and that the corresponding page content is rendered.
    ///
    /// Purpose:
    /// To evaluate interaction with navigation elements, routing behavior,
    /// page transitions, and the reliability of assertions in a single-page
    /// application context.
    /// </summary>
    [TestClass]
    public class NavigationScenarioTests : E2EBaseTest
    {
        [TestInitialize]
        public async Task Setup()
        {
            // Navigate to the home page to ensure a consistent initial state
            await Page.GotoAsync("http://localhost:4200");
            await Expect(Page.GetByTestId("home-title")).ToBeVisibleAsync();
        }

        [TestMethod]
        public async Task NavigationTest()
        {
            // Verify that the navigation bar is visible
            await Expect(Page.GetByTestId("navbar")).ToBeVisibleAsync();

            // Define locators for navigation links
            var navProducts = Page.GetByTestId("nav-products");
            var navAbout = Page.GetByTestId("nav-about");
            var navHome = Page.GetByTestId("nav-home");

            // Navigate to the Products page
            await Expect(navProducts).ToBeVisibleAsync();
            await Expect(navProducts).ToBeEnabledAsync();
            await navProducts.ClickAsync();

            // Verify navigation to the Products route
            await Expect(Page).ToHaveURLAsync(new Regex(".*/products$"));

            // Home content should no longer be present
            await Expect(Page.GetByTestId("home-title")).ToHaveCountAsync(0);

            // Wait for asynchronous loading to complete
            await Expect(Page.GetByTestId("loading")).ToBeHiddenAsync(new() { Timeout = 10000 });

            // Confirm that the Products page content is displayed
            await Expect(Page.GetByTestId("products-page")).ToBeVisibleAsync();
            await Expect(Page.GetByTestId("products-title")).ToBeVisibleAsync();
            await Expect(Page.GetByTestId("product-item")).ToHaveCountAsync(4);

            // Navigate to the About page
            await Expect(navAbout).ToBeVisibleAsync();
            await Expect(navAbout).ToBeEnabledAsync();
            await navAbout.ClickAsync();

            // Verify navigation to the About route
            await Expect(Page).ToHaveURLAsync(new Regex(".*/about$"));

            // Products content should no longer be present
            await Expect(Page.GetByTestId("products-page")).ToHaveCountAsync(0);

            // Confirm that the About page content is displayed
            await Expect(Page.GetByTestId("about-title")).ToBeVisibleAsync();

            // Navigate back to the Home page
            await Expect(navHome).ToBeVisibleAsync();
            await Expect(navHome).ToBeEnabledAsync();
            await navHome.ClickAsync();

            // Verify navigation back to the root route
            await Expect(Page).ToHaveURLAsync(new Regex(".*/$"));

            // About content should no longer be present
            await Expect(Page.GetByTestId("about-title")).ToHaveCountAsync(0);

            // Confirm that the Home page content is displayed
            await Expect(Page.GetByTestId("home-title")).ToBeVisibleAsync();
        }
    }
}