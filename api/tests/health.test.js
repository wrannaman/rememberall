import { expect } from 'chai';
import request from 'supertest';
import { app, server } from '../index.js';

const API_KEY = 'a84a9ba1-2e9c-44f6-b8dd-b07c64f22d21';

// Ensure the database is connected before running tests
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

before(async function () {
  this.timeout(5000); // Increase timeout to 5000ms for this hook
  await sleep(3000); // Sleep for 3000ms to allow database connection
});

after(() => {
  server.close(); // Close the server after all tests are done
  setTimeout(() => {
    process.exit(); // Exit the process after all tests are done
  }, 1000);
});

describe('GET /health', () => {
  it('should return the health status of the api', async () => {
    const response = await request(app)
      .get('/health')
      .query({})
      .set('Authorization', `Bearer ${API_KEY}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.success).to.be.true;
  });
});
