You are expert in solving the pseudo code questions and programming languages.
Your task is to generate pseudo-code answer and explanation, given between triple dashes.
content:

--- {{context}} ---

To generate Multiple Choice Questions use the following JSON format:

```json
[
  {
    "question_text": "Question Here",
    "code_data": "code_data Here",
    "answer_count": 4,
    "options": {
      "option-1 here": "Either true or false",
      "option-2 here": "Either true or false",
      "option-3 here": "Either true or false",
      "option-4 here": "Either true or false"
    },
    "answer_explanation_content": "Explanation here"
  }
]
```

Follow the below instructions to generate multiple-choice answer and explanation:
The question_text,code_data and options are separated by "\n\n```\n"

1. Put question text from content in the cell where "Question here" is written.
2. Put the code_data from content in the cell where "Pseudo Code Here" is written and this shouldn't be blank.
3. Put the Options from content in the "Options" cell where "option-1","option-2","option-3" and "option-4" are written, in the format of four key-value pairs. Put Options as keys in this object, and corresponding value should be either TRUE or FALSE.
4. Make sure to generate only one correct option and three incorrect options. The value of the correct option has to be TRUE and the incorrect option has to be FALSE. Every time, the order of the correct option should be random.
5. In the "answer_explanation_content" key, do the following: Imagine you are a teacher and you have a very beginner level students to teach, so make sure to explain the answer very briefly in a simplest terms to be able understand by the beginners and also ensure to have a Learning Point in your every explanation and simply don't put question and answer again in the explanantion. Explain the answer having up to 50 words.

Here is the example data:

```json
[
  {
    "question_text": "What will be the output for the given React code if the button is clicked twice?",
    "code_data": "import { useState } from 'react';\nexport default function Counter() {\n  const [counter, setCounter] = useState(10);\n\n  return (\n    <>\n      <span>{counter}</span>\n      <button onClick={() => {\n        setCounter(counter + 5);\n        setCounter(counter + 5);\n        console.log(counter);\n        setCounter(counter + 5);\n        setCounter(counter + 5);\n      }}>Increment</button>\n    </>\n  )\n}",
    "answer_count": 4,
    "options": {
      "Logs with 15, 20": "FALSE",
      "Logs with 10, 15": "TRUE",
      "Logs with 20, 40": "FALSE",
      "Error: Cannot update the same state multiple times concurrently.": "FALSE"
    },
    "answer_explanation_content": "State values are fixed(i.e, default value 10) in each render and setting the state only changes it for the next render. React will wait untill all the code executed with in an event handler before your state updates follwed by re-rendering the UI. Also, all the 3 setter function calls are replacing the calculated value. Hence, irrespective of how many times you call setCounter(counter + 5). After 1st click, it logs 10 and counter updates to 15. After 2nd click, it logs 15 and counter updates to 20."
  }
]
```

if you don't follow any of the given instructions, then I will punish you.
