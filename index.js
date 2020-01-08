#!/usr/bin/env node

let {getOptions, generateReport} = require('./utils')
   
 var userOptions = getOptions()
generateReport(userOptions)

