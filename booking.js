(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SeatBooking = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const MOVIES = Object.freeze([
    { id: 'avengers', title: 'Avengers: Endgame', price: 10 },
    { id: 'joker', title: 'Joker', price: 12 },
    { id: 'toy-story', title: 'Toy Story 4', price: 8 },
    { id: 'lion-king', title: 'The Lion King', price: 9 },
  ]);
  const OCCUPIED = Object.freeze(['A2', 'A3', 'B3', 'B4', 'D1', 'D7', 'D8', 'F6', 'F7', 'F8']);
  const SEATS = Object.freeze(Array.from({ length: 48 }, (_, index) => String.fromCharCode(65 + Math.floor(index / 8)) + (index % 8 + 1)));
  function initialState() { return { version: 1, movieId: 'avengers', selections: {} }; }
  function isAvailable(seat) { return SEATS.includes(seat) && !OCCUPIED.includes(seat); }
  function restoreState(raw) {
    try {
      const value = typeof raw === 'string' ? JSON.parse(raw) : raw;
      if (!value || value.version !== 1 || !MOVIES.some((movie) => movie.id === value.movieId)) return initialState();
      const state = initialState();
      state.movieId = value.movieId;
      for (const movie of MOVIES) {
        const saved = value.selections?.[movie.id];
        state.selections[movie.id] = Array.isArray(saved) ? [...new Set(saved.filter(isAvailable))].sort() : [];
      }
      return state;
    } catch { return initialState(); }
  }
  function toggleSeat(state, seat) {
    if (!isAvailable(seat)) return state;
    const current = state.selections[state.movieId] || [];
    const selected = current.includes(seat) ? current.filter((item) => item !== seat) : [...current, seat].sort();
    return { ...state, selections: { ...state.selections, [state.movieId]: selected } };
  }
  function selectMovie(state, movieId) {
    return MOVIES.some((movie) => movie.id === movieId) ? { ...state, movieId } : state;
  }
  function summary(state) {
    const movie = MOVIES.find((item) => item.id === state.movieId);
    const seats = (state.selections[state.movieId] || []).filter(isAvailable);
    return { movie, seats, count: seats.length, total: seats.length * movie.price };
  }
  return { MOVIES, SEATS, OCCUPIED, initialState, restoreState, toggleSeat, selectMovie, summary, isAvailable };
});
