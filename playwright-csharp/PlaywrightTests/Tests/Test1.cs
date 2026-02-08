using Microsoft.Playwright;
using Microsoft.Playwright.MSTest;

namespace PlaywrightTests.Tests
{
    [TestClass]
    public sealed class Test1 : PageTest
    {
        [TestMethod]
        public async Task Open_Google_And_Check_Title()
        {
            // $env:PWDEBUG=1
            await Page.GotoAsync("https://www.google.com");

            string title = await Page.TitleAsync();

            Assert.IsTrue(title.Contains("Google"));
        }
    }
}
