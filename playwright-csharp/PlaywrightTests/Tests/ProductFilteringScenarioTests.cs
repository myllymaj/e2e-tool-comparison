using System.Text.RegularExpressions;

namespace PlaywrightTests.Tests
{
    /// <summary>
    /// Scenario 2 — Product Search and Filtering
    ///
    /// Verifies dynamic product filtering functionality,
    /// including asynchronous data loading and UI updates.
    ///
    /// Covers:
    /// - Category-based filtering
    /// - Search by product name and category
    /// - Combined search and filter behavior
    /// - Empty result state handling
    /// </summary>

    [TestClass]
    public class ProductFilteringScenarioTests : E2EBaseTest
    {
        [TestInitialize]
        public async Task Setup()
        {
            await Page.GotoAsync("http://localhost:4200");

            // Ensure deterministic test state
            await Page.EvaluateAsync("() => localStorage.clear()");

            await Expect(Page.GetByTestId("navbar")).ToBeVisibleAsync();
        }

        [TestMethod]
        public async Task ProductSearchAndFilteringScenarioTest()
        {
            const int TotalProducts = 13;
            const int FoodCount = 5;
            const int DrinkCount = 5;
            const int SnackCount = 3;
            const int PizzaResults = 2;

            var navProducts = Page.GetByTestId("nav-products");
            var searchInput = Page.GetByTestId("search-input");

            var filterFood = Page.GetByTestId("filter-food");
            var filterDrinks = Page.GetByTestId("filter-drinks");
            var filterSnacks = Page.GetByTestId("filter-snacks");
            var filterAll = Page.GetByTestId("filter-all");

            var productItems = Page.GetByTestId("product-item");
            var productCount = Page.GetByTestId("product-count");

            var loading = Page.GetByTestId("loading");
            var productsPage = Page.GetByTestId("products-page");
            var emptyState = Page.GetByTestId("no-products");

            // Listen for products API response
            var responseTask = Page.WaitForResponseAsync(
                r => r.Url.EndsWith("products.json") && r.Ok
            );

            // Navigate to products page
            await navProducts.ClickAsync();

            await Expect(Page).ToHaveURLAsync(new Regex(".*/products$"));

            // Verify loading lifecycle
            await Expect(loading).ToBeVisibleAsync();
            await responseTask;
            await Expect(loading).ToBeHiddenAsync();

            await Expect(productsPage).ToBeVisibleAsync();

            // Default product list
            await Expect(productItems).ToHaveCountAsync(TotalProducts);
            await Expect(productCount).ToContainTextAsync(TotalProducts.ToString());

            // Filter: Food
            await filterFood.ClickAsync();

            await Expect(productItems).ToHaveCountAsync(FoodCount);
            await Expect(productCount).ToContainTextAsync(FoodCount.ToString());

            // Ensure drinks are not shown
            await Expect(productItems.Filter(new() { HasText = "Cola" })).ToHaveCountAsync(0);
            await Expect(productItems.Filter(new() { HasText = "Water" })).ToHaveCountAsync(0);

            // Filter: Drinks
            await filterDrinks.ClickAsync();
            await Expect(productItems).ToHaveCountAsync(DrinkCount);

            await Expect(productItems.Filter(new() { HasText = "drink" })).ToHaveCountAsync(DrinkCount);

            // Filter: Snacks
            await filterSnacks.ClickAsync();
            await Expect(productItems).ToHaveCountAsync(SnackCount);

            // Reset filters
            await filterAll.ClickAsync();
            await Expect(productItems).ToHaveCountAsync(TotalProducts);
            await Expect(productCount).ToContainTextAsync(TotalProducts.ToString());

            // Search by name
            await Expect(searchInput).ToBeVisibleAsync();
            await Expect(searchInput).ToBeEditableAsync();

            await searchInput.FillAsync("pizza");

            await Expect(productItems).ToHaveCountAsync(PizzaResults);
            await Expect(productItems.First).ToContainTextAsync("Pizza");

            // Ensure empty state is not shown
            await Expect(emptyState).ToHaveCountAsync(0);

            // Search by category
            await searchInput.FillAsync("drink");

            await Expect(productItems).ToHaveCountAsync(DrinkCount);

            // URL should not change during search
            await Expect(Page).ToHaveURLAsync(new Regex(".*/products$"));

            // Combine search + filter
            await searchInput.FillAsync("pizza");
            await filterFood.ClickAsync();

            await Expect(productItems).ToHaveCountAsync(PizzaResults);

            // Empty result scenario
            await searchInput.FillAsync("notarealproduct");

            await Expect(emptyState).ToBeVisibleAsync();
            await Expect(productItems).ToHaveCountAsync(0);

            // Reset state
            await filterAll.ClickAsync();
            await searchInput.ClearAsync();

            await Expect(searchInput).ToHaveValueAsync("");
            await Expect(productItems).ToHaveCountAsync(TotalProducts);
            await Expect(productCount).ToContainTextAsync(TotalProducts.ToString());
            await Expect(emptyState).ToHaveCountAsync(0);
        }
    }
}