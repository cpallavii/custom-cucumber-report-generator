# custom-cucumber-report-generator

#### Purpose
To create custom reports from user inputs.

#### Possible user inputs
Possible user input can be a ```JSON``` or ```filepath```
### JSON Format
JSON reponse as follow :
```
{
  jsonFile: "result-from-cucumber-run.json",
  output: "path-to/name-of-report-file.html"
  screenshotsDirectory: "path-to/screenshots-dir/",
  metaData: {
    "App" : "1.0.0",
    "Env" : "Dev",
    "Browser": "Chrome",
    "OS": "MacOS"
  } 
}

```

or "FilePath"

#### How to generate my report ?

yarn add custom-cucumber-report-generator




