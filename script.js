// dependencies
const { OpenAI } = require('langchain/llms/openai');
const { PromptTemplate } = require("langchain/prompts");
const { StructuredOutputParser } = require("langchain/output_parsers");
const inquirer = require('inquirer');
require('dotenv').config();

// Creates and stores a wrapper for the OpenAI package along with basic configuration
const model = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY, 
  temperature: 0,
  model: 'gpt-3.5-turbo'
});

const parser = StructuredOutputParser.fromNamesAndDescriptions({
  code: "Javascript code that answers the user's question",
  explanation: "detailed explanation of the example code provided",
});

const formatInstructions = parser.getFormatInstructions();


// console.log({model});

const promptFunc = async (input) => {
  try {
    const prompt = new PromptTemplate({
      template: "You are a javascript expert and will answer the user's coding questions thoroughly as possible.\n{format_instructions}\n{question}",
      inputVariables: ["question"],
      partialVariables: { format_instructions: formatInstructions }
    });

    const res = await model.call(input);

    if (!res || typeof res !== 'object') {
      console.error("Invalid API response:", res);
      return;
    }

    const promptInput = await prompt.format({
      question: input
    });
    
    // console.log(res);
    console.log(await parser.parse(res));
  }
  catch (err) {
    console.error("Error in promptFunc:", err);
  }
};

// const promptFunc = async (input) => {
//   try {
//     const prompt = new PromptTemplate({
//       template: "You are a javascript expert and will answer the user’s coding questions thoroughly as possible.\n{format_instructions}\n{question}",
//       inputVariables: ["question"],
//       partialVariables: { format_instructions: formatInstructions }
//     });

//     const res = await model.call(input);

//     const promptInput = await prompt.format({
//       question: input
//     });
    
//     // console.log(res);
//     console.log(await parser.parse(res));
//   }
//   catch (err) {
//     console.error("Error in promptFunc:", err);
//   }

// };

const init = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Ask a coding question:',
    },
  ]).then((inquirerResponse) => {
    promptFunc(inquirerResponse.name)
  });
};


init();

