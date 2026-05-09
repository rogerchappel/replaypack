import test from 'node:test';
import assert from 'node:assert/strict';
import { defaultRedactions, envRedactions, redactText } from '../redact.js';

test('redacts common inline secrets', () => {
  assert.equal(redactText('token=abc password=hunter2', defaultRedactions()), 'token=[REDACTED] password=[REDACTED]');
});

test('redacts allowlisted environment values by name', () => {
  const env = { API_TOKEN: 'super-secret' };
  const rules = envRedactions(['API_TOKEN'], env);
  assert.equal(redactText('value super-secret', rules, env), 'value [REDACTED:API_TOKEN]');
});
