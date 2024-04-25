# WordPress Plugin Automation Test by Playwright
This repository contains an automation test suite for testing WordPress plugins using Node.js and Playwright. The test suite is designed to automate the testing process and ensure the quality and functionality of WordPress plugins.

## Getting Started
Follow these instructions to get a copy of the project up and running on your local machine for testing purposes.

### Prerequisites
Before you begin, make sure you have the following installed on your machine:
1. [Node JS](https://nodejs.org/en)
2. [NPM](https://www.npmjs.com/)
3. [Playwright](https://playwright.dev/)
4. [Git](https://git-scm.com/)

## Installation Guide
1. Clone the repository to your local machine using Git:
```
git clone https://github.com/your-username/wordpress-plugin-test-suite.git
```

3. Install the required dependencies for the playwright using npm:
```
npm init playwright@latest
```

## Configuration
Before running the tests, you may need to configure the test suite according to your WordPress environment.
1. Create a `.env` file on the root directory of this repository on your local machine.
2. Configure the `.env` file according to the instructions given in the `.env.example` file.
3. Save the file and run the test suite.

## Running the Tests
Once you've installed the dependencies and configured the `.env`, you can run the tests using the following command:
```
npx playwright test wordpress_plugin_automation_test.spec.js
```

If you want to see the browser automation on monitor, then run instead:
```
npx playwright test wordpress_plugin_automation_test.spec.js --headed
```

For running the test only on Chrome browser:
```
npx playwright test wordpress_plugin_automation_test.spec.js --project="chromium"
```

## Test Reports
After running the tests, you can find the test reports in the `./playwright-report` directory. The reports include detailed information about the test execution, including pass/fail status, screenshots, and logs.

## Acknowledgments
[Node JS](https://nodejs.org/en)
[Playwright](https://playwright.dev/)
[WordPress](https://wordpress.org/)
