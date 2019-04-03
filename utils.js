const reporter = require('cucumber-html-reporter');
const parseArgs = require('minimist');
const fse = require('fs-extra');
const _ = require('lodash');

function getArgs() {
  // // arguments:
  // // -t > run using sample results.json
  // // -f > cucumber results json file eg. sample/sample-results.json
  // // -o > output folder location eg. output/report/my-report.html
  // // -s > screenshots folder location eg. output/screenshots
  // // -i > input file path

  if (process.argv.length >= 2) {
    const argsv = parseArgs(process.argv);
    if (argsv.f || argsv.i || argsv.t) {
      return argsv;
    } else {
      throw new Error('Missing parameter "-f <filename>" OR -i <json>');
    }
  } else {
    throw new Error(
      'Incorrect number of parameters called, expect "-f <filename>" OR -i <json>'
    );
  }
}

function getOptions() {
  const args = getArgs();
  let resultsFile;
  let options;
  let setOptions = true;

  // // arguments:
  // // -t > run using sample results.json
  // // -f > cucumber results json file eg. sample/sample-results.json
  // // -o > output folder location eg. output/report/my-report.html
  // // -s > screenshots folder location eg. output/screenshots
  // // -i > input file path or json object

  if (args.f) {
    resultsFile = args.f;
  } else if (args.t) {
    resultsFile = 'sample/sample-results.json';
  } else if (_.isString(args.i)) {
    setOptions = false;
    if (fse.pathExistsSync(`/${args.i}`)) {
      throw new Error(`No file found in path: ${args.i}`);
    }

    options = fse.readJSONSync(args.i);
    if (!options.hasOwnProperty('jsonFile')) {
      throw new Error(
        '-i {options} is missing options.jsonFile'
      );
    }
  } else {
    throw new Error('Missing "-f <filename>" parameter OR -i <json> parameter');
  }

  if (setOptions) {
    if (!fse.pathExistsSync(`${resultsFile}`)) {
      throw new Error(`No file found in path: ${resultsFile}`);
    }

    options = {
      theme: 'bootstrap',
      jsonFile: resultsFile,
      reportSuiteAsScenarios: false,
      launchReport: false,
      metadata: {
        'App Version': '0.1.0',
        'Test Environment': '<env from user>',
        Browser: '<browser from user>',
        Platform: '<OS from user>'
      }
    };

    if (args.o) {
      options.output = args.o;
    } else {
      let outputFolder = 'output/report';
      fse.ensureDirSync(`${outputFolder}`);
      options.output = `${outputFolder}/cucumber-report.html`;
    }

    if (args.s) {
      (options.screenshotsDirectory = args.s), (options.storeScreenshot = true);
    }
  }
  if (!options.hasOwnProperty('theme')) {
    options.theme = 'bootstrap';
  }
  return options;
}

function generateReport() {
  let finalOptions = getOptions();
  return reporter.generate(finalOptions);
}

module.exports = {
  getArgs,
  getOptions,
  generateReport
};
