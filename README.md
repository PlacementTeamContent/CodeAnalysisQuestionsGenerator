<<<<<<< HEAD
# CodeAnalysisQuestionsGenerator
=======
### Initialization
Installation of nodeJs software from [node](https://nodejs.org/en/download)
Open this directory in terminal and run `npm install`
Run the following command in terminal: ` node generate_folders.js `

### Pre-requisities
- After downloading your csv file from your spreadsheet, convert your csv into json file [csv_to_json](https://data.page/csv/json)

### Conditions
- Topic Names to be given as per following convention only:
for JavaScript - JS
for Java       - JAVA
for SQL        - SQL
for ReactJS    - REACT
for NodeJS     - NODE
for HTML       - HTML
for CSS        - CSS

### Steps
Step-1:- Now save your obtained json file in **parent_json** directory.
Step-2:- Replace **parent_json_file_name** variable in .env file
Step-3:- Run the following command in terminal: ` node generate_prompts.js `
Step-4:- Run the following command in terminal: ` node generate_responses.js `
Step-5:- Run the following command in terminal: ` node generate_final.js `
Step-6:- Run the following command in terminal: ` node generate_ca.js `
Step-7:- Run the following command in terminal: ` node generate_zip.js `

### Results
- Now you can find your intermediate output file in **responses_json** directory with suffix as "_res8onses.json" file.
- Now you can find your json for Review SHeet file in **final_responses** directory with suffix as "_final_responses.json" file.
- Now you can find your final output json file in **ca_responses** directory with suffix as "_ca.json" file.
- Now you can directly find your final zip file in **output_zip_files** directory, which is ready for JSON Conversion at Admin panel.

### Post-Works
- Now convert your json into csv file [json_to_csv](https://data.page/json/csv) for Step-4 & 5
- Store the csv file (mentioned in Step-4) into **Prompts & Responses (csv)** folder in g-drive.
- Store the csv file (mentioned in Step-5) into **Curation** folder as **SHEET_1** in g-drive.
>>>>>>> db3b9c9 (first commit)
