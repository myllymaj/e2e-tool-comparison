using System.Text.RegularExpressions;

namespace PlaywrightTests.Tests
{
    /// <summary>
    /// Test Scenario — Product Filtering.
    ///
    /// This test scenario verifies filtering functionality on the Products page.
    /// It ensures that selecting different categories updates the displayed
    /// product list correctly after asynchronous data loading.
    ///
    /// Purpose:
    /// To evaluate interaction with form controls, handling of dynamically
    /// loaded content, and the reliability of assertions on collections of
    /// elements in a single-page application context.
    /// </summary>
    [TestClass]
    public class ProductFilteringScenarioTests : E2EBaseTest
    {
        [TestInitialize]
        public async Task Setup()
        {
            // Navigate to the home page to ensure a consistent initial state
            await Page.GotoAsync("http://localhost:4200");
            await Expect(Page.GetByTestId("home-title")).ToBeVisibleAsync();
        }

        [TestMethod]
        public async Task ProductFilteringTest()
        {
            // Define locators for navigation and product filtering elements
            var navProducts = Page.GetByTestId("nav-products");
            var filterSelect = Page.GetByTestId("filter-select");
            var productItems = Page.GetByTestId("product-item");

            // Navigate to the Products page
            await Expect(navProducts).ToBeVisibleAsync();
            await Expect(navProducts).ToBeEnabledAsync();
            await navProducts.ClickAsync();

            // Verify navigation to the Products route
            await Expect(Page).ToHaveURLAsync(new Regex(".*/products$"));

            // Home content should no longer be present
            await Expect(Page.GetByTestId("home-title")).ToHaveCountAsync(0);

            // Wait for asynchronous loading to complete
            await Expect(Page.GetByTestId("loading")).ToBeVisibleAsync();
            await Expect(Page.GetByTestId("loading")).ToBeHiddenAsync(new() { Timeout = 10000 });

            // Confirm that the Products page is displayed
            await Expect(Page.GetByTestId("products-page")).ToBeVisibleAsync();

            // Verify default filter state ("All")
            await Expect(filterSelect).ToHaveValueAsync("all");

            // Verify initial product list (all products visible)
            await Expect(productItems).ToHaveCountAsync(4);

            await Expect(productItems.Nth(0)).ToHaveTextAsync("Pizza (food)");
            await Expect(productItems.Nth(1)).ToHaveTextAsync("Burger (food)");
            await Expect(productItems.Nth(2)).ToHaveTextAsync("Cola (drink)");
            await Expect(productItems.Nth(3)).ToHaveTextAsync("Water (drink)");

            // Apply Food filter and verify results
            await filterSelect.SelectOptionAsync("food");
            await Expect(filterSelect).ToHaveValueAsync("food");

            await Expect(productItems).ToHaveCountAsync(2);
            await Expect(productItems.Nth(0)).ToHaveTextAsync("Pizza (food)");
            await Expect(productItems.Nth(1)).ToHaveTextAsync("Burger (food)");

            // Verify that drink items are not present in the product list
            await Expect(productItems.Filter(new() { HasText = "Cola (drink)" })).ToHaveCountAsync(0);
            await Expect(productItems.Filter(new() { HasText = "Water (drink)" })).ToHaveCountAsync(0);

            // Apply Drink filter and verify results
            await filterSelect.SelectOptionAsync("drink");
            await Expect(filterSelect).ToHaveValueAsync("drink");

            await Expect(productItems).ToHaveCountAsync(2);
            await Expect(productItems.Nth(0)).ToHaveTextAsync("Cola (drink)");
            await Expect(productItems.Nth(1)).ToHaveTextAsync("Water (drink)");

            // Verify that food items are not present in the product list
            await Expect(productItems.Filter(new() { HasText = "Pizza (food)" })).ToHaveCountAsync(0);
            await Expect(productItems.Filter(new() { HasText = "Burger (food)" })).ToHaveCountAsync(0);

            // Reset filter to All and verify full list is restored
            await filterSelect.SelectOptionAsync("all");
            await Expect(filterSelect).ToHaveValueAsync("all");

            await Expect(productItems).ToHaveCountAsync(4);
        }
    }
}