using System.Text.RegularExpressions;

namespace PlaywrightTests.Tests
{
    /// <summary>
    /// Scenario 4 - Full User Workflow
    ///
    /// Validates complete purchase flow including:
    /// - Product selection and cart updates
    /// - Checkout confirmation dialog (including cancel path)
    /// - Async processing state and UI locking
    /// - Success feedback and receipt validation
    /// - State reset and UI recovery after purchase
    /// </summary>

    [TestClass]
    public class FullUserWorkflowScenarioTests : E2EBaseTest
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
        public async Task FullUserWorkflowScenarioTest()
        {
            var navProducts = Page.GetByTestId("nav-products");

            var loading = Page.GetByTestId("loading");
            var productsPage = Page.GetByTestId("products-page");

            var cartButton = Page.GetByTestId("open-cart");
            var cartCount = Page.GetByTestId("cart-count");

            var cartModal = Page.GetByTestId("cart-modal");
            var cartItems = Page.GetByTestId("cart-item");
            var cartTotal = Page.GetByTestId("cart-total");
            var checkoutButton = Page.GetByTestId("checkout-button");

            var addToast = Page.GetByTestId("add-toast");

            var confirmModal = Page.GetByTestId("confirm-modal");
            var confirmContent = Page.GetByTestId("confirm-modal-content");
            var deliveryNote = Page.GetByTestId("delivery-note");
            var noteCounter = Page.GetByTestId("note-counter");
            var confirmYes = Page.GetByTestId("confirm-yes");
            var confirmNo = Page.GetByTestId("confirm-no");

            var purchaseLoading = Page.GetByTestId("purchase-loading");
            var purchaseSuccess = Page.GetByTestId("purchase-success");

            var thankYouModal = Page.GetByTestId("thank-you-modal");
            var receiptItems = Page.GetByTestId("receipt-item");
            var receiptTotal = Page.GetByTestId("receipt-total");

            var noteConfirmation = Page.GetByTestId("delivery-note-confirmation");
            var continueShopping = Page.GetByTestId("continue-shopping");

            var noteText = "No onions please";

            // API sync
            var responseTask = Page.WaitForResponseAsync(
                r => r.Url.EndsWith("products.json") &&
                     r.Request.Method == "GET"
            );

            // Navigate to products page
            await navProducts.ClickAsync();
            await Expect(Page).ToHaveURLAsync(new Regex(".*/products$"));

            // Verify loading lifecycle
            await Expect(loading).ToBeVisibleAsync();
            var response = await responseTask;
            await Expect(loading).ToBeHiddenAsync();

            Assert.AreEqual("GET", response.Request.Method);
            Assert.IsTrue(response.Ok);

            await Expect(productsPage).ToBeVisibleAsync();

            // Select two products (deterministic positions)
            var firstProduct = Page.GetByTestId("product-item").First;
            var secondProduct = Page.GetByTestId("product-item").Nth(1);

            // Add two products to cart
            await firstProduct.GetByTestId("add-to-cart").ClickAsync();
            await Expect(addToast).ToBeVisibleAsync();

            await secondProduct.GetByTestId("add-to-cart").ClickAsync();
            await Expect(cartCount).ToHaveTextAsync("2");

            // Open cart and verify contents
            await cartButton.ClickAsync();
            await Expect(cartModal).ToBeVisibleAsync();
            await Expect(cartItems).ToHaveCountAsync(2);

            // Ensure cart total is valid before checkout
            await Expect(cartTotal).Not.ToHaveTextAsync("0.00€");

            // Open confirmation dialog
            await checkoutButton.ClickAsync();

            // Verify confirm modal structure and actions
            await Expect(confirmModal).ToBeVisibleAsync();
            await Expect(confirmContent).ToContainTextAsync("Confirm purchase");
            await Expect(confirmYes).ToBeVisibleAsync();
            await Expect(confirmNo).ToBeVisibleAsync();

            // Ensure processing has not started yet
            await Expect(purchaseLoading).ToHaveCountAsync(0);

            // Fill delivery note and validate counter
            await Expect(deliveryNote).ToBeEditableAsync();
            await Expect(noteCounter).ToHaveTextAsync("0/100");

            await deliveryNote.FillAsync(noteText);
            await Expect(noteCounter).ToHaveTextAsync($"{noteText.Length}/100");

            // Cancel once to verify UX flow
            await confirmNo.ClickAsync();
            await Expect(confirmModal).ToBeHiddenAsync();

            // Re-open confirm dialog
            await checkoutButton.ClickAsync();
            await Expect(confirmModal).ToBeVisibleAsync();

            // Ensure note is not shown before confirmation
            await Expect(noteConfirmation).ToHaveCountAsync(0);

            // Confirm purchase
            await confirmYes.ClickAsync();

            // Verify processing state
            await Expect(purchaseLoading).ToBeVisibleAsync();
            await Expect(Page.GetByTestId("spinner")).ToBeVisibleAsync();

            // Ensure cart is locked during processing
            await Expect(checkoutButton).ToBeDisabledAsync();
            await Expect(cartItems.First.GetByTestId("increase-item")).ToBeDisabledAsync();

            // Confirm modal should be removed
            await Expect(confirmModal).ToHaveCountAsync(0);

            // Verify success state and message
            await Expect(purchaseSuccess).ToBeVisibleAsync();
            await Expect(purchaseSuccess).ToContainTextAsync("Purchase successful!");

            // Ensure delivery note appears in confirmation
            await Expect(noteConfirmation).ToContainTextAsync(noteText);

            // Validate receipt data
            await Expect(thankYouModal).ToBeVisibleAsync();
            await Expect(receiptItems).ToHaveCountAsync(2);
            await Expect(receiptItems.First).ToContainTextAsync("×");

            // Verify expected total (based on mock data)
            await Expect(receiptTotal).ToContainTextAsync("17.00 €");

            // Close receipt modal
            await continueShopping.ClickAsync();
            await Expect(thankYouModal).ToBeHiddenAsync();

            // Verify application state resets after purchase
            await Expect(cartCount).ToBeHiddenAsync();

            // Re-open cart → should be empty
            await cartButton.ClickAsync();
            await Expect(cartModal).ToBeVisibleAsync();
            await Expect(Page.GetByTestId("cart-empty")).ToBeVisibleAsync();
            await Expect(cartItems).ToHaveCountAsync(0);

            // Ensure UI is interactive again
            await Expect(firstProduct.GetByTestId("add-to-cart")).ToBeEnabledAsync();

            // Verify URL remains stable
            await Expect(Page).ToHaveURLAsync(new Regex(".*/products$"));

            // Success toast should disappear
            await Expect(purchaseSuccess).ToBeHiddenAsync();
        }
    }
}