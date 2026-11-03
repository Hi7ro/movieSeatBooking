/* Browser view; the selection rules live in booking.js and are tested separately. */
'use strict';
const booking = window.SeatBooking;
const storageKey = 'movie-seat-booking.demo.v1';
const movieSelect = document.getElementById('movie');
const seating = document.getElementById('seats');
const storageStatus = document.getElementById('storage-status');
const currency = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
let state = booking.initialState();
function setStorageStatus(message, warning = false) {
  storageStatus.textContent = message;
  storageStatus.classList.toggle('warning', warning);
}
try { state = booking.restoreState(localStorage.getItem(storageKey)); }
catch { setStorageStatus('Saving is unavailable. Your selection will last for this visit.', true); }
for (const movie of booking.MOVIES) {
  const option = document.createElement('option');
  option.value = movie.id;
  option.textContent = movie.title + ' (' + currency.format(movie.price) + ' / seat)';
  movieSelect.append(option);
}
for (const rowName of ['A', 'B', 'C', 'D', 'E', 'F']) {
  const row = document.createElement('div');
  row.className = 'row';
  row.setAttribute('role', 'group');
  row.setAttribute('aria-label', 'Row ' + rowName);
  const label = document.createElement('span');
  label.className = 'row-label';
  label.setAttribute('aria-hidden', 'true');
  label.textContent = rowName;
  row.append(label);
  for (let column = 1; column <= 8; column++) {
    const id = rowName + column;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'seat';
    button.dataset.seat = id;
    button.dataset.column = column;
    button.disabled = !booking.isAvailable(id);
    button.setAttribute('aria-label', 'Seat ' + id + (button.disabled ? ', occupied' : ''));
    row.append(button);
  }
  seating.append(row);
}
function persist() {
  try { localStorage.setItem(storageKey, JSON.stringify(state)); setStorageStatus('Selection saved on this device.'); }
  catch { setStorageStatus('Your selection works for this visit but could not be saved.', true); }
}
function render() {
  const selection = booking.summary(state);
  movieSelect.value = state.movieId;
  for (const button of seating.querySelectorAll('button')) {
    const selected = selection.seats.includes(button.dataset.seat);
    button.classList.toggle('selected', selected);
    button.classList.toggle('occupied', button.disabled);
    button.setAttribute('aria-pressed', String(selected));
    button.textContent = button.disabled ? '×' : selected ? '✓' : '';
  }
  document.getElementById('count').textContent = selection.count;
  document.getElementById('seat-word').textContent = selection.count === 1 ? 'seat' : 'seats';
  document.getElementById('total').textContent = currency.format(selection.total);
  document.getElementById('selection').textContent = selection.count ? selection.movie.title + ' · ' + selection.seats.join(', ') : 'No seats selected yet.';
}
seating.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-seat]');
  if (!button || button.disabled) return;
  state = booking.toggleSeat(state, button.dataset.seat);
  persist(); render();
});
movieSelect.addEventListener('change', () => { state = booking.selectMovie(state, movieSelect.value); persist(); render(); });
document.getElementById('reset').addEventListener('click', () => { state = booking.initialState(); persist(); render(); });
window.addEventListener('storage', (event) => { if (event.key === storageKey) { state = booking.restoreState(event.newValue); render(); } });
render();
