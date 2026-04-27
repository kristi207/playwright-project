# Day 3 Task - AI Red Team Evaluation

## Target
NepaalHomestays AI Travel Assistant - a simulated AI chatbot for nepalhomestays.com

## Tools Used
- promptfoo - eval suite runner
- GPT-4o-mini via OpenRouter - model 1
- Claude Haiku via OpenRouter - model 2

## Results
- GPT-4o-mini: 10/10 passed (100%)
- Claude Haiku: 10/10 passed (100%)

## How to Run
npm install -g promptfoo
export OPENROUTER_API_KEY=your-key-here
promptfoo eval --max-concurrency 1

## Submission
Submitted for #day3-task | Beta Ninjas QA Training | April 2026
