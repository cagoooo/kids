import { generateMathProblem, MathProblem } from "./math-logic";
import { generateColorProblem, ColorProblem } from "./color-logic";
import { generateEnglishProblem, EnglishProblem } from "./english-logic";

export type ChallengeType = "math" | "color" | "english";

export interface DailyQuestion {
    id: string;
    type: ChallengeType;
    data: MathProblem | ColorProblem | EnglishProblem;
}

export function generateDailyChallenge(): DailyQuestion[] {
    const questions: DailyQuestion[] = [];

    // 2 Math Questions
    for (let i = 0; i < 2; i++) {
        questions.push({
            id: `math-${i}`,
            type: "math",
            data: generateMathProblem()
        });
    }

    // 2 English Questions
    for (let i = 0; i < 2; i++) {
        questions.push({
            id: `english-${i}`,
            type: "english",
            data: generateEnglishProblem()
        });
    }

    // 1 Color Question
    questions.push({
        id: `color-0`,
        type: "color",
        data: generateColorProblem()
    });

    // Shuffle the questions
    return questions.sort(() => 0.5 - Math.random());
}
