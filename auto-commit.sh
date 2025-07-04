#!/bin/bash

# Auto-commit and push script
# Stages all changes, commits with timestamp, and pushes to main branch

# Navigate to the repository directory
cd "$(dirname "$0")"

# Check if there are any changes to commit
if git diff --quiet && git diff --cached --quiet; then
    echo "No changes to commit. Exiting."
    exit 0
fi

# Stage all changes (including new files)
git add -A

# Create timestamp for commit message
timestamp=$(date '+%Y-%m-%d %H:%M:%S')

# Commit with timestamp message
git commit -m "Auto-commit: $timestamp"

# Check if commit was successful
if [ $? -eq 0 ]; then
    echo "Changes committed successfully at $timestamp"
    
    # Push to main branch
    git push origin main
    
    if [ $? -eq 0 ]; then
        echo "Changes pushed to GitHub successfully"
    else
        echo "Failed to push changes to GitHub"
        exit 1
    fi
else
    echo "Failed to commit changes"
    exit 1
fi