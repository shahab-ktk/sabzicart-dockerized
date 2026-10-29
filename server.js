const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Your WhatsApp number
const WHATSAPP_NUMBER = "923XXXXXXXXX";

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Vegetable data
const vegetables = [
    {
        id: 1,
        name: "Fresh Potatoes",
        price: "Rs. 120 / kg",
        image: "/images/potato.jpg"
    },
    {
        id: 2,
        name: "Fresh Tomatoes",
        price: "Rs. 180 / kg",
        image: "/images/tomato.jpg"
    },
    {
        id: 3,
        name: "Fresh Onions",
        price: "Rs. 150 / kg",
        image: "/images/onion.jpg"
    },
    {
        id: 4,
        name: "Fresh Carrots",
        price: "Rs. 160 / kg",
        image: "/images/carrot.jpg"
    },
    {
        id: 5,
        name: "Fresh Cucumbers",
        price: "Rs. 140 / kg",
        image: "/images/cucumber.jpg"
    }
];

// API: Get vegetables
app.get("/api/vegetables", (req, res) => {
    res.json(vegetables);
});

// API: Generate WhatsApp order link
app.post("/api/order", (req, res) => {
    const { vegetable, quantity, customerName } = req.body;

    if (!vegetable || !quantity) {
        return res.status(400).json({
            success: false,
            message: "Vegetable and quantity are required."
        });
    }

    const message = `
Hello SabziCart 👋

I would like to order:

🥬 Vegetable: ${vegetable}
📦 Quantity: ${quantity}
👤 Customer: ${customerName || "Not provided"}

Please confirm availability and total price.
    `.trim();

    const whatsappURL =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    res.json({
        success: true,
        whatsappURL
    });
});

// Main route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
// app.listen(PORT, "127.0.0.1", () => {
//     console.log(`SabziCart running on http://127.0.0.1:${PORT}`);
// });

app.listen(PORT, "0.0.0.0", () => {
    console.log(`SabziCart API listening on 127.0.0.1:${PORT}`);
});
