import { describe, it, expect } from 'vitest';
import worker from '../src/index';

describe('Cloud Agent Worker', () => {
  it('rejects unauthenticated requests with 401', async () => {
    const request = new Request('http://example.com/v1/chat/completions', {
      method: 'POST',
      body: JSON.stringify({ messages: [{ role: 'user', content: 'hello' }] }),
    });
    
    // Mock the context
    const ctx = { waitUntil: () => {}, passThroughOnException: () => {} } as any;
    const response = await worker.fetch(request, { ADMIN_SECRET: 'test-secret', GOOGLE_API_KEY: 'test-key' }, ctx);
    
    expect(response.status).toBe(401);
  });

  it('rejects invalid payload with 400', async () => {
    const request = new Request('http://example.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer test-secret' },
      body: JSON.stringify({ wrong: 'payload' }), // No messages array
    });
    
    const ctx = { waitUntil: () => {}, passThroughOnException: () => {} } as any;
    const response = await worker.fetch(request, { ADMIN_SECRET: 'test-secret', GOOGLE_API_KEY: 'test-key' }, ctx);
    
    expect(response.status).toBe(400);
  });
});
