const {getOptions, getArgs} = require('./utils')
describe('Unit test for custom report generator', () => {
  describe('Launch application', () => {
    const origProcessArgs = process.argv

    test('Check error message returned when incorrect number of parameters passed in', () => {
      process.argv.shift()

      function testGetArgs() {
        getArgs();
      }
      expect(testGetArgs).toThrow('Incorrect number of parameters called, expect "-f <filename>" OR -i <json>')
    })

    test('Check error message returned when incorrect parameters are passed in', () => {
      process.argv.push('')

      function testGetArgs() {
        getArgs();
      }
      expect(testGetArgs).toThrow('Missing parameter "-f <filename>" OR -i <json>')
    })

    test('Check no error message returned when correct parameters (-f) are passed in', () => {
      process.argv.push('-f', 'sample/sample-result.json')
      
      function testGetArgs() {
        getArgs();
      }
      expect(testGetArgs).not.toThrow()
    })

    test('Check no error message returned when correct parameters (-i) are passed in', () => {
      process.argv.push('-i', 'sample/sample-report-format.json')
      
      function testGetArgs() {
        getArgs();
      }
      expect(testGetArgs).not.toThrow()
    })

    test('Check no error message returned when correct parameters (-t) are passed in', () => {
      process.argv.push('-t')
      
      function testGetArgs() {
        getArgs();
      }
      expect(testGetArgs).not.toThrow()
    })

    test('Check no error message returned when correct multiple parameters (-f -o) are passed in', () => {
      process.argv.push('-f', 'sample/sample-result.json', '-o', 'output/report.html')
      
      function testGetArgs() {
        getArgs();
      }
      expect(testGetArgs).not.toThrow()
    })

  })

  describe('Generate report using default options', () => {

  })

  describe('Generate report using cmd line options', () => {

  })

  describe('Generate report using file input', () => {

  })
})