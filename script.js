document.addEventListener('DOMContentLoaded', function() {
    const button = document.querySelector('.collapsible-button');
    const content = document.querySelector('.collapsible-content');
    
    button.addEventListener('click', function() {
        if (content.style.display === 'block') {
            content.style.display = 'none';
            button.classList.remove('active');
        } else {
            content.style.display = 'block';
            button.classList.add('active');
        }
    });
});
