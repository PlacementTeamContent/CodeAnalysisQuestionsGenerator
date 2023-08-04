import fs from "fs";
import path from "path";
import { v4 } from "uuid";
import archiver from "archiver";
import readline from "readline";

import dotenv from "dotenv";
dotenv.config();

const parent_json_file_name = process.env.PARENT_JSON_FILE_NAME;
const jsonFilePath = "./ca_responses/" + parent_json_file_name + "_ca.json";
const output_zip_files_path = "./output_zip_files";
const newFolderPath = output_zip_files_path + "/Code Analysis MCQs";
const zipFilePath = "output_zip_files/" + parent_json_file_name + ".zip"; 

// Create the new folder if it doesn't exist
if (!fs.existsSync(newFolderPath)) {
  fs.mkdirSync(newFolderPath, { recursive: true, force: true });
}


// Inputing Unit ID
function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
}

let newFileName = "";
const ans = await askQuestion("Enter your existing Unit ID or type (n) for new ID: ");
if (ans.toLowerCase() === "n") {
  newFileName = v4();
}
else {
  newFileName = ans;
}

const newFilePath = path.join(newFolderPath, newFileName + ".json");

// Copy the JSON file to the new folder
fs.copyFile(jsonFilePath, newFilePath, (err) => {
  if (err) {
    console.error('Error moving JSON file:', err);
  } else {
    console.log('JSON file moved successfully to the new folder.');
  }
});

const output = fs.createWriteStream(zipFilePath);
const archive = archiver('zip', { zlib: { level: 9 } });

// Listen for errors during the archiving process
output.on('error', (err) => {
    console.error('Error creating the zip file:', err);
    if (!fs.existsSync(newFolderPath)) {
        // Removing the Code Analysis MCQs folder
        fs.rmSync(newFolderPath, { recursive: true, force: true });
    }
});

output.on('finish', () => {
    console.log("Json file name (i.e., unit_id): ", newFileName);
    console.log("Common Unit ID: ", v4());
    console.log('Folder has been zipped successfully.');
    // Removing the Code Analysis MCQs folder
    fs.rmSync(newFolderPath, { recursive: true, force: true });
});

output.on('end', () => {
  console.log('Data has been drained.');
});

archive.on('warning', (err) => {
  if (err.code === 'ENOENT') {
    console.warn('Warning:', err);
  } else {
    throw err;
  }
});

archive.on('error', (err) => {
  throw err;
});

// Pipe archive data to the output file
archive.pipe(output);

// Append the entire folder to the archive
archive.directory(newFolderPath, "Code Analysis MCQs");

// Finalize the archive
archive.finalize();
