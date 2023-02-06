(() => {
  "use strict";
  const body = document.querySelector("body"),
        navMenu = document.querySelector(".nav__links"),
        navSubmenu = document.querySelector(".nav__links__submenu");
       

  // nav section --------------------------------------------------------------
  const desiredMenuHeight = (menu) => {
    return menu.children.length * menu.firstElementChild.clientHeight;
  };

 
  const computedMenuHeight = (menu) => {
    return parseInt(menu.style.height) ? 0 : desiredMenuHeight(menu);
  };


  const updateMenuHeight = (menu, height) => {
    menu.style.height = height + "px";
  };


  document.querySelector(".nav__burger-icon").addEventListener("click", () => {
    updateMenuHeight(navMenu, computedMenuHeight(navMenu));
    updateMenuHeight(navSubmenu, 0); // <-- always close navSubmenu when burger is clicked
  });


  document.querySelector(".nav-toggle-submenu-button").addEventListener("click",  () => {
    let navMenuHeight,
        navSubmenuHeight = computedMenuHeight(navSubmenu);

    updateMenuHeight(navSubmenu, navSubmenuHeight);
    if(document.body.clientWidth < 992){
      navMenuHeight = desiredMenuHeight(navMenu) + navSubmenuHeight;
      updateMenuHeight(navMenu, navMenuHeight);
    };
  });


  window.addEventListener("resize", () => {
    if(window.screen.width >= 992){
      updateMenuHeight(navMenu, 0);
      updateMenuHeight(navSubmenu, 0);
    };
  });

  
  // shopping cart section ----------------------------------------------------
  const setTop = () => {
    let top = window.scrollY;
    return Math.ceil(top) - 1; // 12 Oct 2021: dunno why - 1 is suddenly needed
  };
  window.addEventListener("scroll", setTop);
  

  const modal = document.querySelector(".shopping-cart__modal"),
        cart = document.querySelector(".shopping-cart");

  document.querySelector(".nav__bag-icon").addEventListener("click", () => {
    modal.style.top = setTop() + "px";
    modal.classList.add("modal-show");
    cart.style.top = setTop() + "px";
    cart.classList.add("cart-show");
    body.classList.add("modal-is-open");
  });


  const closeCart = () => {
    modal.classList.remove("modal-show");
    cart.classList.remove("cart-show");
    body.classList.remove("modal-is-open");
  };
  document.querySelector(".shopping-cart__close-button").addEventListener("click", closeCart);
  modal.addEventListener("click", closeCart);

})();// end monogram()
