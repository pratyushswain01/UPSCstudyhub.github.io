// Optional JavaScript to pause ticker on hover
const ticker = document.querySelector('.ticker');

ticker.addEventListener('mouseover', function() {
  ticker.style.animationPlayState = 'paused';
});

ticker.addEventListener('mouseout', function() {
  ticker.style.animationPlayState = 'running';
});
