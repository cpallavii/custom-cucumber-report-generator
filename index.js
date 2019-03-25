var reporter = require('cucumber-html-reporter')
// var parseArgs = require('minimist') 

var options = {
        theme: 'bootstrap',
        jsonFile: '<JSON file path from user>',
        output: 'output/report/cucumber_report.html',
        screenshotsDirectory: 'output/screenshots/',
        reportSuiteAsScenarios: false,
        launchReport: false,
        storeScreenshots: true,
        metadata: {
            "App Version":"0.1.0",
            "Test Environment": '<JSON env from user>',
            "Browser": '<JSON browser from user>',
            "Platform": '<JSON os from user>',
        }
    };

reporter.generate(options)