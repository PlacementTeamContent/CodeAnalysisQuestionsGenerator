import fs from "fs";
import { v4 } from "uuid";

import dotenv from "dotenv";
dotenv.config()

const parent_json_file_name = process.env.PARENT_JSON_FILE_NAME;
const questions_response_path = "./responses_json/" + parent_json_file_name + "_responses.json";
const final_responses_path = "./final_responses/" + parent_json_file_name + "_final_responses.json";

const readFileAsync = async (file, options) =>
  await new Promise((resolve, reject) => {
    fs.readFile(file, options, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  }
);

async function getPromptResponses() {
    try {
      const questions_prompts = await readFileAsync(questions_response_path, "utf8");
      const questions_prompts_json = JSON.parse(questions_prompts);
      return questions_prompts_json;
    } catch (error) {
      console.error("Error reading question prompts:", error);
      throw error;
    }
}

const extractQuestionsData = (prompt_responses) => {

    let final_json_sheet = [];
    
    prompt_responses.forEach((prompt_response, index) => {
        let tagNames = "";
        const language_obj = {
          "REACT": "NODE_JS",
          "JS": "NODE_JS",
          "NODE": "NODE_JS",
          "PYTHON": "PYTHON",
          "JAVA": "JAVA",
          "HTML": "HTML",
          "CSS": "CSS"
        };
        const topic = prompt_response["topic"].toUpperCase();
        const parent_sub_topic = prompt_response["parent_sub_topic"].toUpperCase();
        const startIndex = prompt_response["prompt_response"].indexOf("[");
        const endIndex = prompt_response["prompt_response"].lastIndexOf("]");
        const prompt_response_json = JSON.parse(prompt_response["prompt_response"].slice(startIndex, endIndex+1));
        const poolTag="POOL_1";
        tagNames=poolTag +"\n";
        const topicTag = "TOPIC_" + topic + "_CODING_ANALYSIS";
        tagNames = topicTag + "\n";
        const subTopicTag = "SUB_TOPIC_" + parent_sub_topic.replaceAll(" ", "_") + "_CODING_ANALYSIS";
        tagNames += subTopicTag+"\n";
        const difficultyTag="DIFFICULTY_XXXX";
        tagNames+=difficultyTag+"\n";
        const sourceTag = "SOURCE_CODING_ANALYSIS_" + prompt_response["resource"].toUpperCase()+"_ASSESSMENT";
        tagNames+=sourceTag+"\n";
        const offlineTag="IN_OFFLINE_EXAM";
        tagNames+=offlineTag;
        prompt_response_json.forEach(response => {
            let question_data = {};
            let wrong_options = "";
            let correct_option = "";

            Object.keys(response["options"]).forEach(option => {
                if (response["options"][option] === "FALSE") {
                    if (wrong_options) {
                        wrong_options += "\n";
                    }
                    wrong_options += "OPTION : " + option;
                }
                else {
                    correct_option = "OPTION : " + option;
                }
            });
            
            question_data["question_id"] = v4();
            question_data["question_type"] = "CODE_ANALYSIS_MULTIPLE_CHOICE";
            question_data["short_text"] = "";
            question_data["question_text"] = response["question_text"];
            question_data["question_key"] = index;
            question_data["content_type"] = "HTML";
            question_data["multimedia_count"] = 0;
            question_data["multimedia_format"] = "";
            question_data["multimedia_url"] = "";
            question_data["thumbnail_url"] = "";
            question_data["tag_names"] = tagNames;
            question_data["c_options"] = correct_option;
            question_data["w_options"] = wrong_options;
            question_data["options_content_type"] = "TEXT";
            question_data["code_data"] = response["code_data"];
            question_data["code_language"] = language_obj[topic];
            question_data["explanation"] = response["answer_explanation_content"];
            question_data["explanation_content_type"] = "MARKDOWN";
            question_data["toughness"] = "XXXX";
            final_json_sheet.push(question_data);
        });
    });
    console.log("\nWriting into file\n");
    const jsonData = JSON.stringify(final_json_sheet);
  fs.writeFile(final_responses_path, jsonData, 'utf8', (err) => {
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
