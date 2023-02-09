
(() => {

  // CONTENTS
    // mobile nav 23
    // hero lamp anims 83
    // hero loading 108
    // hero banner 124
    // section indicators 153
    // hero button clicked 200
    // floor/banner scroll anim 216
    // section reveal anims 234
    // projects__poster-3 show/hide 249
    // dancing tards 260
    // contact form 290
    // contact submit 336
    // contact thank you button 370

  'use strict';
  gsap.registerPlugin(ScrollTrigger);
  // gsap.registerPlugin(ScrollTo);

  // MOBILE NAV

  const modal = document.getElementById('modal'),
        header = modal.nextElementSibling,
        openButton = document.getElementById('nav__menu__open-button'),
        navMenu = openButton.nextElementSibling,
        closeButton = navMenu.firstElementChild,
        navListItems = Array.from(closeButton.nextElementSibling.children),
        NOPACITY = 'nOpacity';

  const openNavMenu = () => {
    openButton.classList.remove('reset');
    header.classList.add('overflow-visible');
    window.scrollY === 0 ? navMenu.classList.add('open') : navMenu.classList.add('open--scrolled');
    navListItems.forEach((item, index) => {
      item.classList.add(`open`);
      index++;
    });
  };
  // event listener, calls openNavMenu
  openButton.addEventListener('click', () => {
    openButton.firstElementChild.classList.add('opacity'); // engine on
    openButton.classList.add('clicked');
    closeButton.classList.add('pre-animation');
    document.body.classList.add('modal--open')
    modal.classList.add('open');
    openNavMenu();
  });

  const resetNavMenu = () => {
    setTimeout(() => {
      let index = 1;
      openButton.classList.remove(NOPACITY);
      closeButton.classList.remove('pre-animation');
      closeButton.firstElementChild.classList.remove('opacity'); // engine off
      navListItems.forEach((item) => {
        item.classList.remove(`open`);
        index++;
      });
      header.classList.remove('overflow-visible');
    }, 900);
  };

  const closeNavMenu = () => {
    closeButton.firstElementChild.classList.add('opacity'); // engine on
    document.body.classList.remove('modal--open')
    modal.classList.remove('open');
    openButton.classList.add(NOPACITY); // opacity 0 to move across screen
    openButton.classList.remove('clicked');
    openButton.classList.add('reset');
    openButton.firstElementChild.classList.remove('opacity'); // engine off
    navMenu.classList.contains('open') ? navMenu.classList.remove('open') : navMenu.classList.remove('open--scrolled');
    resetNavMenu();
  };
  // event listeners, call closeNavMenu
  modal.addEventListener('click', closeNavMenu);
  closeButton.addEventListener('click', closeNavMenu);
  navMenu.addEventListener('click', closeNavMenu);

  
  // HERO__LAMP ANIMS (used by hero loading anim)


  const heroLampTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: header.nextElementSibling,
      end: 'bottom-=10% top',
      toggleActions: "play pause resume pause"
    }
  });

  Array.from(document.getElementsByClassName('hero__lamp__flame')).forEach(flame => {
    heroLampTimeline.add(
      gsap.to(flame, {
        duration: 0.25, 
        repeat: -1,
        onRepeat: () => {
          let opacitySetting = Math.random();
          if (opacitySetting > 0.5) flame.style.opacity = opacitySetting;
        }
      })
    );
  });


  // HERO SECTION LOADING ANIMS ---------------------------------------------------------------


  const heroH1 = document.getElementById('hero__h1');

  window.addEventListener('DOMContentLoaded', event => {
    gsap.timeline({delay: 0.5})
      .to('#nav__logo', {opacity: 1.2, duration: 1.2, ease: Power0.easeNone})
      .to([openButton, closeButton.nextElementSibling], {x: 0, duration: 1}, '<75%') // nav__ul
      .to(heroH1.nextElementSibling, {x: 0, duration: 1}, '<50%') // hero button
      .to(heroBanner.parentElement, {y: 0, duration: 3.25}, '<25%')
      .to(heroH1, {opacity: 1, duration: 3, ease: Power0.easeNone}, '<35%')
      .add(heroLampTimeline, '+=0.5')
  });


  // HERO__BANNER
  
  
  // construction
  const heroBanner = document.getElementById('hero__banner'),
        NUMBER_OF_PANELS = 26;

  for(let i = 0; i < NUMBER_OF_PANELS; i++){
    const content = document.createElement('p'),
          panel = document.createElement('div');

    content.className = 'hero__banner__content';
    content.innerText = 'Design • Development • Hosting • Illustrations •';
    content.style.left = `${-i}em`;
    panel.className = 'hero__banner__panel';
    panel.style.transform = `translate(-50%, -50%) rotateY(${(360 / NUMBER_OF_PANELS) * i}deg) translateZ(4.1em)`;
    heroBanner.appendChild(panel).appendChild(content);
  };
  // pause/resume, initial state set in a-hero.css --> .to or .set heroBanner translateY(0.35em)
  ScrollTrigger.create({
    trigger: heroBanner.parentElement.parentElement, // hero__scene
    start: 'top bottom',
    end: '25% top',
    onToggle: self => {
        self.isActive ? heroBanner.classList.add('running') : heroBanner.classList.remove('running');
    }
  });

      
  // SECTION INDICATORS --> h2, nav li


  const sectionH2s = Array.from(document.getElementsByClassName('section__h2')),
        sections = [], // filled-in in navListItems.forEach vv
        INDICATOR_CLASS_NAME = 'display-current-page';
  
  // when li clicked, update li & h2
  navListItems.forEach((listItem, index) => {
    sections.push(sectionH2s[index].parentElement);
    listItem.addEventListener('click', () => {
      navListItems.forEach((item, index2) => {
        item.classList.remove(INDICATOR_CLASS_NAME);
        sectionH2s[index2].classList.remove(INDICATOR_CLASS_NAME);
      });
      navListItems[index].classList.add(INDICATOR_CLASS_NAME);
      sectionH2s[index].classList.add(INDICATOR_CLASS_NAME);
    });
  });
  
  sections.forEach((section, index) => {
    // section__h2
    ScrollTrigger.create({
      trigger: section,
      start: 'top top+=7%',
      end: 'bottom top+=23%',
      toggleClass: {targets: sectionH2s[index], className: INDICATOR_CLASS_NAME}
    });
    // nav__li
    if(index === 0){ // <-- adjustment for hero section < 100vh
      ScrollTrigger.create({
        trigger: section,
        start: 'top-=30% top',
        end: 'bottom-=10% top',
        toggleClass: {targets: navListItems[index], className: INDICATOR_CLASS_NAME}  
      });     
    } else {
      ScrollTrigger.create({
        trigger: section,
        start: 'top-=10% top',
        end: 'bottom-=10% top',
        toggleClass: {targets: navListItems[index], className: INDICATOR_CLASS_NAME}  
      });
    };
  });


  // (heroH1.nextElementSibling) HERO BUTTON CLICKED


  heroH1.nextElementSibling.addEventListener('click', () => {
    const page = document.getElementsByTagName('html');
    heroH1.nextElementSibling.firstElementChild.classList.add('opacity'); // engine on
    heroH1.nextElementSibling.classList.add('clicked');
    gsap.to(window, {delay: 0.5, duration: 1, scrollTo: '#projects',
      onStart: () => {page[0].classList.add('auto');},
      onComplete: () => {page[0].classList.remove('auto');
        heroH1.nextElementSibling.firstElementChild.classList.remove('opacity');
        heroH1.nextElementSibling.classList.remove('clicked');}
    });
  });


  // FLOOR / BANNER SCROLL ANIM


  gsap.timeline({defaults: {duration: 1, ease: "none",},
    scrollTrigger: {
      trigger: sections[0],
      start: () => {return `center bottom-=${sections[0].clientHeight * 0.51}`},
      end: 'bottom top',
      scrub: 0.1
      // markers: true
    }
  })
    .set(heroBanner.parentElement.nextElementSibling, {'perspective-origin': '50% 1%'}) // hero__walk
    .set(heroBanner.parentElement, {y: 0, 'perspective-origin': '100% calc(100% + 4rem);'}) // banner-container
    .to(heroBanner.parentElement.nextElementSibling, {'perspective-origin': '50% 225%'})
    .to(heroBanner.parentElement, {y: (heroBanner.parentElement.nextElementSibling.clientHeight * 2.1)}, '<')
    .to(['.hero__lamprow-2', '.hero__lamprow-3'], {bottom: '-22vh'}, '<');


  // SECTION REVEAL ANIMS


  const createRevealer = element => {
    ScrollTrigger.create({
      trigger: element,
      start: 'top bottom-=40%',
      toggleClass: 'loading-anim',
      once: true,
    });
  };
  // every poster-header, portrait, & tard gets a loading trigger
  document.querySelectorAll('[data-observe="load"]').forEach(element => createRevealer(element));


  // PROJECTS-POSTER-3 show/hide 'Water' anim
  

  ScrollTrigger.create({
    trigger: sections[1],
    start: 'top+=10% bottom',
    end: 'bottom-=10% top',
    toggleClass: {targets: ".page-viewer-3", className: "visible"}
  });


  // DANCING TARDS


  const tardTimeLine = gsap.timeline({defaults: {duration: 0.5, repeat: -1}}),
        flames = Array.from(document.getElementsByClassName('personalities__hoverer__flame'));

  tardTimeLine.paused(true) // if !set here? plays on page load or not at all
    .fromTo('#personalities__horn-player__head', 
      {rotate: 13, x: '0.05em'}, {rotate: 0, x: 0})
    .fromTo('#personalities__horn-player__middle', 
      {rotate: 6}, {rotate: 0}, 0)
    .fromTo(['#personalities__big-clare__top', '#personalities__programmer__head'],
      {rotate: -4}, {rotate: 0}, 0)
    .fromTo(['#personalities__reg-clare__all', '#personalities__barritone__all'],
      {scaleX: 1, scaleY: 1}, {scaleX: 0.95, scaleY: 1.05}, 0);
    
  ScrollTrigger.create({
    trigger: sections[2],
    start: 'top+=10% bottom',
    end: 'bottom-=10% top',
    animation: tardTimeLine, 
    toggleActions: "play pause resume pause",
    onToggle: self => {
      flames.forEach(flame => {
        self.isActive ? flame.classList.add('running') : flame.classList.remove('running');
      });
    }
  });


  //  CONTACT FORM
  
  
  const contactForm = document.getElementById('contact__form'),
        contactInputs = Array.from(document.getElementsByClassName('contact__input-field')),
        contactErrors = contactForm.firstElementChild,
        thankYouForm = contactForm.nextElementSibling,
        contactModal = contactForm.parentElement.parentElement.firstElementChild;

  const labelShifted = input => {
    if(input.value.length > 0){
      input.nextElementSibling.classList.add('shifted'); // <-- input labels
      return true;
    };
    input.nextElementSibling.classList.remove('shifted');
    return false;
  };

  // initialize/refresh form
  contactInputs.forEach(input => {
    labelShifted(input);
    input.addEventListener('input', () => {
      labelShifted(input);
      contactErrors.classList = '';
      input.classList.remove('err-open');
    });
  });

  const handleInputErrors = index => {
    const errMsg = [
      'Enter some kind of name',
      'N/A',
      'Missing email address. Try again?',
      'How can we be of service?',
      'Invalid email address. Try again?'
      ],
    errPosition = ['name', 'N/A', 'email', 'message', 'email'];
    
    contactErrors.classList = `err-msg-position-${errPosition[index]}`;
    contactErrors.firstElementChild.innerText = errMsg[index];
    if(index === 4) index = 2; // index of email input
    contactInputs[index].classList.add('err-open');
    contactInputs[index].focus();
  };


  // CONTACT SUBMIT

  
  const validEmail = emailAddress => {
    const cleanValue = String(emailAddress).toLowerCase();
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(cleanValue);
  };

  contactForm.addEventListener('submit', e => {
    e.preventDefault(); //won't GET     
      for(let index = 0; index < contactInputs.length; index++){
        if(index === 1) continue; // company name field, no checks req'd
        const trimmedInput = contactInputs[index].value.trim();
        if(trimmedInput.length < 1){
          contactInputs[index].classList.add('invalid');
          handleInputErrors(index);
          return;
        };
        if(index === 2 && !validEmail(trimmedInput)){
          contactInputs[index].classList.add('invalid');
          const invalidEmailAlert = 4; // kluge
          handleInputErrors(invalidEmailAlert);
          return;
        };
        // next 4 lines skipped unless all inputs valid
        contactInputs[index].classList.remove('invalid');
      }; // end for()
    document.body.classList.add('modal--open');
    contactModal.classList.add('open');
    thankYouForm.classList.add('show');
  }); // end contact submit
  
  
  // CONTACT THANK YOU BUTTON 
  
  
  const closeThankYou = () => {
    contactErrors.classList = ''; // cautious ;)
    contactInputs.forEach(input => {
      input.classList.remove('invalid');
    });
    document.body.classList.remove('modal--open');
    contactModal.classList.remove('open');
    thankYouForm.classList.remove('show');
  };
  // event listeners
  thankYouForm.lastElementChild.addEventListener('click', element => closeThankYou());
  contactModal.addEventListener('click', () => closeThankYou());
})(); // end 