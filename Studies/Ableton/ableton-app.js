(() => {
  "use strict";
  const dropdownMenu = document.querySelector(".nav__links--dropdown");

  if(document.body.clientWidth < 1024) dropdownMenu.classList.remove("hide-element");
  
  document.querySelector(".nav__button--more").addEventListener("click", () => {
    const plusVertical = document.querySelector(".nav__plus-vertical");
    dropdownMenu.classList.toggle("hide-element");
    plusVertical.classList.toggle("hide-element");
  });
})();
