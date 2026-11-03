# Movie Seat Booking

A small HTML/CSS/JavaScript cinema-selection project. The original dark auditorium, white occupied seats and cyan selections remain; the demo now supports labelled keyboard/touch controls and a complete local selection flow.

## Run locally

No installation or build is needed. From this folder:

```sh
python3 -m http.server 8082 --bind 127.0.0.1
```

Open http://127.0.0.1:8082/ . It also works when copied below `/demos/movie-seat-booking/`; every application URL is relative.

## Try the demo

1. Choose a film. Its ticket price is shown in the selector.
2. Select seats using touch, a mouse, or Tab then Space/Enter. Occupied seats cannot be selected. The tick and pressed state identify your selected seats.
3. Read the seat names, count and total. Each film keeps its own selection.
4. Reload to restore your choices from this browser. **Reset selection** clears all demo selections and returns to the first film.

This is a portfolio demo, not a real booking system. Film titles and occupied seats form a sample programme. Nothing is reserved, transmitted or charged. Only this demo's versioned selection is stored in browser localStorage; when storage is blocked, the interface remains usable for the current visit and reports the limitation. No external fonts, analytics or third-party runtime resources are requested.

## Verification

Node.js 24 (or another version supporting `node:test`):

```sh
node --test tests/booking.test.cjs
```

The fixed outcomes cover prices, per-film isolation, occupied/invalid seats, deselection, corrupt/foreign saved data and reset. Browser interaction, responsiveness and reload persistence require a separate browser check.

## Public package

Copy only `index.html`, `style.css`, `script.js` and `booking.js`. No Git files, test files, dependencies or private state are needed.
