const test = require('node:test');
const assert = require('node:assert/strict');
const booking = require('../booking.js');

test('two Avengers seats cost 20 euros and deselection costs 10', () => {
  let state = booking.toggleSeat(booking.initialState(), 'A1');
  state = booking.toggleSeat(state, 'A4');
  assert.equal(booking.summary(state).total, 20);
  assert.deepEqual(booking.summary(state).seats, ['A1', 'A4']);
  state = booking.toggleSeat(state, 'A1');
  assert.equal(booking.summary(state).count, 1);
  assert.equal(booking.summary(state).total, 10);
});
test('each film keeps its own seats and uses its own ticket price', () => {
  let state = booking.toggleSeat(booking.initialState(), 'C1');
  state = booking.selectMovie(state, 'joker');
  assert.equal(booking.summary(state).count, 0);
  state = booking.toggleSeat(booking.toggleSeat(state, 'C2'), 'C3');
  assert.equal(booking.summary(state).total, 24);
  state = booking.selectMovie(state, 'avengers');
  assert.deepEqual(booking.summary(state).seats, ['C1']);
  assert.equal(booking.summary(state).total, 10);
});
test('occupied and invalid seats and foreign films cannot alter a selection', () => {
  const state = booking.initialState();
  assert.equal(booking.toggleSeat(state, 'A2'), state);
  assert.equal(booking.toggleSeat(state, 'Z99'), state);
  assert.equal(booking.selectMovie(state, 'unknown'), state);
});
test('restored data deduplicates seats and rejects occupied or invalid IDs', () => {
  const restored = booking.restoreState(JSON.stringify({ version: 1, movieId: 'toy-story', selections: { 'toy-story': ['A1', 'A1', 'A2', 'G1', 42, 'F5'] } }));
  assert.deepEqual(booking.summary(restored).seats, ['A1', 'F5']);
  assert.equal(booking.summary(restored).total, 16);
});
test('corrupt or unsupported browser data returns a safe empty demo', () => {
  for (const raw of ['{broken', null, '{}', '{"version":2,"movieId":"avengers"}', '{"version":1,"movieId":"foreign"}']) {
    assert.deepEqual(booking.restoreState(raw), booking.initialState());
  }
});
test('reset starts at the first film with no selected seats', () => {
  const reset = booking.initialState();
  assert.equal(reset.movieId, 'avengers');
  assert.equal(booking.summary(reset).count, 0);
  assert.equal(booking.summary(reset).total, 0);
});
