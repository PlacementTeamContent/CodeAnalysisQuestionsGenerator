import { Configuration, OpenAIApi } from "openai";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config()

const parent_json_file_name = process.env.PARENT_JSON_FILE_NAME;
const prompts_file_name = parent_json_file_name + "_prompts.json";
const questions_prompts_path = "./prompts_json/" + prompts_file_name;
const questions_response_path = "./responses_json/" + parent_json_file_name + "_responses.json";
const api_responses_path = "./api_responses.json";

fs.writeFile(questions_response_path, "[]", 'utf8', (err) => {
  if (err) {
    console.error('An error occurred while writing the file:', err);
    return;
  }
});

const configuration = new Configuration({
  apiKey: process.env.API_KEY,
});

const openai = new OpenAIApi(configuration);

const fileLocks = {};

function lockFile(file) {
  if (!fileLocks[file]) {
    fileLocks[file] = new Promise((resolve) => resolve());
  }
}

function unlockFile(file) {
  if (fileLocks[file]) {
    delete fileLocks[file];
  }
}

async function withFileLock(file, callback) {
  lockFile(file);
  try {
    await fileLocks[file];
    const result = await callback();
    unlockFile(file);
    return result;
  } catch (error) {
    console.error(`Error in withFileLock for ${file}:`, error);
    unlockFile(file);
    throw error;
  }
}

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

const writeFileAsync = async (file, data, options) =>
  await new Promise((resolve, reject) => {
    fs.writeFile(file, data, options, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });

async function saveResponseToFile(file_path, response) {
  try {
    await withFileLock(file_path, async () => {
      const fileData = await readFileAsync(file_path, "utf8");
      const data = JSON.parse(fileData);
      data.push(response);
      console.log(`\nWriting to ${file_path}`);
      await writeFileAsync(file_path, JSON.stringify(data));
      console.log(`Written into ${file_path}\n`);
    });

  } catch (error) {
    console.error("Error reading or writing to file:", error);
  }
}

async function getQuestionPrompts() {
  try {
    const questions_prompts = await readFileAsync(questions_prompts_path, "utf8");
    const questions_prompts_json = JSON.parse(questions_prompts);
    return questions_prompts_json;
  } catch (error) {
    console.error("Error reading question prompts:", error);
    throw error;
  }
}

function getMessages(questions_prompts_json) {
  let messages = [];

  questions_prompts_json.forEach((questionObj) => {
    let messageObj = {
      role: "user",
      content: questionObj["prompt"],
    };
    messages.push(messageObj);
  });
  return messages;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getGPTResponse(message, question_prompt) {
  
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [message],
      temperature: 0,
      max_tokens: 4000,
    });

    const api_response = response.data;

    saveResponseToFile(api_responses_path, api_response);

    const question_response_obj = {
      ...question_prompt,
      prompt_response: api_response.choices[0].message.content,
    };

    saveResponseToFile(
      questions_response_path,
      question_response_obj
    );

    console.log("--------------------------------------------");
  } catch (error) {
    console.error("Error while processing message:", error.message);

    saveResponseToFile(
      api_responses_path,
      { error: error.message }
    );

    const error_response_obj = {
      ...question_prompt,
      prompt_response: `Error: ${error.message}`,
    };

    saveResponseToFile(
      questions_response_path,
      error_response_obj
    );
  }
}

async function start() {
  try {
    const question_prompts = await getQuestionPrompts();
    const messages = getMessages(question_prompts);

    messages.reduce((acc, message, index) => {
      return acc.then(() => {
        return getGPTResponse(message, question_prompts[index]);
      });
    }, Promise.resolve());
  } catch (error) {
    console.error("Error during processing:", error);
  }
}

start();
