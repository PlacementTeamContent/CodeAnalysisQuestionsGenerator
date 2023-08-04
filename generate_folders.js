import fs from "fs";

const parent_json_path = "./parent_json";
const prompts_json_path = "./prompts_json";
const responses_json_path = "./responses_json";
const final_responses_path = "./final_responses";
const ca_responses_path = "./ca_responses";
const output_zip_files_path = "./output_zip_files";
const api_responses_path = "./api_responses.json";
const env_path = "./.env";

const createFolder = (folderPath) => {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true, force: true });
    }
}

const createFile = (file_path, content) => {
    fs.writeFile(file_path, content, 'utf8', (err) => {
        if (err) {
            console.error('An error occurred while writing the file:', err);
            return;
        }
        });
}

function start() {
    try {
        createFolder(parent_json_path);
        createFolder(prompts_json_path);
        createFolder(responses_json_path);
        createFolder(final_responses_path);
        createFolder(ca_responses_path);
        createFolder(output_zip_files_path);
        createFile(api_responses_path, "[]")
        createFile(env_path, "")
    } catch (error) {
      console.error("Error during processing:", error);
    }
}
  
start();