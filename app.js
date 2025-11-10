const header = document.querySelector("header");
const slider = document.getElementById("slider-container");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const showButtons = document.querySelectorAll('.show-question');
const resetbtn = document.getElementById("reset");
const applyFilterBtn = document.querySelector(".Apply-filter");

const totalFav = document.getElementById('total-fav-cards');
const totalValueFav = document.getElementById('total-fav-value');
const mostExpensiveFav = document.getElementById('most-expensive-fav');

const rarity = document.querySelectorAll('[name="Rarity"]');
const Commun =document.getElementById('Commun');
const Rare =document.getElementById('Rare');
const Epic =document.getElementById('Epic');
const Legendary =document.getElementById('Legendary');
const mythic =document.getElementById('Mythic');

const elements =document.querySelectorAll('[name="Element"]');
const fire= document.getElementById('Fire');
const water= document.getElementById('Water');
const earth= document.getElementById('Earth');
const air= document.getElementById('Air');
const light= document.getElementById('Light');
const dark= document.getElementById('Dark');

const MarketContainer= document.querySelector('.Market-cards');
const FavouriteContainer=document.querySelector('.Favourite-container');
const CollectionContainer=document.querySelector('.collection-container');

const CartContainer=document.querySelector('.Cart-container');
const cartPanel = document.getElementById('cart-panel');
const showcartbtn = document.getElementById('show-cart');
const closeCartBtn = document.getElementById('close-cart');
const clearCartBtn = document.getElementById('clear-cart');
const cartTotalPrice = document.getElementById('cart-total-price');
const openCartBtns = document.querySelectorAll('.fi-rs-shopping-cart');
const checkoutBtn = document.getElementById('checkout'); 

const colors = {
	  'Common': '#373636ff',
	  'Rare': '#0000FF',
	  'Epic': '#800080',
	  'Legendary': '#FFA500',
	  'Mythic': '#FF0000'
};

let allMonsters = [];
let Favourites = JSON.parse(localStorage.getItem('Favourites')) || [];
let Collections = JSON.parse(localStorage.getItem('Collections')) || [];
let Cart = JSON.parse(localStorage.getItem('Cart')) || [];
let monsterLength;

let currentMonsterList = [];

if (slider && prevBtn && nextBtn) {
    const scrollAmount = 300; 

    nextBtn.addEventListener("click", () => {
      slider.scrollBy({
        left: scrollAmount,
        behavior: "smooth"
      });
    });

    prevBtn.addEventListener("click", () => {
      slider.scrollBy({
        left: -scrollAmount,
        behavior: "smooth"
      });
    });
}

fetch('Monsters.json')
.then(response => response.json())
.then(data => {
    allMonsters = data;
    currentMonsterList = [...allMonsters]; 
    
    displayallcards();
    
    showfavourites();
    displayCollections(); 
    displayCart();
})
.catch(error => console.error('Error loading monsters:', error));


showButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const answer = button.closest('.Questions').querySelector('.answer');
        const downIcon = button.querySelector('.down');
        const upIcon = button.querySelector('.up');

        answer.classList.toggle('hidden');
        downIcon.classList.toggle('hidden');
        upIcon.classList.toggle('hidden');
    });
});

const cardDetailles = document.querySelector('.Card-detailles');

document.addEventListener('click', function(e){
    if(e.target.classList.contains('Card')){
        if (cardDetailles) cardDetailles.classList.toggle('hidden');
    }else if(e.target.parentNode.classList.contains('Card')){
        if (cardDetailles) cardDetailles.classList.toggle('hidden');
    }

    const favBtn = e.target.closest('.Favourite-btn');
    if (favBtn) {
        const monsterId = favBtn.dataset.monsterId;
        addToFavourites(monsterId);
        showfavourites();
        
        displayallcards();
        return;
    }

    const shopBtn = e.target.closest('.shop-btn');
    if (shopBtn) {
        const monsterId = shopBtn.dataset.monsterId;
        addToCart(monsterId);
        return;
    }

    const removeBtn = e.target.closest('.remove-from-cart-btn');
    if (removeBtn) {
        const monsterId = removeBtn.dataset.monsterId;
        removeFromCart(monsterId);
        return;
    }

    const increaseBtn = e.target.closest('.increase-quantity-btn');
    if (increaseBtn) {
        const monsterId = increaseBtn.dataset.monsterId;
        increaseCartQuantity(monsterId);
        return;
    }

    const decreaseBtn = e.target.closest('.decrease-quantity-btn');
    if (decreaseBtn) {
        const monsterId = decreaseBtn.dataset.monsterId;
        decreaseCartQuantity(monsterId);
        return;
    }
});

if (cartPanel) {
  openCartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        cartPanel.classList.remove('hidden');
    });
  });

  if (closeCartBtn) {
    closeCartBtn.addEventListener('click', () => {
      cartPanel.classList.add('hidden');
    });
  }
  if(showcartbtn){
	showcartbtn.addEventListener('click', () =>{
		cartPanel.classList.remove('hidden');
	})
  }
}

if (clearCartBtn) {
  clearCartBtn.addEventListener('click', () => {
    Cart = [];
    localStorage.setItem('Cart', JSON.stringify(Cart));
    displayCart();
  });
}

if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        checkout();
    });
}

function addToFavourites(monsterId){
    if(Favourites.includes(monsterId)){
        Favourites = Favourites.filter(id => id !== monsterId);
    }else{
        Favourites.push(monsterId);
    }
    localStorage.setItem('Favourites', JSON.stringify(Favourites));
}

function addToCart(monsterId){
    const existingItem = Cart.find(item => item.id === monsterId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        Cart.push({ id: monsterId, quantity: 1 });
    }
    
    localStorage.setItem('Cart', JSON.stringify(Cart));
    displayCart();
    cartPanel.classList.remove('hidden');
}

function removeFromCart(monsterId) {
    Cart = Cart.filter(item => item.id !== monsterId);
    localStorage.setItem('Cart', JSON.stringify(Cart));
    displayCart();
}

function increaseCartQuantity(monsterId) {
    const item = Cart.find(item => item.id === monsterId);
    if (item) {
        item.quantity++;
        localStorage.setItem('Cart', JSON.stringify(Cart));
        displayCart();
    }
}

function decreaseCartQuantity(monsterId) {
    const item = Cart.find(item => item.id === monsterId);
    if (item && item.quantity > 1) {
        item.quantity--;
    } else if (item && item.quantity === 1) {
        removeFromCart(monsterId);
    }
    if (item) {
        localStorage.setItem('Cart', JSON.stringify(Cart));
        displayCart();
    }
}

function displayCart() {
    if (!CartContainer) return;

    CartContainer.innerHTML = '';
    let currentTotal = 0;

    if (Cart.length === 0) {
        CartContainer.innerHTML = '<p class="text-gray-500 text-center">Your cart is empty.</p>';
        if (cartTotalPrice) cartTotalPrice.textContent = '$0.00';
        return;
    }

    Cart.forEach(cartItem => {
        const monster = allMonsters.find(m => String(m.id) == cartItem.id);
        if (monster) {
            currentTotal += monster.price * cartItem.quantity;
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'w-full h-24 flex items-center gap-2 p-1 border rounded';
            cartItemElement.innerHTML = `
                <img src="Monsters-img/${monster.image}" alt="${monster.name}" class="w-16 h-full object-cover rounded" style="border: 2px solid ${colors[monster.rarity]}">
                <div class="flex-1">
                    <p class="font-semibold text-sm">${monster.name}</p>
                    <p class="font-bold text-xs">$${monster.price.toFixed(2)} (each)</p>
                    <div class="flex items-center gap-2 mt-2">
                        <button class="decrease-quantity-btn w-6 h-6 bg-gray-200 rounded font-bold" data-monster-id="${monster.id}">-</button>
                        <span class="font-bold">${cartItem.quantity}</span>
                        <button class="increase-quantity-btn w-6 h-6 bg-gray-200 rounded font-bold" data-monster-id="${monster.id}">+</button>
                    </div>
                </div>
                <button class="remove-from-cart-btn text-red-500 p-2 self-start" data-monster-id="${monster.id}">
                    <i class="fi fi-rr-trash"></i>
                </button>
            `;
            CartContainer.appendChild(cartItemElement);
        }
    });

    if (cartTotalPrice) cartTotalPrice.textContent = `$${currentTotal.toFixed(2)}`;
}

function checkout() {
    if (Cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    Cart.forEach(cartItem => {
        const collectionItem = Collections.find(item => item.id === cartItem.id);

        if (collectionItem) {
            collectionItem.quantity += cartItem.quantity;
        } else {
            Collections.push({ id: cartItem.id, quantity: cartItem.quantity });
        }
    });

    localStorage.setItem('Collections', JSON.stringify(Collections));

    Cart = [];
    localStorage.setItem('Cart', JSON.stringify(Cart));

    displayCart();
    displayCollections(); 
    cartPanel.classList.add('hidden');
    alert('Checkout successful! Your cards have been added to your collection.');
}

function showfavourites(){
    if (!FavouriteContainer) return; 

    FavouriteContainer.innerHTML = '';
    
    if (Favourites.length === 0) {
        FavouriteContainer.innerHTML = '<p class="text-black text-xl">No favourites added yet.</p>';
        if (totalFav) totalFav.textContent = '0';
        if (totalValueFav) totalValueFav.textContent = '$0';
        if (mostExpensiveFav) mostExpensiveFav.textContent = '$0';
        return;
    }

    let totalCards = 0;
    let totalValue = 0;
    let mostExpensivePrice = 0;

    Favourites.forEach((monsterId) => {
        const monster = allMonsters.find(m => String(m.id) == monsterId);
        if (monster) {
            CreateCard(monster, FavouriteContainer); 
            
            totalCards++;
            totalValue += monster.price;
            if (monster.price > mostExpensivePrice) {
                mostExpensivePrice = monster.price;
            }
        }
    });

    if (totalFav) totalFav.textContent = totalCards;
    if (totalValueFav) totalValueFav.textContent = `$${totalValue.toFixed(2)}`;
    if (mostExpensiveFav) mostExpensiveFav.textContent = `$${mostExpensivePrice.toFixed(2)}`;
}

function displayCollections() {
    if (!CollectionContainer) return; 

    CollectionContainer.innerHTML = '';

    if (Collections.length === 0) {
        CollectionContainer.innerHTML = '<p class="text-black text-xl">Your collection is empty. Visit the Market to buy cards!</p>';
        if (totalFav) totalFav.textContent = '0';
        if (totalValueFav) totalValueFav.textContent = '$0';
        if (mostExpensiveFav) mostExpensiveFav.textContent = '$0';
        return;
    }

    let totalCards = 0;
    let totalValue = 0;
    let mostExpensivePrice = 0;

    Collections.forEach(collectionItem => {
        const monster = allMonsters.find(m => m.id == collectionItem.id);
        if (monster) {
            totalCards += collectionItem.quantity;
            totalValue += monster.price * collectionItem.quantity;
            if (monster.price > mostExpensivePrice) {
                mostExpensivePrice = monster.price;
            }

            CreateCollectionCard(monster, collectionItem.quantity, CollectionContainer);
        }
    });

    if (totalFav) totalFav.textContent = totalCards;
    if (totalValueFav) totalValueFav.textContent = `$${totalValue.toFixed(2)}`;
    if (mostExpensiveFav) mostExpensiveFav.textContent = `$${mostExpensivePrice.toFixed(2)}`;
}

function CreateCollectionCard(cardObject, quantity, container) {
    const CardContainer = document.createElement('div');
    CardContainer.classList.add('Card-Container', 'bg-gray-300', 'rounded-lg', 'p-2', 'w-full');
    CardContainer.innerHTML = `
<div class="Card relative w-full aspect-[2/3] bg-gray-200 rounded-lg flex flex-col justify-end items-center gap-2 bg-center bg-cover p-2 shadow-md sm:gap-3 md:gap-4" style="border: 5px solid ${colors[cardObject.rarity]}; background-image: url('Monsters-img/${cardObject.image}');">

    <h3 class="text-white font-bold text-xl sm:text-2xl md:text-3xl drop-shadow-lg">${cardObject.name}</h3>
    <div class="card-description flex justify-around items-center w-full min-h-1/3 bg-gray-200 opacity-90 border-2 border-amber-300 p-1 rounded-xl sm:p-2 sm:rounded-2xl">
        <div class="flex flex-col justify-center items-center gap-1"><img src="img/Power.png" alt="Power" class="w-6 h-6 sm:w-8 sm:h-8"><p class="text-xs sm:text-sm">${cardObject.Power}</p></div>
        <div class="flex flex-col justify-center items-center gap-1"><img src="img/Defence.png" alt="Defence" class="w-6 h-6 sm:w-8 sm:h-8"><p class="text-xs sm:text-sm">${cardObject.Defence}</p></div>
        <div class="flex flex-col justify-center items-center gap-1"><img src="img/Speed.png" alt="Speed" class="w-6 h-6 sm:w-8 sm:h-8"><p class="text-xs sm:text-sm">${cardObject.Speed}</p></div>
    </div>
    <div class="absolute top-0 right-0 w-1/3 h-5 bg-black flex justify-center items-center sm:h-6"><p class="text-white text-xs sm:text-sm">HP${cardObject.hp}</p></div>
    <img src="Element-img/${cardObject.element}.png" alt="Element" class="absolute top-2 left-2 w-6 h-6 sm:w-8 sm:h-8">
</div>
<div class=" relative card-infos flex flex-col w-full p-2 gap-1">
    <div class="absolute top-2 right-2 w-10 h-10 bag-gold text-black flex items-center justify-center rounded-full font-bold text-lg border-2 border-black">
      x${quantity}
    </div>
    <p class="font-semibold text-sm sm:text-base">${cardObject.name}</p>
    <p class="w-fit text-amber-300 bg-black p-1 px-2 rounded-2xl text-xs">${cardObject.rarity}</p>
    <p class="font-bold text-sm sm:text-base">Value: $${(cardObject.price * quantity).toFixed(2)}</p>
</div>
`;
    container.appendChild(CardContainer);
}

if (resetbtn) {
    resetbtn.addEventListener('click', () => {
        rarity.forEach((checkbox) => {
            checkbox.checked = false;
        });
        elements.forEach((element) =>{
            element.checked = false;
        });
        
        currentMonsterList = [...allMonsters];
        displayallcards();
    });
}


if (applyFilterBtn) {
    applyFilterBtn.addEventListener('click', () => {
        const filtered = filterMonsters();
        currentMonsterList = filtered;
        displayallcards();
	});
}

function filterMonsters() {
    let filtered = [...allMonsters];

    const selectedRarities = [];
    rarity.forEach((checkbox) => {
        if (checkbox.checked) {
            selectedRarities.push(checkbox.value);
        }
    });

    if (selectedRarities.length > 0) {
        filtered = filtered.filter(monster => selectedRarities.includes(monster.rarity));
    }

    const selectedElements = [];
    elements.forEach((checkbox) => {
        if (checkbox.checked) {
            selectedElements.push(checkbox.value);
        }
    });

    if (selectedElements.length > 0) {
        filtered = filtered.filter(monster => selectedElements.includes(monster.element));
    }
    return filtered;
}

function displayallcards() {
    if (!MarketContainer) return; 

    MarketContainer.innerHTML = '';

    if (currentMonsterList.length === 0) {
        MarketContainer.innerHTML = '<p class="text-black text-xl">No monsters found matching your filters.</p>';
        return;
    }

    currentMonsterList.forEach((monster) => {
        CreateCard(monster, MarketContainer);
    });
}

function CreateCard(cardObject, container) {
    const monsterId = String(cardObject.id);
    if (!monsterId) {
        console.error('Monster object missing ID:', cardObject);
        return;
    }
    const isFavourite = Favourites.includes(monsterId);

    const CardContainer = document.createElement('div');
    CardContainer.classList.add('Card-Container', 'bg-gray-300', 'rounded-lg', 'p-2', 'w-full');
    CardContainer.innerHTML = `
<div class="Card relative w-full aspect-[2/3] bg-gray-200 rounded-lg flex flex-col justify-end items-center gap-2 bg-center bg-cover p-2 shadow-md sm:gap-3 md:gap-4" style="border: 5px solid ${colors[cardObject.rarity]}; background-image: url('Monsters-img/${cardObject.image}');">
    <h3 class="text-white font-bold text-xl sm:text-2xl md:text-3xl drop-shadow-lg">${cardObject.name}</h3>
    <div class="card-description flex justify-around items-center w-full min-h-1/3 bg-gray-200 opacity-90 border-2 border-amber-300 p-1 rounded-xl sm:p-2 sm:rounded-2xl">
        <div class="flex flex-col justify-center items-center gap-1"><img src="img/Power.png" alt="Power" class="w-6 h-6 sm:w-8 sm:h-8"><p class="text-xs sm:text-sm">${cardObject.Power}</p></div>
        <div class="flex flex-col justify-center items-center gap-1"><img src="img/Defence.png" alt="Defence" class="w-6 h-6 sm:w-8 sm:h-8"><p class="text-xs sm:text-sm">${cardObject.Defence}</p></div>
        <div class="flex flex-col justify-center items-center gap-1"><img src="img/Speed.png" alt="Speed" class="w-6 h-6 sm:w-8 sm:h-8"><p class="text-xs sm:text-sm">${cardObject.Speed}</p></div>
    </div>
    <div class="absolute top-0 right-0 w-1/3 h-5 bg-black flex justify-center items-center sm:h-6"><p class="text-white text-xs sm:text-sm">HP${cardObject.hp}</p></div>
    <img src="Element-img/${cardObject.element}.png" alt="Element" class="absolute top-2 left-2 w-6 h-6 sm:w-8 sm:h-8">
</div>
<div class="card-infos flex flex-col w-full p-2 gap-1">
    <p class="font-semibold text-sm sm:text-base">${cardObject.name}</p>
    <p class="w-fit text-amber-300 bg-black p-1 px-2 rounded-2xl text-xs">${cardObject.rarity}</p>
    <div class="flex justify-between items-center">
        <p class="font-bold text-sm sm:text-base">$${cardObject.price}</p> <div class="flex gap-2">
        <button class="Favourite-btn bag-gold px-2 py-1 rounded-2xl cursor-pointer hover:scale-110 transition-all" data-monster-id="${monsterId}" style="${isFavourite ? 'background-color: #FF6B6B; color: black;' : ''}">
            <i class="fi ${isFavourite ? 'fi-sr-heart' : 'fi-rr-heart'} text-sm sm:text-base"></i><span class="sr-only">Add to favourites</span>
        </button>
        <button class="shop-btn bag-gold px-2 py-1 rounded-2xl cursor-pointer hover:scale-110 transition-transform" data-monster-id="${monsterId}">
            <i class="fi fi-rr-shopping-cart-add text-sm sm:text-base"></i><span class="sr-only">Add to cart</span>
        </button>
        </div>
    </div>
</div>
`;
    container.appendChild(CardContainer);
}

// drag and drop handlers
function dragstartHandler(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function dragoverHandler(ev) {
  ev.preventDefault();
}

function dropHandler(ev) {
  ev.preventDefault();
  const data = ev.dataTransfer.getData("text");
  ev.target.appendChild(document.getElementById(data));
}

const collectionNumber = document.querySelector('.collection-quantity');
const startbtn = document.querySelector('.start-btn');
const drawbtn = document.querySelector('.draw-card-btn');
const startgame = document.querySelector('.start-game');
const endTour = document.querySelector('.end-tour');

function calculatecollection(){
    let cardnumber = 0;
    Collections.forEach((card) =>{
        cardnumber += card.quantity;
    })
    return cardnumber;
}
if(collectionNumber) collectionNumber.textContent = calculatecollection();

function startGame(){

}