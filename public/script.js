let vegetables = [];
let currentSlide = 0;

const slider = document.getElementById("productSlider");
const vegetableSelect = document.getElementById("vegetable");


// Get vegetables from Node.js backend
async function loadVegetables() {

    try {

        const response = await fetch("/api/vegetables");

        vegetables = await response.json();

        displayVegetables();
        populateSelect();

    } catch (error) {

        console.error("Unable to load vegetables:", error);

    }
}


// Display products
function displayVegetables() {

    slider.innerHTML = "";

    vegetables.forEach((vegetable) => {

        const card = document.createElement("div");

        card.className = "product-card";

        card.innerHTML = `
            <img
                src="${vegetable.image}"
                alt="${vegetable.name}"
                class="product-image"
            >

            <div class="product-info">

                <h3>${vegetable.name}</h3>

                <p class="price">${vegetable.price}</p>

                <button
                    class="order-btn"
                    onclick="selectVegetable('${vegetable.name}')"
                >
                    Order on WhatsApp
                </button>

            </div>
        `;

        slider.appendChild(card);

    });

}


// Populate order dropdown
function populateSelect() {

    vegetables.forEach((vegetable) => {

        const option = document.createElement("option");

        option.value = vegetable.name;
        option.textContent = vegetable.name;

        vegetableSelect.appendChild(option);

    });

}


// Select vegetable from product card
function selectVegetable(name) {

    vegetableSelect.value = name;

    document
        .querySelector(".order-section")
        .scrollIntoView({
            behavior: "smooth"
        });

}


// Slider

function nextSlide() {
    currentSlide++;
    updateSlider();
}

function previousSlide() {
    currentSlide--;
    updateSlider();
}

function updateSlider() {
    const cards = slider.querySelectorAll(".product-card");

    if (cards.length === 0) return;

    // Show 3 cards on desktop and 1 on mobile
    const visibleCards = window.innerWidth <= 800 ? 1 : 3;

    // Prevent scrolling beyond the last product
    const maxSlide = Math.max(0, cards.length - visibleCards);

    currentSlide = Math.max(
        0,
        Math.min(currentSlide, maxSlide)
    );

    // Calculate the movement distance
    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = parseFloat(
        getComputedStyle(slider).gap
    ) || 0;

    slider.style.transform =
        `translateX(-${currentSlide * (cardWidth + gap)}px)`;

    // Update arrow states
    document.querySelector(".prev").disabled = currentSlide === 0;
    document.querySelector(".next").disabled = currentSlide === maxSlide;
}

// Recalculate the slider when the screen size changes
window.addEventListener("resize", updateSlider);


// WhatsApp order
document
    .getElementById("orderForm")
    .addEventListener("submit", async (event) => {

        event.preventDefault();

        const vegetable =
            document.getElementById("vegetable").value;

        const customerName =
            document.getElementById("customerName").value;

        const quantity =
            document.getElementById("quantity").value;


        if (!vegetable || !quantity) {

            alert("Please select vegetable and quantity.");

            return;
        }


        try {

            const response = await fetch("/api/order", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    vegetable,
                    quantity,
                    customerName
                })

            });


            const data = await response.json();


            if (data.success) {

                window.open(
                    data.whatsappURL,
                    "_blank"
                );

            }

        } catch (error) {

            console.error(error);

            alert("Something went wrong. Please try again.");

        }

    });


// Start application
loadVegetables();