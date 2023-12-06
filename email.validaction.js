function handleLogin() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    const email = emailInput.value;
    const password = passwordInput.value;

    // Replace this with your authentication logic
    if (validateCredentials(email, password)) {
        // Successful login, navigate to the next page without showing the alert
        window.location.href = 'home.html'; // Replace with the actual URL of the next page
        return false; // Prevent form submission
    } else {
        alert('Invalid email or password. Please try again.');
        return false; // Prevent form submission
    }
}

function validateCredentials(email, password) {
    // Replace this with your actual authentication logic
    // For example, you might check the credentials against a database
    return email === 'example@example.com' && password === 'password';
}


function displayImages(event) {
    const input = event.target;
    const imageContainer = document.getElementById("image-container");

    imageContainer.innerHTML = ""; // Clear previous images

    if (input.files && input.files.length > 0) {
        for (let i = 0; i < input.files.length; i++) {
            const file = input.files[i];

            if (file.type.startsWith("image/")) {
                const imgElement = document.createElement("img");
                imgElement.src = URL.createObjectURL(file);
                imageContainer.appendChild(imgElement);
            }
        }
    }
}
const image = document.getElementById('image');
const overlay = document.getElementById('overlay');
const overlayImage = document.getElementById('overlay-image');
const closeButton = document.getElementById('close-button');

image.addEventListener('click', () => {
    overlay.style.display = 'flex';
    overlayImage.src = image.src;
});

closeButton.addEventListener('click', () => {
    overlay.style.display = 'none';
});

overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
        overlay.style.display = 'none';
    }
});