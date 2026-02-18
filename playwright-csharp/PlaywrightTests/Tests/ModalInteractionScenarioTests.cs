using System.Text.RegularExpressions;

namespace PlaywrightTests.Tests
{
    /// <summary>
    /// Test Scenario — Modal Interaction.
    ///
    /// This test scenario verifies that a modal window on the home page
    /// can be opened and closed correctly without affecting application routing.
    /// It evaluates dynamic UI behavior, visibility changes, and state transitions,
    /// such as button enablement and overlay handling.
    ///
    /// Purpose:
    /// To assess synchronization between user actions and DOM updates,
    /// and the reliability of element visibility assertions in E2E testing.
    /// </summary>

    [TestClass]
    public class ModalInteractionScenarioTests : E2EBaseTest
    {
        [TestInitialize]
        public async Task Setup()
        {
            // Navigate to the home page to ensure a consistent initial state
            await Page.GotoAsync("http://localhost:4200");
            await Expect(Page.GetByTestId("home-title")).ToBeVisibleAsync();
        }

        [TestMethod]
        public async Task ModalInteractionTest()
        {
            // Define locators for modal interaction elements
            var openModalButton = Page.GetByTestId("open-modal-button");
            var modal = Page.GetByTestId("modal").First;
            var modalText = Page.GetByTestId("modal-text");
            var closeModalButton = Page.GetByTestId("close-modal-button");
            var backdrop = Page.GetByTestId("modal-backdrop");

            // Verify modal is initially closed
            await Expect(modal).ToBeHiddenAsync();

            // Open modal
            await Expect(openModalButton).ToBeVisibleAsync();
            await Expect(openModalButton).ToBeEnabledAsync();
            await openModalButton.ClickAsync();

            // Modal should not change the URL (client-side overlay)
            await Expect(Page).ToHaveURLAsync(new Regex(".*/$"));

            // Verify modal and backdrop are displayed
            await Expect(modal).ToBeVisibleAsync();
            await Expect(modalText).ToBeVisibleAsync();
            await Expect(backdrop).ToBeVisibleAsync();

            // Verify trigger button is disabled while modal is open
            await Expect(openModalButton).ToBeDisabledAsync();

            // Verify modal content
            await Expect(modalText).ToHaveTextAsync("This is a modal window.");

            // Close modal
            await Expect(closeModalButton).ToBeVisibleAsync();
            await Expect(closeModalButton).ToBeEnabledAsync();
            await closeModalButton.ClickAsync();

            // Verify modal and backdrop are hidden
            await Expect(modal).ToBeHiddenAsync();
            await Expect(backdrop).ToBeHiddenAsync();
            await Expect(closeModalButton).ToBeHiddenAsync();

            // Verify trigger button is enabled again
            await Expect(openModalButton).ToBeEnabledAsync();
        }
    }
}