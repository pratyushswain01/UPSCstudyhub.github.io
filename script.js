document.getElementById('toggleButton').addEventListener('click', function() {
    var hiddenTopic = document.getElementById('hiddenTopic');
    var button = document.getElementById('toggleButton');
    
    if (hiddenTopic.classList.contains('hidden')) {
        hiddenTopic.classList.remove('hidden');
        button.textContent = 'Hide Topic';
    } else {
        hiddenTopic.classList.add('hidden');
        button.textContent = 'Show Topic';
    }
});
