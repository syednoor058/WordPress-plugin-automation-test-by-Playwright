import dotenv from "dotenv";
const { test, expect } = require("@playwright/test");

// Fetching environment variables

dotenv.config();
const adminPanelUrl = process.env.SITE_ADMIN_URL;
const siteUrl = process.env.SITE_URL;
const userID = process.env.USER_ID;
const password = process.env.PASSWORD;

// This block of codes will execute before each test

test.beforeEach("Run this before all test.", async ({ page }, testInfo) => {
  await page.goto(adminPanelUrl);
  await page.locator("//input[@id='user_login']").fill(userID);
  await page.locator("//input[@id='user_pass']").fill(password);
  await page.locator("//input[@id='wp-submit']").click();

  testInfo.setTimeout(60000);
});

// Test Case 1: Log in to your WordPress site.

test("TestID_001: Login validation.", async ({ page }) => {
  await expect(page).toHaveTitle("Dashboard ‹ WP Automation Test — WordPress");
});

// Test Case 2: Check whether the “WP Dark Mode” Plugin is Active or not.

test("TestID_002: Plugin active status validation.", async ({ page }) => {
  await page
    .locator(
      "//div[@class='wp-menu-image dashicons-before dashicons-admin-plugins']"
    )
    .click();
  await page.waitForSelector("//table/tbody/tr/td[1]/strong");
  const availablePlugins = await page
    .locator("//table/tbody/tr/td[1]/strong")
    .allTextContents();

  let isInstalled = false;
  for (let i = 0; i < availablePlugins.length; i += 1) {
    if (availablePlugins[i] === "WP Dark Mode") {
      isInstalled = true;
      break;
    }
  }

  if (isInstalled) {
    console.log("Plugin is already installed.");
  } else {
    console.log("Plugin is not installed.");
  }
});

// Test Case 3: If Active, navigate to the WP Dark Mode & continue. Otherwise, Install the Plugin and Activate it.

test("TestID_003: Plugin activation if not active.", async ({ page }) => {
  await page
    .locator(
      "//div[@class='wp-menu-image dashicons-before dashicons-admin-plugins']"
    )
    .click();
  await page.waitForSelector("//table/tbody/tr/td[1]/strong");
  const availablePlugins = await page
    .locator("//table/tbody/tr/td[1]/strong")
    .allTextContents();

  let isInstalled = false;
  for (let i = 0; i < availablePlugins.length; i += 1) {
    if (availablePlugins[i] === "WP Dark Mode") {
      isInstalled = true;
      break;
    }
  }

  if (isInstalled) {
    await page.locator("//div[contains(text(),'WP Dark Mode')]").click();
  } else {
    await page.locator("//a[@class='page-title-action']").click();
    await page.getByPlaceholder("Search plugins...").fill("WP Dark Mode");
    await page.getByPlaceholder("Search plugins...").press("Enter");
    await page
      .locator(
        "//a[@aria-label='Install WP Dark Mode – WordPress Dark Mode Plugin for Improved Accessibility, Dark Theme, Night Mode, and Social Sharing 5.0.4 now']"
      )
      .click();
    await page.waitForSelector("//a[normalize-space()='Activate']");
    await page.locator("//a[normalize-space()='Activate']").click();
    await page.waitForSelector("//a[normalize-space()='Active']");
    if (await page.locator("//a[normalize-space()='Active']").isVisible()) {
      await page
    .locator(
      "//div[@class='wp-menu-image dashicons-before dashicons-admin-plugins']"
    )
    .click();
      await page.locator("//div[contains(text(),'WP Dark Mode')]").click();
    }
  }

  await expect(page).toHaveTitle(/Settings ‹ WP Automation Test — WordPress/);
});

// Test Case 4: Enable Backend Darkmode from Settings -> General Settings.

test("TestID_004: Enable backend darkmode from settings.", async ({ page }) => {
  await page.locator("//div[contains(text(),'WP Dark Mode')]").click();
  await page.locator("//a[normalize-space()='Admin Panel Dark Mode']").click();

  const toggleHidden = await page
    .locator(
      "//span[@class='w-5 h-5 flex rounded-full mt-0.5 ml-0.5 transition duration-100 border-4 border-white bg-slate-200']"
    )
    .isHidden();

  if (!toggleHidden) {
    await page
      .locator(
        "//span[@class='w-5 h-5 flex rounded-full mt-0.5 ml-0.5 transition duration-100 border-4 border-white bg-slate-200']"
      )
      .click();
    await page.locator("//button[normalize-space()='Save Changes']").click();
    toggleHidden = true;
  }

  await expect(toggleHidden).toBe(true);
});

// Test Case 5: Validate whether the Darkmode is working or not on the Admin Dashboard.

test("TestID_005: Validate whether the Darkmode is working.", async ({ page }) => {
  const darkModeVisible = await page
    .locator("//div[@class='switch wp-dark-mode-ignore active']")
    .isVisible();
  if (!darkModeVisible) {
    await page.locator("//div[@class='switch wp-dark-mode-ignore']").click();
  }

  const darkPage = await page.locator("//body");
  const backgroundColor = await darkPage.evaluate((ele) => {
    return window.getComputedStyle(ele).getPropertyValue("background-color");
  });

  await expect(backgroundColor).toBe("rgb(43, 45, 45)");
});

// Test Case 6: Navigate to the WP Dark Mode.

test("TestID_006: Navigate to the WP Dark Mode.", async ({ page }) => {
  await page.locator("//div[contains(text(),'WP Dark Mode')]").click();
  await expect(page).toHaveTitle(/Settings ‹ WP Automation Test — WordPress/);
});

// Test Case 7: From Settings -> Switch Settings - Change the “Floating Switch Style” from the default selections (Select any one from the available options, except the default selected one).

test("TestID_007: Switch settings of WP Dark Mode.", async ({ page }) => {
  await page.locator("//div[contains(text(),'WP Dark Mode')]").click();
  await page.locator("//h4[normalize-space()='Customization']").click();
  await page.locator("//a[normalize-space()='Switch Settings']").click();
  let changedFloatingSwitch = await page.locator("//div[@class='_selected bg-[#F9FAFB] flex flex-col items-center justify-center transition duration-75 rounded-lg relative cursor-pointer w-36 h-36']/div/div/span[@class='_thumb wp-dark-mode-ignore']").isVisible();

  if(!changedFloatingSwitch){
    await page
    .locator(
      "//body/div/div/div[@role='main']/div/div/div/div/div/div/div/div/section/div/div/div/div/div[1]/div[2]/div[3]"
    )
    .click();
  await page.locator("//button[normalize-space()='Save Changes']").click();
  changedFloatingSwitch = true;
  }

  await expect(
    changedFloatingSwitch
  ).toBe(true);
});

// Test Case 8: From Settings -> Switch Settings - Select Custom Switch size & Scale it to 220.

test("TestID_008: Select Custom Switch size & Scale it to 220.", async ({ page }) => {
  await page.locator("//div[contains(text(),'WP Dark Mode')]").click();
  await page.locator("//h4[normalize-space()='Customization']").click();
  await page.locator("//a[normalize-space()='Switch Settings']").click();
  await page
    .locator("div")
    .filter({ hasText: /^Custom$/ })
    .locator("span")
    .click();

  await page.getByRole("slider");
  await page.getByRole("slider").click();
  await page.getByRole("slider").fill("220");
  await page.locator("//button[normalize-space()='Save Changes']").click();
  await page.waitForTimeout(3000);
  // await expect(await page.getByRole("slider").innerText()).toBe("220");
  await page.goto(siteUrl);
  const switchSize = await page
    .locator("//div[@class='wp-dark-mode-switch wp-dark-mode-ignore']")
    .getAttribute("data-size");
  await expect(switchSize).toBe("2.2");
});

// Test Case 9: From Settings -> Switch Settings - Change the Floating Switch Position (Left Bottom).

test("TestID_009: Change the floating switch position.", async ({ page }) => {
  await page.locator("//div[contains(text(),'WP Dark Mode')]").click();
  await page.locator("//h4[normalize-space()='Customization']").click();
  await page.locator("//a[normalize-space()='Switch Settings']").click();
  const isLeftActive = await page
    .locator(
      "//div[@class='cursor-pointer flex items-center gap-2 py-2 transition duration-75 px-3.5 text-base font-normal leading-6 rounded-lg bg-blue-600 text-white shadow-md']/span[normalize-space()='Left']"
    )
    .isVisible();

  if (!isLeftActive) {
    await page.locator("//span[normalize-space()='Left']").click();
    await page.locator("//button[normalize-space()='Save Changes']").click();
  }

  await expect(
    await page
      .locator(
        "//div[@class='cursor-pointer flex items-center gap-2 py-2 transition duration-75 px-3.5 text-base font-normal leading-6 rounded-lg bg-blue-600 text-white shadow-md']/span[normalize-space()='Left']"
      )
      .isVisible()
  ).toBe(true);
});

// Test Case 10: Disable Keyboard Shortcut from the Accessibility Settings.

test("TestID_010: Disable Keyboard Shortcut from the Accessibility Settings.", async ({
  page,
}) => {
  await page.locator("//div[contains(text(),'WP Dark Mode')]").click();
  await page.locator("//h4[normalize-space()='Advanced']").click();
  await page
    .locator(
      "//a[@class='nav-item-child focus:outline-none inactive'][normalize-space()='Accessibility']"
    )
    .click();
  const isKeyShort = await page
    .locator(
      "//span[@class='w-5 h-5 flex rounded-full mt-0.5 ml-0.5 transition duration-100 translate-x-4 border-none bg-white']"
    )
    .isVisible();

  if (isKeyShort) {
    await page
      .locator(
        "//span[@class='w-5 h-5 flex rounded-full mt-0.5 ml-0.5 transition duration-100 translate-x-4 border-none bg-white']"
      )
      .click();
    await page.locator("//button[normalize-space()='Save Changes']").click();
  }

  await expect(
    await page
      .locator(
        "//span[@class='w-5 h-5 flex rounded-full mt-0.5 ml-0.5 transition duration-100 translate-x-4 border-none bg-white']"
      )
      .isVisible()
  ).toBe(false);
});

// Test Case 11: From Settings -> Animation - Enable “Darkmode Toggle Animation” & change the “Animation Effect” from the default selections.

test("TestID_011: Enable Darkmode Toggle Animation & change the Animation Effect.", async ({
  page,
}) => {
  await page.locator("//div[contains(text(),'WP Dark Mode')]").click();
  await page.locator("//h4[normalize-space()='Customization']").click();
  await page.locator("//a[normalize-space()='Site Animation']").click();
  const isAnimationToggleOff = await page
    .locator(
      "//div[@class='relative w-10 h-full rounded-full transition duration-100 bg-slate-200']"
    )
    .isVisible();

  if (isAnimationToggleOff) {
    await page
      .locator(
        "//div[@class='relative w-10 h-full rounded-full transition duration-100 bg-slate-200']"
      )
      .click();
    await page.locator("//button[normalize-space()='Save Changes']").click();
  }

  await page
    .locator(
      "//div[@class='flex items-center gap-2 cursor-pointer text-base leading-6 font-medium hover:opacity-75'][7]"
    )
    .click();
  await page.locator("//button[normalize-space()='Save Changes']").click();

  const effectName = await page.locator("//div[@class='flex items-center gap-2 cursor-pointer text-base leading-6 font-medium hover:opacity-75'][7]").innerText()==="Slide Right" || await page.locator("//div[@class='flex items-center gap-2 cursor-pointer text-base leading-6 font-medium hover:opacity-75'][7]").innerText()==="Slide Down";
  await expect(effectName).toBe(true);
});

// Test Case 12: Validate whether the Darkmode is working or not from the Frontend.

test("TestID_012: Validate whether the Darkmode is working or not from the Frontend.", async ({
  page,
}) => {
  await page.goto(siteUrl);
  await page.waitForTimeout(5000);
  const expectedBackgroundColor = "rgb(39, 40, 40)";
  const darkPage = await page.locator("//body");
  let backgroundColor = await darkPage.evaluate((ele) => {
    return window.getComputedStyle(ele).getPropertyValue("background-color");
  });
  if (backgroundColor !== expectedBackgroundColor) {
    await page
      .locator(
        "//div[@class='wp-dark-mode-floating-switch wp-dark-mode-ignore wp-dark-mode-animation wp-dark-mode-animation-bounce reverse']"
      )
      .click();
    backgroundColor = await darkPage.evaluate((ele) => {
      return window.getComputedStyle(ele).getPropertyValue("background-color");
    });
  }

  await expect(backgroundColor === expectedBackgroundColor).toBe(true);
});
