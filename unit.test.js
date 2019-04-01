const {getOptions, getargs} = require('./utils')
describe('Unit test for custom report generator', () => {
  describe('Generate output directory', () => {
    test.only('Check process argv is not empty', () => {
      process.argv.push('', '');
      expect(getargs()).toThrow('Missing parameter "-f <filename>" OR -i <json>')
    })

  })

  describe('Generate report using default options', () => {

  })

  describe('Generate report using cmd line options', () => {

  })

  describe('Generate report using file input', () => {

  })
})