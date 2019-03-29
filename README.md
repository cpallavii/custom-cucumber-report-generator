# custom-cucumber-report-generator

#### Purpose
To create custom reports from user inputs.

#### How to generate my report ?

### Requirement
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

