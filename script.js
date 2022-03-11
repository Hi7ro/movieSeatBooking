'use strict'

const container = document.querySelector('.container');
const seats = document.querySelectorAll('.row .seat:not(occupied)');
const count = $('count');
const total = $('total');
const movieSelect = $('movie');
let ticketPrice = +movieSelect.value;

function $(id) {
  return document.getElementById(id);
}

function selectedCount() {
  const selectedSeats = document.querySelectorAll('.row .seat.selected');
  const selectedCount = selectedSeats.length
  count.innerText = selectedCount;
}

function selectedPrice() {
  return total.innerText = count.innerText * ticketPrice
}

// Movie select event
movieSelect.addEventListener('change', e => {
  ticketPrice = +e.target.value;
  selectedCount();
  selectedPrice();
})

// Seat click event
container.addEventListener('click', e => {
  if (e.target.classList.contains('seat') &&
    !e.target.classList.contains('occupied')) {
    e.target.classList.toggle('selected');
    selectedCount();
    selectedPrice();
  }
})