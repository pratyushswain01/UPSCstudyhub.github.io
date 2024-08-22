document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.collapsible-button');

    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const content = this.nextElementSibling;

            // Hide other sections
            document.querySelectorAll('.collapsible-content').forEach(section => {
                if (section !== content) {
                    section.style.display = 'none';
                    section.previousElementSibling.classList.remove('active');
                }
            });

            // Toggle the current section
            if (content.style.display === 'block') {
                content.style.display = 'none';
                this.classList.remove('active');
            } else {
                content.style.display = 'block';
                this.classList.add('active');
            }
        });
    });
});
