# CardWars - Monster Card Game

A dynamic, front-end web application for "CardWars," a fictional monster card trading game. This project simulates a live marketplace where users can browse cards, manage their personal collection, save favorites, and use a shopping cart. All data is managed on the client-side and persists across sessions using localStorage.

## ✨ Features

### Dynamic Marketplace
- Browse all available monster cards, loaded dynamically from `Monsters.json`
- Filter by card **Rarity** (Common, Rare, Epic, etc.) and **Element** (Fire, Water, Air, etc.)
- Paginated display showing 8 cards per page for optimal performance

### Shopping Cart
- Add any card from the market to your cart
- Adjust item quantity directly within the cart panel
- Remove individual items or clear the entire cart
- Seamless checkout process

### Persistent Collection
- "Checkout" feature transfers all cart items to your permanent collection
- Collection page displays all owned cards with their quantities
- Data persists across browser sessions

### Favourites System
- Toggle "favourite" status (heart icon) for any card
- Dedicated "Favourite" page to view all saved cards

### Data Persistence
- Cart, Collection, and Favourites are saved in `localStorage`
- Your data remains safe even after closing the browser

### Responsive Design
- Fully responsive layout optimized for mobile, tablet, and desktop devices

## 🛠️ Tech Stack

- **HTML5**: Semantic structure for all pages
- **CSS3 (TailwindCSS)**: Utility-first CSS framework via CDN for rapid UI development
- **Vanilla JavaScript (ES6+)**: 
  - DOM Manipulation
  - Event Handling
  - Fetching data from JSON
  - Client-side state management
- **localStorage API**: Client-side data persistence
- **JSON**: Simple database (`Monsters.json`) for monster card data

## 🚀 Getting Started

> **Important:** This project uses `fetch()` to load `Monsters.json`, so it cannot be run by simply opening `index.html` in your browser due to CORS policy. It must be served by a web server.

### Using VS Code Live Server

1. Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) for VS Code
2. Clone this repository to your local machine:
   ```bash
   git clone <repository-url>
   ```
3. Open the project folder in VS Code
4. Right-click on `index.html` in the file explorer
5. Select **"Open with Live Server"**
6. Your browser will automatically open with the project running

## 📁 Project Structure

```
/
├── index.html          # Homepage
├── Market.html         # Marketplace with filters/pagination
├── Collection.html     # User's personal card collection
├── Favourite.html      # User's saved favourite cards
├── Guide.html          # Static game guide page
│
├── app.js              # Main JavaScript file for all logic
├── Monsters.json       # Database of all available monster cards
├── style.css           # Custom CSS (e.g., .bag-gold)
│
├── /img/               # General images (logos, banners)
├── /Monsters-img/      # All monster card artwork
└── /Element-img/       # Element type icons
```

## 🧠 Core Functionality

### State Management

All application state is managed in `app.js` using four global arrays:

- **allMonsters**: Stores all cards fetched from `Monsters.json` at startup (immutable)
- **Favourites**: Array of monster IDs (e.g., `['1', '5', '12']`) - persisted in localStorage
- **Cart**: Array of objects with quantity (e.g., `[{ id: '2', quantity: 1 }, { id: '7', quantity: 3 }]`) - persisted in localStorage
- **Collections**: Array of objects with quantity, similar to Cart - persisted in localStorage

### Data Flow

#### On Load
1. `fetch('Monsters.json')` loads all card data into `allMonsters`
2. `localStorage.getItem()` retrieves and parses Favourites, Cart, and Collections (or initializes as empty arrays)
3. Render functions are called to build the UI based on loaded state:
   - `renderPage()` for Market
   - `displayCart()` for shopping cart
   - `displayCollections()` for collection page
   - `showfavourites()` for favourites page

#### User Action (e.g., Add to Cart)
1. Global click listener detects a click on `.shop-btn`
2. `addToCart(monsterId)` function is called
3. Function modifies the Cart array (adds new item or increments quantity)
4. `localStorage.setItem('Cart', ...)` saves the new state
5. `displayCart()` re-renders the cart panel with updated data

#### Checkout Process
1. `checkout()` function loops through the Cart array
2. Merges each item into Collections array, updating quantities if card already exists
3. Saves updated Collections to localStorage
4. Clears Cart array and saves empty cart to localStorage
5. Calls `displayCart()` and `displayCollections()` to update the UI

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

---

**Enjoy playing CardWars!** 🎮✨