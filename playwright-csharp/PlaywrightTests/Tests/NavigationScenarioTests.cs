using Microsoft.Playwright;
using System.Text.RegularExpressions;

namespace PlaywrightTests.Tests
{
    /// <summary>
    /// Scenario 1 - Navigation and Modal Interaction
    ///
    /// Verifies client-side navigation between application routes,
    /// including URL updates and correct page rendering.
    ///
    /// Also validates modal behavior:
    /// - Opening and closing interactions
    /// - Backdrop click handling
    /// - UI state changes (disabled/enabled elements)
    /// </summary>

    [TestClass]
    public class NavigationScenarioTests : E2EBaseTest
    {
        [TestInitialize]
        public async Task Setup()
        {
            await Page.GotoAsync("http://localhost:4200");

            // Verify main layout is visible
            await Expect(Page.GetByTestId("app-header")).ToBeVisibleAsync();
            await Expect(Page.GetByTestId("navbar")).ToBeVisibleAsync();
            await Expect(Page.GetByTestId("footer")).ToBeVisibleAsync();
        }

        [TestMethod]
        public async Task NavigationAndModalScenarioTest()
        {
            var navHome = Page.GetByTestId("nav-home");
            var navProducts = Page.GetByTestId("nav-products");
            var navAbout = Page.GetByTestId("nav-about");

            var openModal = Page.GetByTestId("open-modal-button");
            var modal = Page.GetByTestId("modal");
            var modalText = Page.GetByTestId("modal-text");
            var closeModal = Page.GetByTestId("close-modal-button");
            var backdrop = Page.GetByTestId("modal-backdrop");

            var loading = Page.GetByTestId("loading");

            // Open modal and verify it is visible
            await openModal.ClickAsync();

            await Expect(modal).ToBeVisibleAsync();
            await Expect(modalText).ToBeVisibleAsync();
            await Expect(backdrop).ToBeVisibleAsync();

            // Button should be disabled while modal is open
            await Expect(openModal).ToBeDisabledAsync();

            // Clicking inside modal should not close it
            await modal.ClickAsync();
            await Expect(modal).ToBeVisibleAsync();

            // Close modal using button
            await closeModal.ClickAsync();

            // Ensure modal is fully removed from DOM
            await Expect(modal).ToBeHiddenAsync();
            await Expect(backdrop).ToBeHiddenAsync();

            // Button should be enabled again
            await Expect(openModal).ToBeEnabledAsync();

            // Re-open modal and close via backdrop
            await openModal.ClickAsync();

            await Expect(modal).ToBeVisibleAsync();
            await backdrop.ClickAsync(new() { Position = new Position { X = 5, Y = 5 } });

            await Expect(modal).ToBeHiddenAsync();
            await Expect(backdrop).ToBeHiddenAsync();

            await Expect(modal).ToHaveCountAsync(0);

            // Navigate to products
            await navProducts.ClickAsync();

            await Expect(Page).ToHaveURLAsync(new Regex(".*/products$"));
            await Expect(Page).Not.ToHaveURLAsync(new Regex(".*/about$"));

            // Verify loading lifecycle
            await Expect(loading).ToBeVisibleAsync();
            await Expect(loading).ToBeHiddenAsync(new() { Timeout = 10000 });

            // Verify products page
            await Expect(Page.GetByTestId("products-page")).ToBeVisibleAsync();
            await Expect(Page.GetByTestId("product-list")).ToBeVisibleAsync();
            await Expect(Page.GetByTestId("products-title")).ToBeVisibleAsync();

            // Navigate to about
            await navAbout.ClickAsync();

            await Expect(Page).ToHaveURLAsync(new Regex(".*/about$"));
            await Expect(Page.GetByTestId("about-title")).ToBeVisibleAsync();

            // Back to home
            await navHome.ClickAsync();

            await Expect(Page).ToHaveURLAsync("http://localhost:4200/");
        }
    }
}