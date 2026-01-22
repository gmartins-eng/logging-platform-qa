import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate } from 'k6/metrics';

// custom metrics
const logIngestLatency = new Trend('log_ingest_latency');
const errorRate = new Rate('errors');

//test configuration
export const options = {
  stages: [
    { duration: '30s', target: 5 },
    { duration: '30s', target: 10 },
    { duration: '30s', target: 20 }, 
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // SLA p95
    errors: ['rate<0.01'],             // error rate < 1%
  },
};

const BASE_URL = 'http://localhost:3000';


export function setup() {
  const res = http.post(`${BASE_URL}/auth/token`);
  const token = res.json('token');

  return { token };
}



export default function (data) {
  const headers = {
    Authorization: `Bearer ${data.token}`,
    'Content-Type': 'application/json',
  };

  //sends the log
  const payload = JSON.stringify({
    message: 'k6-performance-log',
  });

  const postRes = http.post(`${BASE_URL}/logs`, payload, { headers });

  const success = check(postRes, {
    'log accepted': (r) => r.status === 200,
  });

  errorRate.add(!success);
  logIngestLatency.add(postRes.timings.duration);

  const correlationId = postRes.json('correlationId');
  if (!correlationId) {
    return;
  }

  //search the status
  const getRes = http.get(`${BASE_URL}/logs/${correlationId}`, { headers });

  check(getRes, {
    'status endpoint ok': (r) => r.status === 200,
  });

  sleep(1); // think time
}
