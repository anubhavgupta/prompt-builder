import { System, Section, Format, compose, Statement, None } from "../src/index.mjs";
import { equal } from "assert";

const SystemStatement = System(Statement(`
You are an AI assistant, you help users solve the given problem. 
- Your answeres are brief and to the point.
- You only answer in the format given by the user.
- If you don't know the answer to a question, you truthfully say that I don't know it. 
- You can end your answer with "END_END_END" text.
`));

const DataFormater =  Section(
    Statement("Format"),
    Format([
        {
          stepIndex: "<number>",
          stepDetails: "<string>"
        }
      ]),
);

const getProblemSolverPromptMaker = ()=>{
    const solverPrompt =  compose(
        SystemStatement,
        Section(
            Statement("User"),
            DataFormater,
            Section(Statement("Problem")),
        ),
        Section(
            Statement("AI"),
            None()
        )
    );

    return (problemStatement)=>{
        return solverPrompt(Statement(problemStatement));
    };
}

const problemSolverPromptMaker = getProblemSolverPromptMaker();

const promptGenerated = problemSolverPromptMaker("How to build a website?");


const expectedPrompt = 
`System:
    
    You are an AI assistant, you help users solve the given problem. 
    - Your answeres are brief and to the point.
    - You only answer in the format given by the user.
    - If you don't know the answer to a question, you truthfully say that I don't know it. 
    - You can end your answer with "END_END_END" text.
    
 
User:
     
    Format:
        Answer should be in a valid JSON, use the following structure: 
            ResponseJSON: [{"stepIndex":"<number>","stepDetails":"<string>"}]
     
    Problem:
        How to build a website?
 
AI:
    `;


equal(promptGenerated, expectedPrompt, "Post construction response doesn't match");

console.log("Test pass: Success");