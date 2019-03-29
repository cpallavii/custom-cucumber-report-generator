const reporter = require('cucumber-html-reporter')
const parseArgs = require('minimist')
const fse = require('fs-extra')
const _ = require('lodash')

let args

// arguments:
// -t > run using sample results.json
// -f > cucumber results json file eg. sample/results.json
// -o > output folder location eg. output/report
// -s > screenshots folder location eg. output/screenshots
// -i > input file path or json object

// check that more than 2 arguments have been passed in
if (process.argv.length >= 2) {
    // console.log(`arguments: ${process.argv}`)
    args = parseArgs(process.argv)
    // console.log(`min args: ${JSON.stringify(args)}`)
    // console.dir(args.f)
} else {
    throw new Error('Missing "-f <filename>" parameter OR -i <json> parameter')
}

let resultsFile
let options
let setOptions = true

if (args.f) {
    resultsFile = args.f
} else if (args.t) {
    resultsFile = 'sample/sample-results.json'
} else if (_.isString(args.i)) {
    setOptions = false
    // Check if valid file exists
    if (fse.pathExistsSync(`/${args.i}`)) {
        throw new Error(`No file found in path: ${args.i}`)
    }

    options = fse.readJSONSync(args.i)
    // check the object parameter passed has the minimum values required
    if (!(options.hasOwnProperty('jsonFile') && options.hasOwnProperty('output'))) {
        throw new Error('-i {options} is missing options.jsonFile and options.output parameters')
    }

} else {
    throw new Error('Missing "-f <filename>" parameter OR -i <json> parameter')
}

// NOT WORKING
// else if (_.isObject(args.i)) {
//     setOptions = false
//     options = JSON.parse(args.i)

//     // check the object parameter passed has the minimum values required
//     if (!(options.hasOwnProperty('jsonFile') && options.hasOwnProperty('output'))) {
//         throw new Error('-i {options} is missing options.jsonFile and options.output parameters')
//     }

// } 

if (setOptions) {

    // Check if jsonFile exists
    if (fse.pathExistsSync(`/${resultsFile}`)) {
        throw new Error(`No file found in path: ${resultsFile}`)
    }

    options = {
        theme: 'bootstrap',
        jsonFile: resultsFile,
        reportSuiteAsScenarios: false,
        launchReport: false,
        metadata: {
            "App Version": "0.1.0",
            "Test Environment": '<env from user>',
            "Browser": '<browser from user>',
            "Platform": '<OS from user>',
        }
    }

    if (args.o) {
        options.output = args.o
    } else {
        let outputFolder = 'output/report'
        fse.ensureDirSync(`${outputFolder}`)
        options.output = `${outputFolder}/cucumber-report.html`
    }

    if (args.s) {
        options.screenshotsDirectory = args.s,
            options.storeScreenshot = true
    }
}

// set default property theme to 'bootstrap' if it's not specified
if (!options.hasOwnProperty('theme')) {
    options.theme = 'bootstrap'
}

reporter.generate(options)