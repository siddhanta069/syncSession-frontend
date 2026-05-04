export function runCode(code, problem) {
  try {
    const fnMatch = code.match(/function\s+(\w+)/);
    if (!fnMatch) throw new Error("Function not found");

    const functionName = fnMatch[1];

    const wrapped = new Function(`
      ${code}
      return ${functionName};
    `);

    const userFunc = wrapped();

    const results = problem.testCases.map((test, i) => {
      try {
        let output = userFunc(...test.input);

        // for in-place problems
        if (output === undefined) {
          output = test.input[0];
        }

        const passed =
          JSON.stringify(output) === JSON.stringify(test.expected);

        return {
          index: i,
          input: test.input,
          expected: test.expected,
          output,
          passed
        };

      } catch (err) {
        return {
          index: i,
          error: err.message,
          passed: false
        };
      }
    });

    return { success: true, results };

  } catch (err) {
    return { success: false, error: err.message };
  }
}