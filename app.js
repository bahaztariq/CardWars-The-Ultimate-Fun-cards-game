const header = document.querySelector("header");
const showButtons = document.querySelectorAll('.show-question');
const resetbtn = document.querySelector(".reset");
const applyFilterBtn = document.querySelector(".Apply-filter")
//rarity
const rarity = document.querySelectorAll('[name="Rarity"]');
const Commun =document.getElementById('Commun');
const Rare =document.getElementById('Rare');
const Epic =document.getElementById('Epic');
const Legendary =document.getElementById('Legendary');
const mythic =document.getElementById('Mythic');
//element
const elements =document.querySelectorAll('[name="Element"]');
const fire= document.getElementById('Fire');
const water= document.getElementById('Water');
const earth= document.getElementById('Earth');
const air= document.getElementById('Air');
const light= document.getElementById('Light');
const dark= document.getElementById('Dark');
//containers
const MarketContainer= document.querySelector('.Market-cards');
const FavouriteContainer=document.querySelector('.Favourite-container');
const CollectionContainer=document.querySelector('.collection-container');
const CartContainer=document.querySelector('.Cart-container');
//colors for rarity border
const colors = {
	  'Common': '#373636ff',
	  'Rare': '#0000FF',
	  'Epic': '#800080',
	  'Legendary': '#FFA500',
	  'Mythic': '#FF0000'
};
//global variables
let Favourites=[];
let Collections=[];
let allMonsters=[];
let Cart=[];
let monsterLength;

localStorage.clear();

//fetching data from json file
fetch('Monsters.json')
.then(response => response.json())
.then(data => {
allMonsters = data;
displayCards(allMonsters);
})
.catch(error => console.error('Error loading monsters:', error));

// show faq answer
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

// showCard Detailles
const cardDetailles = document.querySelector('.Card-detailles');


//******************************************************************************** */
document.addEventListener('click', function(e){
if(e.target.classList.contains('Card')){
cardDetailles.classList.toggle('hidden');
}else if(e.target.parentNode.classList.contains('Card')){
cardDetailles.classList.toggle('hidden');
}

const favBtn = e.target.closest('.Favourite-btn');
if (favBtn) {
const monsterId = favBtn.dataset.monsterId;
addToFavourites(monsterId);
return;
}

const shopBtn = e.target.closest('.shop-btn');
if (shopBtn) {
const monsterId = shopBtn.dataset.monsterId;
addToCart(monsterId);
return;
}
});

function addToFavourites(monsterId){
if(Favourites.includes(monsterId)){
Favourites = Favourites.filter(id => id !== monsterId);
}else{
Favourites.push(monsterId);
}
localStorage.setItem('Favourites', JSON.stringify(Favourites));
}

function addToCart(monsterId){
if(Cart.includes(monsterId)){
Cart = Cart.filter(id => id !== monsterId);
}else{
Cart.push(monsterId);
}
localStorage.setItem('Cart', JSON.stringify(Cart));
}

function showfavourites(){
let monsterfav = [...allMonsters];
Favourites = JSON.stringify(monsterfav);
localStorage.setItem('Favourites',Favourites);
FavouriteContainer.innerHTML=``;
FavouriteContainer.appendChild(Card);
}
/********************************************************************************** */
//Reseting filters
resetbtn.addEventListener('click', () => {
rarity.forEach((checkbox) => {
checkbox.checked = false;
});
elements.forEach((element) =>{
element.checked = false;
});
displayCards(allMonsters);
});

// apply filters
applyFilterBtn.addEventListener('click', () => {
const filtered = filterMonsters();
displayCards(filtered);
});
// create a filtred liste
function filterMonsters() {
let filtered = [...allMonsters];

// Filter by Rarity
const selectedRarities = [];
rarity.forEach((checkbox) => {
if (checkbox.checked) {
selectedRarities.push(checkbox.value);
}
});

if (selectedRarities.length > 0) {
filtered = filtered.filter(monster => selectedRarities.includes(monster.rarity));
}

// Filter by Element
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
// // display list
function displayCards(monstersArray) {
MarketContainer.innerHTML = '';

if (monstersArray.length === 0) {
MarketContainer.innerHTML = '<p class="text-black text-xl">No monsters found matching your filters.</p>';
return;
}

monstersArray.forEach((monster) => {
CreateCard(monster);
});
}

// Create card
function CreateCard(cardObject) {
const monsterId = cardObject.id || cardObject.name;
if (!monsterId) {
console.error('Monster object missing ID and Name:', cardObject);
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
MarketContainer.appendChild(CardContainer);
}