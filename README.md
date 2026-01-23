# Logging Platform — QA Automation Assignment

This repository contains the QA automation solution developed for the
Senior QA Automation Engineer – Performance & Security assignment.

The objective is to demonstrate quality engineering thinking applied to a
distributed, asynchronous, API-first platform.


## Platform Context

The system under test is a multi-cloud logging and data-processing platform.

High-level workflow:
1. Clients send logs via HTTP API
2. Logs are queued asynchronously
3. Logs are processed by backend workers
4. Data is indexed and becomes searchable
5. Metrics and errors are exposed via APIs

The platform is API-first and has no UI.


## Testing Scope

### In Scope
- Authentication token generation
- Log ingestion via API
- Asynchronous processing handling
- Log status validation via correlation ID
- Error and failure handling
- Performance behavior under load
- Security misuse and validation scenarios

### Out of Scope
- UI testing
- Infrastructure provisioning
- Third-party dependency internals


