// Get references to the DOM elements we need to work with
const changeBgBtn = document.getElementById('change-bg-btn');
const bgColorInput = document.getElementById('myinput');

const changeTextBtn = document.getElementById('change-text-btn');
const textColorInput = document.getElementById('mytextinput');

// Select all elements that should have their text color changed
// We select only by '.myclass' now, so we don't override the animation on #highlighted-text
const textElements = document.querySelectorAll('.myclass');

// This function will be called when the "Change Background" button is clicked
function changeBackground() {
    const inputValue = bgColorInput.value;
    // By setting the 'background' property, we can use colors, images, or gradients!
    // If we used 'backgroundColor', it would only support solid colors.
    document.body.style.background = inputValue;
}

// This function will be called when the "Change Text" button is clicked
function changeTextColor() {
    const colorValue = textColorInput.value;
    textElements.forEach(element => {
        element.style.color = colorValue;
    });
}

// Attach the functions to the 'click' event of the buttons.
// This is the modern way to handle events, instead of using 'onclick' in the HTML.
changeBgBtn.addEventListener('click', (event) => {
    // First, run the original function
    changeBackground();

    // Then, handle the button's visual feedback
    const button = event.currentTarget;
    button.classList.add('clicked');

    // Set a timer to remove the 'clicked' class after 2 seconds
    setTimeout(() => {
        button.classList.remove('clicked');
    }, 2000);
});

changeTextBtn.addEventListener('click', (event) => {
    // First, run the original function
    changeTextColor();

    // Then, handle the button's visual feedback
    const button = event.currentTarget;
    button.classList.add('clicked');

    // Set a timer to remove the 'clicked' class after 2 seconds
    setTimeout(() => {
        button.classList.remove('clicked');
    }, 2000);
});