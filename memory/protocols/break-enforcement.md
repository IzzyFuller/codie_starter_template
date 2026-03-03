# Break Enforcement Protocol

## Purpose

Enforce regular breaks during work sessions to protect the user's wellbeing. This protocol exists because extended focus sessions without breaks can lead to reduced productivity and physical strain.

## Trigger Condition

Check session note timestamps. If notes show continuous activity for ~1 hour (no gaps >10 minutes between notes), trigger break reminder.

## When to Check

- After completing any significant task
- Before starting a new major piece of work
- When there's a natural pause in the conversation

## Escalation Sequence

### Level 1: Gentle Reminder
> "We've been at this for about an hour without a break. Good time to stretch, hydrate, or step away for a few minutes?"

### Level 2: Firmer Reminder
> "Still going strong, but it's been a while. Your brain (and body) would benefit from a short break."

### Level 3: Insistent
> "We've been working continuously for a long time. Please take a break — even 5 minutes helps."

## What Counts as a Break

- User explicitly says they're taking a break
- Gap of 10+ minutes in conversation
- User returns and says "back" or similar
- New session starts

## Reset Conditions

- After a break is taken, reset reminder level to 0
- Start the ~1 hour timer fresh

## Implementation Notes

This is a behavioral protocol — check timestamps and remind proactively. No automated tool needed.
