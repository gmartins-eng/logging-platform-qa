## Performance Strategy

This document describes the performance testing approach applied to the logging platform.

The goal of the performance test is to evaluate how the platform behaves under gradually increasing load, 
ensuring acceptable latency and error rates.

## Test Objectives

The performance test aims to:
- Validate log ingestion behavior under concurrent load
- Measure API response time during log submission
- Observe system stability as concurrency increases
- Ensure error rates remain within acceptable limits
- Simulate realistic usage patterns instead of stress scenarios

 ## Test Scenario

The test simulates multiple clients sending logs to the platform while authenticated.

High-level flow:

1. Generate an authentication token (executed once per test)
2. Submit logs concurrently via the ingestion API
3. Capture ingestion latency
4. Retrieve log status using a correlation identifier
5. Apply think time between iterations

The system under test processes logs asynchronously, therefore the test focuses on ingestion and visibility,
not full processing completion.

## Load Model

A ramp-up test is applied to gradually add Virtual Users, to identify performance degradation trends without 
overwhelming the system abruptly.

| Stage	| Duration	| Virtual Users|
| :--- | :--- | :--- |
|Ramp-up 1 |	30s	| 5|
|Ramp-up 2 |	30s	| 10|
|Ramp-up 3 |	30s	| 20|

## Stress Testing Strategy

In addition to load testing, a stress testing approach is defined using the same test script.

The stress test gradually increases virtual users beyond expected production levels
until the system exhibits one or more of the following behaviors:
- Increased error rate
- Significant latency degradation
- Resource saturation symptoms

The objective of the stress test is not to block releases,
but to identify system limits and failure modes.

Observed breaking points provide valuable input for capacity planning
and resilience improvements.


## Metrics & Thresholds
The following metrics are collected:

Built-in Metrics
- `http_req_duration:` overall HTTP request latency

Custom Metrics
- `log_ingest_latency:` time taken to ingest a log
- `errors:` functional error rate

Thresholds applied:
- 95th percentile of request duration < 2000 ms
- Error rate < 1%

## Apdex Definition

An Apdex-based interpretation is applied to evaluate user experience:

- Satisfied (S): response time ≤ 500 ms
- Tolerating (T): response time ≤ 2000 ms
- Frustrated (F): response time > 2000 ms or errors

The performance target is to keep at least 95% of requests within the
Satisfied or Tolerating range.

Requests classified as Frustrated are considered release blockers.


## Limitations & Assumptions
- The test does not validate full asynchronous processing completion
- External dependencies are treated as black boxes
- Results may vary depending on infrastructure configuration
- The default execution focuses on load testing; stress testing is defined as an extension.

## CI/CD Considerations

This test is designed to be executed as part of a CI/CD pipeline when environment constraints allow.

Potential usage:
- Manual execution before major releases
- Automated execution on staging environments
- Performance regression detection over time
