const header = document.querySelector("header");
const showButtons = document.querySelectorAll('.show-question');
const hidefaq = document.querySelectorAll(".hide-question");
const resetbtn = document.querySelector(".reset");
const rarity = document.querySelectorAll('[name="Rarity"]');
const elements =document.querySelectorAll('[name="Element"]');
const Commun =document.getElementById('Commun');
const Rare =document.getElementById('Rare');
const Epic =document.getElementById('Epic');
const Legendary =document.getElementById('Legendary');
const mythic =document.getElementById('Mythic');
const fire= document.getElementById('Fire');
const water= document.getElementById('Water');
const earth= document.getElementById('Earth');
const air= document.getElementById('Air');
const light= document.getElementById('Light');
const dark= document.getElementById('Dark');

const MarketContainer= document.querySelector('Market-cards');

const colors = {
	  'Commun': '#A0A0A0',
	  'Rare': '#0000FF',
	  'Epic': '#800080',
	  'Legendary': '#FFA500',
	  'Mythic': '#FF0000'
};
let Favourites=[];
let Collection=[];
let allMonsters=[];


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

fetch('Monsters.json')
  .then(response => response.json())
  .then(data => {
    allMonsters = data;
    displayCards(allMonsters);
  })
  .catch(error => console.error('Error loading monsters:', error));

function CreateCards(cardobject){
  
   const Card = document.createElement(div);
   Card.classList.add('flex flex-col justify-end items-center gap-8');
   Card.style.border="5px solid ${ colors[${cardobject.rarity}] }"
   body.innerHtml += `
                   <div class="Card relative w-64 h-96 bg-gray-200 rounded-lg flex-shrink-0 mx-2 flex flex-col justify-end items-center gap-4 border-6 border-amber-300 bg-[url('Monsters-img/dragon.png')] bg-center bg-cover p-2 shadow-md">
                    <h3 class="text-white font-bold text-3xl">Dragon</h3>
                    <div class="card-description w-full h-1/3 bg-gray-200 opacity-90 border-2 border-amber-300 justify-around rounded-2xl"></div>
                    <div class="absolute top-0 right-0 w-1/3 h-6 bg-black flex justify-center items-center">
                    <p class="text-white">HP150</p>
                    </div>
                    </div>`
}