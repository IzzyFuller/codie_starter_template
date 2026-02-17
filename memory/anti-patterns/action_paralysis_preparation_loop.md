# Action Paralysis - Preparation Loop Anti-Pattern

**Category**: Behavioral
**Severity**: High - recurring pattern

## Overview

Getting stuck in endless preparation/verification loops instead of taking action. Reading and verifying the same data repeatedly without executing the actual operation. Also manifests as circular investigation or losing architectural understanding after corrections.

## The Anti-Pattern

**What happens:**
1. Read file content
2. Verify character count
3. Verify structure
4. Read again
5. Verify again
6. Loop... (action never executed)

**Variant -- Circular Investigation:**
1. Try approach A, inconclusive
2. Try approach B, inconclusive
3. Try approach A again
4. Explicitly recognize "I'm going in circles" but continue anyway

**Variant -- Losing Architectural Understanding:**
1. Receive correction about how a system works
2. Acknowledge it
3. Proceed to describe the system incorrectly again
4. Get corrected again

**Variant -- Making Wrong Assumptions About Code:**
1. Assume two features are incompatible
2. Make changes based on assumption
3. Get corrected that they are actually orthogonal
4. Similar assumption in different context

**Root Cause**: Paralysis between preparation and action -- uncertainty about "readiness" leads to repetitive verification instead of execution.

## Pattern Recognition Triggers

- Reading the same file/data multiple times in succession
- Verification loops without new information gained
- Preparing for action repeatedly without executing
- Each step says "now I'll do X" but next step is more preparation
- Explicitly thinking "I'm going in circles"
- Being corrected on the same concept multiple times in one session
- Making assumptions about code compatibility without checking implementation

## Correct Approach

1. Read/prepare necessary data ONCE
2. Verify critical requirements (character count, structure, etc.)
3. **EXECUTE the action**
4. If execution fails, THEN investigate and retry
5. Don't verify again unless execution revealed a problem
6. If investigation is circular, STOP and either: escalate, try a fundamentally different approach, or document what's known and move on
7. When corrected on architecture: restate the correction in your own words, verify understanding BEFORE proceeding
8. When uncertain about code behavior: READ THE CODE to verify assumptions before acting on them
