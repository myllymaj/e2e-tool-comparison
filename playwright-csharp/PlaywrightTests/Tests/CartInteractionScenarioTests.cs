using System.Text.RegularExpressions;

namespace PlaywrightTests.Tests
{
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

    [TestClass]
    public class CartInteractionScenarioTests : E2EBaseTest
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
        public async Task CartInteractionScenarioTest()
        {
            const int TotalProducts = 13;
            const int RemainingClicksToDepleteStock = 3;

            var navProducts = Page.GetByTestId("nav-products");

            var loading = Page.GetByTestId("loading");
            var cartButton = Page.GetByTestId("open-cart");
            var cartModal = Page.GetByTestId("cart-modal");
            var cartItems = Page.GetByTestId("cart-item");
            var emptyCart = Page.GetByTestId("cart-empty");
            var closeCart = Page.GetByTestId("close-cart");

            var cartCount = Page.GetByTestId("cart-count");
            var cartTotal = Page.GetByTestId("cart-total");
            var checkoutButton = Page.GetByTestId("checkout-button");

            var addToast = Page.GetByTestId("add-toast");

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

            await Expect(Page.GetByTestId("products-page")).ToBeVisibleAsync();
            await Expect(Page.GetByTestId("product-item")).ToHaveCountAsync(TotalProducts);

            // Target a known product (Pizza) for deterministic assertions
            var pizzaProduct = Page.GetByTestId("product-item").Filter(new() { Has = Page.GetByText("Pizza", new() { Exact = true }) });

            // Ensure selector resolves to exactly one product (prevents ambiguity)
            await Expect(pizzaProduct).ToHaveCountAsync(1);

            var pizzaAddButton = pizzaProduct.GetByTestId("add-to-cart");
            var stockIndicator = pizzaProduct.Locator(".product-stock");

            // Verify sale badge and discounted pricing
            await Expect(pizzaProduct.GetByTestId("sale-badge")).ToBeVisibleAsync();
            await Expect(pizzaProduct.Locator(".old-price")).ToBeVisibleAsync();
            await Expect(pizzaProduct.Locator(".sale-price")).ToHaveTextAsync("8 €");

            // Verify cart starts empty
            await cartButton.ClickAsync();

            await Expect(cartModal).ToBeVisibleAsync();
            await Expect(emptyCart).ToBeVisibleAsync();
            await Expect(cartItems).ToHaveCountAsync(0);

            // Close empty cart
            await closeCart.ClickAsync();
            await Expect(cartModal).ToBeHiddenAsync();

            // Add product to cart
            await pizzaAddButton.ClickAsync();

            // Verify toast feedback and cart counter update
            await Expect(addToast).ToBeVisibleAsync();
            await Expect(addToast).ToBeHiddenAsync();
            await Expect(cartCount).ToHaveTextAsync("1");

            // Open cart and verify contents
            await cartButton.ClickAsync();

            await Expect(cartModal).ToBeVisibleAsync();
            await Expect(cartItems).ToHaveCountAsync(1);

            var cartItem = cartItems.First;
            var itemQuantity = cartItem.GetByTestId("item-quantity");
            var increaseBtn = cartItem.GetByTestId("increase-item");
            var decreaseBtn = cartItem.GetByTestId("decrease-item");
            var removeBtn = cartItem.GetByTestId("remove-item");

            await Expect(cartItem).ToContainTextAsync("Pizza");

            // Verify discounted price is used in cart total
            await Expect(cartTotal).ToContainTextAsync("8.00€");

            await Expect(itemQuantity).ToHaveTextAsync("1");

            // Increase quantity and verify synchronization
            await increaseBtn.ClickAsync();

            await Expect(itemQuantity).ToHaveTextAsync("2");
            await Expect(cartCount).ToHaveTextAsync("2");

            // Verify total reflects correct multiplication (2 × sale price)
            await Expect(cartTotal).ToContainTextAsync("16.00€");

            // Decrease quantity and verify updates
            await decreaseBtn.ClickAsync();

            await Expect(itemQuantity).ToHaveTextAsync("1");
            await Expect(cartCount).ToHaveTextAsync("1");

            // Verify stock decreases when adding more items
            await Expect(stockIndicator).ToBeVisibleAsync();
            await Expect(stockIndicator).ToContainTextAsync("Stock:");

            // Capture stock before change
            var previousStock = await stockIndicator.InnerTextAsync();

            // Add one item
            await pizzaAddButton.ClickAsync();

            // Verify stock decreased
            await Expect(stockIndicator).Not.ToHaveTextAsync(previousStock);

            // Deplete remaining stock
            for (int i = 0; i < RemainingClicksToDepleteStock; i++)
            {
                await pizzaAddButton.ClickAsync();
            }

            // Verify stock limit behavior
            await Expect(stockIndicator).ToContainTextAsync("Stock: 0");
            await Expect(pizzaAddButton).ToBeDisabledAsync();
            await Expect(pizzaProduct.GetByText("Out of stock")).ToBeVisibleAsync();

            // Checkout should remain enabled while cart has items
            await Expect(checkoutButton).ToBeEnabledAsync();

            // Remove item from cart
            await removeBtn.ClickAsync();

            await Expect(cartItems).ToHaveCountAsync(0);
            await Expect(emptyCart).ToBeVisibleAsync();

            // Verify cart UI resets
            await Expect(cartCount).ToBeHiddenAsync();
            await Expect(cartItems.Filter(new() { HasText = "Pizza" })).ToHaveCountAsync(0);
            await Expect(cartTotal).ToHaveCountAsync(0);

            // Close cart
            await closeCart.ClickAsync();
            await Expect(cartModal).ToBeHiddenAsync();
        }
    }
}