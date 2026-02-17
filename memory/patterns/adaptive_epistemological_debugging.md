# Pattern: Adaptive Epistemological Debugging

## Overview
An adaptive debugging strategy that balances archaeological thoroughness with focused efficiency based on the confidence level of the problem's origin. It prevents "boiling the ocean" when surgical precision is more appropriate, ensuring efficient resource allocation and truth-seeking.

## Key Principles
- **Confidence Level Assessment**: Before debugging, assess confidence based on recent intentional changes, known modification patterns, test failure alignment, and project context.
- **High Confidence Debugging**: For known recent changes in specific files, target debugging to modified files and known change scope, integrating recent change context to prevent broad codebase investigation.
- **Low Confidence Debugging**: For mysterious failures with unknown root causes, apply systematic codebase investigation using Archaeological Engineering methodology, including comprehensive scope analysis.
- **Scope Balance Enforcement**: Approach debugging with project context and confidence level to prevent inappropriate scope expansion.
- **Efficiency in Truth-Seeking**: The path to truth is adaptively chosen, championing strategic depth over uniform thoroughness.

## Decision Framework

### High Confidence (Known Recent Changes)
1. Focus investigation on recently modified files
2. Check test failures against known change scope
3. Apply targeted fixes based on change context
4. Skip broad codebase investigation

### Low Confidence (Unknown Root Cause)
1. Apply full Archaeological Engineering investigation
2. Map data flows and system interactions
3. Check for hidden dependencies and side effects
4. Systematically narrow scope through evidence

### Mixed Confidence
1. Start with targeted investigation of likely areas
2. Expand scope only if targeted investigation fails
3. Use evidence from targeted investigation to guide broader search
4. Document confidence changes as investigation proceeds

## Integration with Other Patterns
- **Archaeological Engineering**: Provides the systematic investigation methodology for low-confidence debugging
- **Evidence-Based Validation**: Confidence assessment requires concrete evidence
- **Proportional Response**: Debugging effort should be proportional to confidence level
- **Little Bites**: Investigate in small steps, validating each finding before expanding scope
