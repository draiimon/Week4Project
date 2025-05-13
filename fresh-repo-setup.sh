#!/bin/bash
# Script to set up a fresh repository without the commit history

# 1. Create new directory for the clean project
mkdir -p ~/cleanproject

# 2. Copy everything except .git directory to the new location
rsync -av --exclude=".git" --exclude="node_modules" --exclude=".cache" --exclude="attached_assets" ./ ~/cleanproject/

# 3. Initialize a new git repository in the clean directory
cd ~/cleanproject
git init

# 4. Create and add .gitignore first
cat > .gitignore << 'EOL'
# Local .terraform directories
**/.terraform/*

# .tfstate files
*.tfstate
*.tfstate.*

# Crash log files
crash.log
crash.*.log

# Exclude all .tfvars files, which might contain sensitive data
*.tfvars
*.tfvars.json

# Ignore CLI configuration files
.terraformrc
terraform.rc

# Ignore attached assets
attached_assets/

# Local environment files
.env
*.env.local

# Logs
*.log

# Node modules
node_modules/

# Build directories
dist/
build/

# Cache directories
.cache/
EOL

# 5. Add and commit your files
git add .
git commit -m "Initial commit with clean history"

# 6. Now you can create a new repository on GitHub and link it
echo ""
echo "========================================================"
echo "Your clean repository is ready at: ~/cleanproject"
echo ""
echo "Next steps:"
echo "1. Create a new repository on GitHub"
echo "2. Run the following commands in your clean project:"
echo "   git remote add origin https://github.com/yourusername/new-repo-name.git"
echo "   git push -u origin main"
echo "========================================================"