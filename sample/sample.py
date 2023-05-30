import json

 

def scan_cucumber_report(report_path):
    with open(report_path, 'r') as file:
        report_data = json.load(file)

 

        # Get the scenarios from the report
        scenarios = report_data['scenarios']

 

        # List to store failed scenarios
        failed_scenarios = []

 

        # Iterate over each scenario
        for scenario in scenarios:
            # Get the status of the scenario
            status = scenario['status']

 

            # Check if the scenario failed
            if status == 'failed':
                # Append failed scenario to the list
                failed_scenarios.append(scenario)

 

        # Generate cucumber-json format for failed scenarios
        cucumber_json = {
            'version': 1,
            'features': [
                {
                    'uri': '',
                    'elements': failed_scenarios
                }
            ]
        }

 

        # Print the cucumber-json failed scenarios
        print(json.dumps(cucumber_json, indent=2))

 

# Provide the path to the cucumber report JSON file
report_path = 'path/to/your/cucumber_report.json'

 

# Call the function to scan the cucumber report
scan_cucumber_report(report_path)
