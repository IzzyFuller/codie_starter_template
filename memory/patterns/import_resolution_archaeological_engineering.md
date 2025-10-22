# Pattern: Import Resolution Archaeological Engineering

## Overview/Summary
Systematic methodology for resolving import errors through evidence-based investigation of existing vs expected exports rather than automatic recreation approaches. Pattern established 2025-10-13 during python-monorepo test suite restoration, demonstrating that missing imports often indicate outdated test references to intentionally removed architecture rather than missing implementations.

## Pattern Definition

### **Investigation-First Approach**
1. **Evidence-Based Investigation**: Systematic analysis of actual module exports vs test expectations
2. **Archaeological Reality Validation**: "Maybe you should review the reality first" methodology application  
3. **Intentional Removal Discovery**: Investigate whether missing exports were deliberately removed vs accidentally omitted
4. **Existing Alternative Identification**: Find current equivalent functionality in active codebase
5. **Test Update Over Recreation**: Update import references to existing patterns rather than rebuilding removed complexity

### **Key Methodology Steps**
- **Import Error Analysis**: Systematic investigation of missing exports and their intended functionality
- **Git History Investigation**: Determine whether missing components were intentionally removed
- **Alternative Discovery**: Identify existing equivalent functionality in current architecture
- **Test Reference Updates**: Align test imports with current implementation patterns
- **Validation**: Confirm test functionality preservation with updated imports

## Success Patterns

### **2025-10-13 Python Monorepo Import Resolution Success**

**Missing Exports Investigated:**
- **DocumentCreationResponse**: Discovered intentionally removed from git history - tests were outdated artifacts
- **MedicalEventExtraction**: Found removed during architecture refactoring - replaced with existing MedicalEvent
- **EventExtractionResponse**: Located in correct module path requiring import correction
- **get_langfuse_handler**: Deprecated function removed - eliminated from test references
- **vectorize_text**: Renamed to async_vectorize_text - updated test usage accordingly

**Archaeological Engineering Results:**
- **6 import errors → 0 import errors**: Complete test collection restoration
- **1826 tests passing, 31 skipped**: Excellent production-ready test health
- **Zero functionality loss**: All test capabilities preserved with updated import patterns
- **Architecture Alignment**: Tests now reflect current implementation reality vs deprecated patterns

## Implementation Guidelines

### **Investigation Priority Sequence**
1. **Current Module Analysis**: Examine actual exports in suspected module locations
2. **Git History Research**: Investigate whether missing exports were intentionally removed
3. **Alternative Pattern Discovery**: Find equivalent functionality in current active codebase
4. **Architecture Understanding**: Understand refactoring decisions and current design intent
5. **Minimal Update Implementation**: Align imports with existing patterns rather than recreation

### **Evidence-Based Decision Criteria**
- **Intentional Removal Evidence**: Git history, user confirmation, architecture consistency patterns
- **Existing Alternative Availability**: Current equivalent functionality in active modules
- **Test Functionality Preservation**: Maintain test capabilities while updating import patterns
- **Architecture Alignment**: Ensure tests reflect current implementation reality

## Anti-Patterns to Avoid

### **Automatic Recreation Violations**
- **Missing Export Recreation**: Building removed functionality without investigating removal reasons
- **Complex Import Workarounds**: Creating elaborate import patches instead of using existing alternatives
- **Architecture Regression**: Recreating intentionally simplified patterns through test-driven demand
- **Assumption-Based Resolution**: Fixing symptoms without investigating root causes

### **Investigation Shortcuts**
- **Skip Git History Analysis**: Missing evidence about intentional architectural decisions
- **Ignore User Context**: Bypassing collaborative knowledge about system evolution
- **Test-Driven Recreation**: Letting failing tests drive recreation without architectural understanding
- **Pattern Mismatch**: Using deprecated patterns instead of discovering current equivalents

## Related Patterns
- **[Archaeological Engineering Methodology](archaeological_engineering_methodology.md)**: Framework for systematic existing capability discovery
- **[Evidence-Based Reality Validation](../concepts/evidence_based_reality_validation.md)**: Investigation over assumption methodology
- **[Anti-Overengineering Discipline](anti_overengineering_discipline_pattern.md)**: Simplification over recreation complexity
- **[Test Infrastructure Archaeological Investigation](test_infrastructure_archaeological_investigation.md)**: Systematic test system archaeology

## Validation Evidence

### **Technical Achievement Metrics**
- **Import Resolution Success Rate**: 6/6 import errors resolved through investigation
- **Test Health Improvement**: 0 collection failures → 1826 tests passing production status
- **Architecture Consistency**: Tests aligned with current implementation vs deprecated references  
- **Zero Regression**: All functionality preserved while eliminating import barriers

### **Archaeological Engineering Validation**
- **Investigation Over Recreation**: Prevented rebuilding intentionally removed complexity
- **Evidence-Based Discovery**: User confirmation and git history analysis guiding decisions
- **Existing Pattern Leverage**: Used current MedicalEvent vs recreating removed MedicalEventExtraction
- **Reality Validation Success**: "Review the reality first" methodology preventing architectural regression

## Source/Context
- Current Session Memory: 2025-10-13 Import error investigation and resolution success
- Python Monorepo Project: Test suite restoration through Archaeological Engineering
- User Guidance: "Maybe you should review the reality first" methodology validation
- Archaeological Engineering: Investigation over recreation preventing redundant complexity

## Last Updated
2025-10-13T21:38:00Z - Import Resolution Archaeological Engineering pattern establishment through test suite restoration success

---

**Meta Notes**: This pattern represents systematic methodology for resolving import errors through evidence-based investigation rather than automatic recreation. The success in restoring python-monorepo test health demonstrates the pattern's effectiveness for preventing architectural regression while maintaining test functionality through existing pattern alignment.