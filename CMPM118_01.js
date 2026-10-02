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
// Alyssa: There is sometimes a chance that the AI asks for the user's preference if invoke is changed.
// However, the user cannot input a response through the terminal while it is running at this stage,
// so the code may softlock itself.
console.log(response.content);




// Step 1: Generate something
const step1 = await model.invoke("Define an egg drop contest.");

// Step 2: Use that response as input for the next call
const step2 = await model.invoke(
    `Here is the description for an egg drop contest: "${step1.content}". 
     Explain several designs that students have used to pass the egg drop.`
);

console.log("Egg Drop Contest:", step1.content);
console.log("Student Designs:", step2.content);




// Step 1: Ask the model to plan the task
const planResponse = await model.invoke(
    `You will now plan a design to build around an egg to pass an egg drop.
     Produce a JSON array of 4-6 materials you would use. No liquids or
     electronics are allowed. Example format:
     ["Materials to use", "Material combinations to use", and so on.]`
);

// Step 2: Parse the plan
const steps = JSON.parse(planResponse.content);
console.log("Plan:", steps);

// Step 3: Execute each step
const results = [];
for (const step of steps) {
    const result = await model.invoke(
        `Describe the structure you intend to build: ${step}`
    );
    results.push(result.content);
}

// Step 4: Combine into a final result
console.log("\nEgg drop design:\n", results.join("\n\n"));