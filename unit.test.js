const { getOptions, getArgs, generateReport } = require('./utils')
const fsmock = require('mock-fs')
const fsExtra = require('fs-extra')
const fs = require('fs')

global.console = {
  log: jest.fn(),
  info: jest.fn(),
  error: jest.fn()
}

describe('Unit test for custom report generator', () => {
  describe('Validate different parameters', () => {
    beforeEach(() => {
      // reset process.argv to known state
      process.argv = []
    })

    // arguments:

    // -o > output folder location eg. output/report/my-report.html
    // -s > screenshots folder location eg. output/screenshots
    // -i > input file path

    test('Error message is returned when incorrect number of parameters passed in', () => {
      expect(getArgs).toThrow('Incorrect number of parameters provided, expect "-f <filename>')
    })

    test('Error is returned for missing parameters', () => {
      process.argv.push('', '', '')
      expect(getArgs).toThrow('Missing parameter "-f <filename>"')
    })

    test('Verify no error message for correct -f parameter is passed in', () => {
      process.argv.push('', '-f', 'sample/sample-result.json')
      expect(getArgs).not.toThrow()
    })

    test('Verify error message if only -i parameter is passed in', () => {
      process.argv.push('', '-i', 'sample/sample-report-format.json')
      expect(getArgs).toThrow('Missing parameter "-f <filename>"')
    })

    test('Verify no error message for correct -t parameter is passed in', () => {
      process.argv.push('', '-t')
      expect(getArgs).not.toThrow()
    })

    test('Verify no error message for multiple correct -f, -o parameter', () => {
      process.argv.push('', '-f', 'sample/sample-result.json', '-o', 'output/report.html')
      expect(getArgs).not.toThrow()
    })

  })

  describe('Generate options config using default options', () => {
    beforeEach(() => {
      // reset process.argv to known state
      process.argv = []
    })

    let expectedOptions = {
      "jsonFile": "sample/sample-results.json",
      "launchReport": false,
      "metadata": {
        "App Version": "0.1.0",
        "Browser": "<browser from user>",
        "Platform": "<OS from user>",
        "Test Environment": "<env from user>",
      },
      "output": "output/report/cucumber-report.html",
      "reportSuiteAsScenarios": false,
      "theme": "bootstrap"
    }

    test('Verify options config is generated for parameter -t', () => {
      process.argv.push('', '-t')
      const options = getOptions()
      expect(options).toEqual(expectedOptions)
    })

    test('Verify options config is not generated for parameter -f when file not exist', () => {
      process.argv.push('-f', 'fakeLocation/fake/fakeSample.json')
      expect(getOptions).toThrow('No file found in path: fakeLocation/fake/fakeSample.json')
    })

    test('Verify options config is generated for parameter -f and file exist', () => {
      process.argv.push('-f', 'sample/sample-results.json')
      const options = getOptions()
      expect(options).toEqual(expectedOptions)
    })

    test('Verify options config is generated for parameter -f and -o, also output file location is changed', () => {
      process.argv.push('', '-f', 'sample/sample-results.json', '-o', 'output/report.html')
      const options = getOptions()
      expectedOptions.output = 'output/report.html'
      expect(options).toEqual(expectedOptions)
    })

    test('Verify options config is generated for parameter -f and -s', () => {
      process.argv.push('', '-f', 'sample/sample-results.json', '-s', 'output/screenshots')
      expectedOptions.screenshotsDirectory = "output/screenshots"
      expectedOptions.output = "output/report/cucumber-report.html"
      expectedOptions.storeScreenshots = true
      const options = getOptions()
      expect(options).toEqual(expectedOptions)
    })

    test('Verify error message if option -f is passed in with no filename', () => {
      process.argv.push('', '-f', '')
      expect(getOptions).toThrow('Missing "-f <filename>" parameter')
    })

    test('Verify error message if option -f is not passed in with option -i', () => {
      process.argv.push('', '-i', '')
      expect(getOptions).toThrow('Missing parameter "-f <filename>"')
    })

    test('Verify report file path is correct for -i parameter', () => {
      process.argv.push('', '-f', 'sample/sample-results.json', '-i', 'fake/fake-report-format.json')
      expect(getOptions).toThrow(`No file found in path: fake/fake-report-format.json`)
    })

    test('Verify options config is generated for parameter -f and -i', () => {
      process.argv.push('', '-f', 'sample/sample-results.json', '-i', 'sample/sample-input.json')
      const options = getOptions()
      expectedOptions.metadata.Browser = "Chrome/74.0.3723.0"
      expectedOptions.metadata.Platform = "MACOSX"
      expectedOptions.metadata["Test Environment"] = "LocalDev"
      expectedOptions.output = "output/report/cucumber_report.html"
      expectedOptions.screenshotsDirectory = "output/screenshots/"
      expectedOptions.storeScreenshots = true
      expect(options).toEqual(expectedOptions)
    })

    test('Verify options config is generated for parameter -i and no theme and default theme is applied', () => {
      let noTheme = {
        "jsonFile": "sample/sample-results.json",
        "output": "output/report/cucumber_report.html",
        "screenshotsDirectory": "output/screenshots/",
        "reportSuiteAsScenarios": false,
        "launchReport": false,
        "storeScreenshots": true
      }

      fsmock({
        'sample': {
          'no-theme.json': `${JSON.stringify(noTheme)}`,
          'sample-results.json': { "abc": "def" }
        },
      });

      process.argv.push('', '-f', 'sample/sample-results.json', '-i', 'sample/no-theme.json')
      const options = getOptions()
      let expectedNoTheme = noTheme
      expectedNoTheme.theme = 'bootstrap'
      expect(options).toEqual(noTheme)

      fsmock.restore()
    })

    test('Verify options config is not generated for parameter -i and no jsonFile', () => {

      let noJsonFile = {
        "output": "output/report/cucumber_report.html",
        "screenshotsDirectory": "output/screenshots/",
        "reportSuiteAsScenarios": false,
        "launchReport": false,
        "storeScreenshots": true
      }

      fsmock({
        'sample': {
          'no-jsonFile.json': `${JSON.stringify(noJsonFile)}`,
          'sample-results.json': { "abc": "def" }
        },
      });

      process.argv.push('', '-f', 'sample/sample-results.json', '-i', 'sample/no-jsonFile.json')
      expect(getOptions).toThrow(`-i {options} is missing options.jsonFile`)

      fsmock.restore()
    })

    test('Verify options config is generated for parameter -i and output file name is specified', () => {
      let customReportName = {
        "jsonFile": "sample/sample-results.json",
        "output": "output/report/my-report.html",
        "screenshotsDirectory": "output/screenshots/",
        "reportSuiteAsScenarios": false,
        "launchReport": false,
        "storeScreenshots": true
      }
      fsmock({
        'sample': {
          'custom-report-name.json': `${JSON.stringify(customReportName)}`,
          'sample-results.json': { "abc": "def" }
        },
      });

      process.argv.push('', '-f', 'sample/sample-results.json', '-i', 'sample/custom-report-name.json')
      const options = getOptions()
      expect(options.output).toEqual(customReportName.output)

      fsmock.restore()
    })

    test('Verify options config is generated for parameter -i and output config not set', () => {
      let noOutputInConfig = {
        "jsonFile": "sample/sample-results.json",
        "screenshotsDirectory": "output/screenshots/",
        "reportSuiteAsScenarios": false,
        "launchReport": false,
        "storeScreenshots": true
      }
      fsmock({
        'sample': {
          'no-output-in-config.json': `${JSON.stringify(noOutputInConfig)}`,
          'sample-results.json': { "abc": "def" }
        },
      });

      process.argv.push('', '-f', 'sample/sample-results.json', '-i', 'sample/no-output-in-config.json')
      const options = getOptions()
      expect(options.output).toEqual('output/report/cucumber-report.html')

      fsmock.restore()
    })
  })

  describe('Generate report', () => {
    beforeEach(() => {
      // reset process.argv to known state
      process.argv = []
      fsExtra.ensureDirSync('test-files')
    })

    //clean up after each test
    afterEach(function () {
      // remove extra folders
      fsExtra.removeSync('test-files');
    });

    test('Verify report is generated', () => {
      let testOptions = {
        "theme": "bootstrap",
        "jsonFile": "sample/sample-results.json",
        "output": "test-files/report/test_report.html",
        "screenshotsDirectory": "output/screenshots/",
        "reportSuiteAsScenarios": false,
        "launchReport": false,
        "storeScreenshots": true,
        "metadata": {
          "App Version": "0.1.0",
          "Test Environment": "LocalDev",
          "Browser": "Chrome/74.0.3723.0",
          "Platform": "MACOSX"
        }
      }
      fsExtra.writeJSONSync('test-files/test-input.json', testOptions)

      process.argv.push('', '-f', 'sample/sample-results.json', '-i', 'test-files/test-input.json')
      generateReport()

      expect(global.console.log).toHaveBeenCalledWith('Cucumber HTML report test-files/report/test_report.html generated successfully.')
      expect(fs.existsSync('test-files/report/test_report.html')).toEqual(true);

    })

  })
})