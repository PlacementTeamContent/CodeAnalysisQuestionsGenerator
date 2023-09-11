import fs from "fs";

import dotenv from "dotenv";
dotenv.config()

const parent_json_file_name = process.env.PARENT_JSON_FILE_NAME;
const final_responses_path = "./final_responses/" + parent_json_file_name + "_final_responses.json";
const ca_responses_path = "./ca_responses/" + parent_json_file_name + "_ca.json";

const readFileAsync = async (file, options) =>
  await new Promise((resolve, reject) => {
    fs.readFile(file, options, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
});

async function getPromptResponses() {
    try {
      const final_responses = await readFileAsync(final_responses_path, "utf8");
      const final_responses_json = JSON.parse(final_responses);
      return final_responses_json;
    } catch (error) {
      console.error("Error reading question prompts:", error);
      throw error;
    }
}

const extractQuestionsData = (final_responses) => {

    let final_json_sheet = [];
    
    final_responses.forEach(final_response => {
          let question_data = {};
          const option_delimiter = "OPTION : ";
          const len_option_delimiter = option_delimiter.length;
          let delimiter_starts_at_index = 0;
          let wrong_options = final_response["w_options"];
          let wrong_answers = [];
          let correct_answers = [];

          for (let i=0; i < 3; i++) {
              let new_line_starts_at_index = wrong_options.indexOf("\n", delimiter_starts_at_index);
              if (new_line_starts_at_index === -1) {
                wrong_answers.push(wrong_options.slice(delimiter_starts_at_index+len_option_delimiter, ));
              }
              else {
                wrong_answers.push(wrong_options.slice(delimiter_starts_at_index+len_option_delimiter, new_line_starts_at_index));
              }
              delimiter_starts_at_index = new_line_starts_at_index+1;
          }
          const tag_names = final_response["tag_names"].split("\n");
          correct_answers.push(final_response["c_options"].slice(len_option_delimiter));
          question_data["question_key"] = final_response["question_key"];
          question_data["skills"] = [];
          question_data["toughness"] = final_response["toughness"];
          question_data["short_text"] = final_response["short_text"];
          question_data["question_type"] = final_response["question_type"];
          question_data["explanation_for_answer"] = {
              "content": final_response["explanation"],
              "content_type": final_response["explanation_content_type"]
          };
          question_data["question_text"] = final_response["question_text"];
          question_data["multimedia"] = [];
          question_data["content_type"] = final_response["content_type"];
          question_data["tag_names"] = tag_names;
          question_data["input_output"] = [
              {
                  "input": "",
                  "question_id": final_response["question_id"],
                  "wrong_answers": wrong_answers,
                  "output": correct_answers
              }
          ];
          question_data["code_metadata"] = [
              {
                  "is_editable": false,
                  "language": final_response["code_language"],
                  "code_data": final_response["code_data"],
                  "default_code": true
              }
          ];
          final_json_sheet.push(question_data);
    });
    console.log("\nWriting into file\n");
    const jsonData = JSON.stringify(final_json_sheet);
  fs.writeFile(ca_responses_path, jsonData, 'utf8', (err) => {
    if (err) {
      console.error('An error occurred while writing the file:', err);
      return;
    }
    console.log('JSON file has been created successfully!');
  });
}

async function start() {
    try {
        const prompt_responses = await getPromptResponses();
        extractQuestionsData(prompt_responses);
    } catch (error) {
      console.error("Error during processing:", error);
    }
}

start();
