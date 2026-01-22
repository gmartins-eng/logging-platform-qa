jest.setTimeout(30000);

const { generateToken } = require('../auth/token');
const { sendLog, getLogStatus } = require('../clients/logsClient');
const retry = require('../utils/retry');

describe('E2E - Logging Platform', () => {
  test('should submit log, process asynchronously, and expose final state', async () => {
    console.log('Iniciando teste E2E de logging...');

    //generate token
    const token = await generateToken();
    expect(token).toBeDefined();

    //send log
    const message = 'e2e-log-test';
    const correlationId = await sendLog(token, message);
    expect(correlationId).toBeDefined();

    console.log(`CorrelationId gerado: ${correlationId}`);

    //await async processing
    const result = await retry(async () => {
      const statusResponse = await getLogStatus(correlationId);

      console.log(
        `Status atual do log ${correlationId}: ${statusResponse.status}`
      );

      if (['PROCESSED', 'FAILED'].includes(statusResponse.status)) {
        return statusResponse;
      }

      throw new Error('Log ainda em processamento');
    }, 10, 2000);

    //final assertions
    expect(result.status).toBeDefined();
    expect(['PROCESSED', 'FAILED']).toContain(result.status);

    if (result.status === 'PROCESSED') {
      expect(result.message).toBe(message);
    }

    console.log(`Teste finalizado com status: ${result.status}`);
  });
});