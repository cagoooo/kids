export interface MathProblem {
    a: number;
    b: number;
    op: '+' | '-';
    ans: number;
    options: number[];
}

export function generateMathProblem(): MathProblem {
    const isAddition = Math.random() > 0.3; // 70% addition, 30% subtraction
    let a, b, ans, op: '+' | '-';

    if (isAddition) {
        a = Math.floor(Math.random() * 10) + 1;
        b = Math.floor(Math.random() * 10) + 1;
        ans = a + b;
        op = '+';
    } else {
        a = Math.floor(Math.random() * 10) + 5;
        b = Math.floor(Math.random() * 5) + 1;
        ans = a - b;
        op = '-';
    }

    // Generate options
    const opts = new Set<number>();
    opts.add(ans);
    while (opts.size < 4) {
        const wrong: number = ans + Math.floor(Math.random() * 6) - 3; // Answer +/- 3
        if (wrong >= 0 && wrong !== ans) opts.add(wrong);
    }

    const options = Array.from(opts).sort(() => 0.5 - Math.random());

    return { a, b, op, ans, options };
}
