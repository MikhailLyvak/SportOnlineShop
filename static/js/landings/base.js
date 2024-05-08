const engButtons = document.querySelectorAll('.eng-button');
const uaButtons = document.querySelectorAll('.ua-button');

engButtons.forEach(button => {
    button.addEventListener('click', () => updateLanguageAndContent('en'), false);
});

uaButtons.forEach(button => {
    button.addEventListener('click', () => updateLanguageAndContent('ua'), false);
});

updateBaseContent(currentLanguage);
