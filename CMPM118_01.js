import 'dotenv/config';

// Your key is now available as:
// process.env.BAYLEAF_API_KEY
import { ChatOpenAI } from "@langchain/openai";  

const model = new ChatOpenAI({  
    model: "openrouter:z-ai/glm-5.3-flash",  
    apiKey: process.env.BAYLEAF_API_KEY,  
    configuration: { baseURL: "https://api.bayleaf.dev/v1" }, 
}); 

const response = await model.invoke("Which is better, chunky or creamy peanut butter?");
console.log(response.content);




// Step 1: Generate something
const step1 = await model.invoke("Name a famous unsolved mystery in science.");

// Step 2: Use that response as input for the next call
const step2 = await model.invoke(
    `Here is a famous unsolved mystery: "${step1.content}". 
     Explain why it has been so difficult to solve, in 3 bullet points.`
);

console.log("Mystery:", step1.content);
console.log("Why it's unsolved:", step2.content);




// Step 1: Ask the model to plan the task
const planResponse = await model.invoke(
    `You are a helpful assistant. A user wants to write a short children's story.
     Produce a JSON array of 3-5 story steps. Respond ONLY with valid JSON,
     no explanation. Example format:
     ["Introduce the main character", "Describe the problem", ...]`
);

// Step 2: Parse the plan
const steps = JSON.parse(planResponse.content);
console.log("Plan:", steps);

// Step 3: Execute each step
const results = [];
for (const step of steps) {
    const result = await model.invoke(
        `Write one paragraph for this part of a children's story: ${step}`
    );
    results.push(result.content);
}

// Step 4: Combine into a final result
console.log("\nFull story:\n", results.join("\n\n"));