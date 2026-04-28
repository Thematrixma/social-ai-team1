---
description: Remove or disable an external application connection from the project
---

Help the user safely disconnect or remove an external application integration. The app to disconnect is: "$ARGUMENTS"

Steps to follow:
1. Find all references to this app in the codebase (imports, env vars, config entries, API calls)
2. List everything that will be affected before making any changes
3. Ask for confirmation before proceeding
4. Remove the integration code, SDK imports, and configuration entries
5. Remove or comment out the relevant environment variables from .env files
6. Check for any dependent code that relied on this integration and flag it for the user to handle
7. Run any existing tests to confirm nothing is broken

Always confirm with the user before deleting anything.
