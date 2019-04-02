const { getOptions, getArgs } = require('./utils')
describe('Unit test for custom report generator', () => {
  describe('Validate different parameters', () => {

    test('Error message is returned when incorrect number of parameters passed in', () => {
      // reset process.argv to known state
      process.argv = []
      expect(getArgs).toThrow('Incorrect number of parameters called, expect "-f <filename>" OR -i <json>')
    })

    test('Error is returned for missing parameters', () => {
      // reset process.argv to known state
      process.argv = []
      process.argv.push('', '', '')
      expect(getArgs).toThrow('Missing parameter "-f <filename>" OR -i <json>')
    })

    test('Verify no error message for correct -f parameter is passed in', () => {
      // reset process.argv to known state
      process.argv = []
      process.argv.push('', '-f', 'sample/sample-result.json')
      expect(getArgs).not.toThrow()
    })

    test('Verify no error message for correct -i parameter is passed in', () => {
      // reset process.argv to known state
      process.argv = []
      process.argv.push('', '-i', 'sample/sample-report-format.json')
      expect(getArgs).not.toThrow()
    })

    test('Verify no error message for correct -t parameter is passed in', () => {
      // reset process.argv to known state
      // process.agrv = origProcessArgs
      process.argv = []
      process.argv.push('', '-t')
      expect(getArgs).not.toThrow()
    })

    test('Verify no error message for multiple correct -f, -o parameter', () => {
      // reset process.argv to known state
      process.argv = []
      process.argv.push('', '-f', 'sample/sample-result.json', '-o', 'output/report.html')
      expect(getArgs).not.toThrow()
    })

  })

  describe('Generate report using default options', () => {

  })

  describe('Generate report using cmd line options', () => {

  })

  describe('Generate report using file input', () => {

  })
})