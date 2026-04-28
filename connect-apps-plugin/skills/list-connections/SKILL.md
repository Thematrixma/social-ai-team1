---
description: List all external app connections and integrations configured in the project
---

Scan the current project and identify all external application connections and integrations. Look for:

1. Environment variables referencing external services (API keys, tokens, URLs)
2. Configuration files (.env, config/, settings files) with connection strings
3. SDK/library imports for third-party services (e.g., stripe, twilio, sendgrid, aws-sdk)
4. HTTP client calls to external APIs
5. Database connection strings

Summarize findings in a table showing: Service Name, Connection Method, Where Configured, and Status (whether credentials appear to be set).

Flag any connections that look misconfigured or have placeholder values.
