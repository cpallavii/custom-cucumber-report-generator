import os
import re
def scan_cucumber_repo(directory):
    # Define regular expressions for pass and fail scenarios
    pass_regex = re.compile(r'Scenario:\s*(.*)\s*\n.*\n.*\n.*\n.*\n.*\n\s*(\d+) steps?\s*\n\s*1 scenario?\s*\n\s*PASSED')
    fail_regex = re.compile(r'Scenario:\s*(.*)\s*\n.*\n.*\n.*\n.*\n.*\n\s*(\d+) steps?\s*\n\s*1 scenario?\s*\n\s*FAILED')
    # Iterate over files in the directory
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith(".txt"):  # Assuming Cucumber outputs are in text files
                file_path = os.path.join(root, file)
                with open(file_path, 'r') as f:
                    content = f.read()
                    pass_matches = pass_regex.findall(content)
                    fail_matches = fail_regex.findall(content)
                    print(f"Results from {file_path}:")
                    print("Passed scenarios:")
                    for match in pass_matches:
                        scenario_name, steps_count = match
                        print(f"- {scenario_name} ({steps_count} steps)")
                    print("Failed scenarios:")
                    for match in fail_matches:
                        scenario_name, steps_count = match
                        print(f"- {scenario_name} ({steps_count} steps)")
                    print()
# Specify the directory containing Cucumber output files
cucumber_directory = "path/to/cucumber/repo"
# Scan the Cucumber repository
scan_cucumber_repo(cucumber_directory)
