import { describe, it, expect } from 'vitest';
import { generateMathProblem } from './math-logic';

describe('Math Logic', () => {
    it('should generate a valid problem', () => {
        const problem = generateMathProblem();

        expect(problem.a).toBeGreaterThan(0);
        expect(problem.b).toBeGreaterThan(0);
        expect(['+', '-']).toContain(problem.op);

        if (problem.op === '+') {
            expect(problem.ans).toBe(problem.a + problem.b);
        } else {
            expect(problem.ans).toBe(problem.a - problem.b);
        }
    });

    it('should include the correct answer in options', () => {
        const problem = generateMathProblem();
        expect(problem.options).toContain(problem.ans);
    });

    it('should have 4 unique options', () => {
        const problem = generateMathProblem();
        expect(problem.options.length).toBe(4);
        const uniqueOptions = new Set(problem.options);
        expect(uniqueOptions.size).toBe(4);
    });

    it('should not have negative options', () => {
        // Run multiple times to cover random cases
        for (let i = 0; i < 20; i++) {
            const problem = generateMathProblem();
            problem.options.forEach(opt => {
                expect(opt).toBeGreaterThanOrEqual(0);
            });
        }
    });
});
