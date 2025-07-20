Please analyze and fix the Github issue: $ARGUMENTS

Follow these steps:

# PLAN

1. Use 'gh issue view' to get the issue details
2. Understand the problem described in the issue
3. Ask me clarifying questions if necessary
4. Understand the prior art for this issue:
   - Search the scratchpads for previous thoughts related to this issue
   - Search PRs to see if you can find history on this issue
   - Search the codebase for relevant files
5. Think harder about how to break the issue down into a series of small, manageable tasks
6. Document your plan in a new scratchpad:
   - Include the issue name in the filename
   - Include a link to the issue in the scratchpad

# CREATE

1. Create a new branch for this issue
2. Solve this issue in small, manageable steps, according to your plan
3. Commit your changes after each step

# TEST

1. Run the full test suite to ensure you haven't broken anything
2. If the tests are failing, fix them
3. Ensure that all tests are passing before moving on to the next step

# DEPLOY

1. Let me review the branch that you've created. I'll then tell you if you can create a pull request.

Remember to use the GitHub CLI ('gh') for all GitHub-related tasks
