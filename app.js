const header = document.querySelector("header");
const showfaq = document.querySelectorAll(".show-question");
const hidefaq = document.querySelectorAll(".hide-question");
const answer = document.querySelectorAll(".answer");
const resetbtn = document.querySelector(".reset");
const rarity = document.querySelectorAll('[name="Rarity"]');
let Favourites=[];
let Collection=[];

resetbtn.addEventListener('click', () => {
  rarity.forEach((checkbox) => {
    checkbox.checked = false;
  });
});

window.addEventListener ("scroll", function() {
	header.classList.toggle ("scrolled", window.scrollY > 0);
});

document.addEventListener('click',function(e){
	if(e.target.classList.contains('')){

	}
})
for(let i =0;i<monster.json.lentgh;i++){
	CreateCard(i+1);
}
function CreateCard(id){
   let cardobject = fetch(Data/monster.json/id);
   const Card = document.createElement(div);
   Card.classList.add('flex flex-col justify-end items-center gap-8');
   Card.style.border="5px solid ${ colors[${cardobject.rarity}] }"
   Card.innerHtml = '<h3>${cardobject.name}</h3>'
}