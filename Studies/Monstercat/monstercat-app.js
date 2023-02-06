
// function Monstercat(){
(() => {
  "use strict";
  const body = document.querySelector("body");

  // used by openHeroModal, navPlayer and tracklist 'credit' buttons 
  const getWindowPosition = () => {
    return Math.ceil(window.scrollY);
  };
  window.addEventListener("scroll", getWindowPosition);


  // nav menu section mobile --------------------------------------------------
  (() => { 
    const burger = document.querySelector(".nav__burger"),
          mobileBurger = document.querySelector(".nav__mobile-burger");

    const animateBurger = () => {
      burger.classList.toggle("burger-to-x");
      burger.children[0].classList.toggle("burger-to-x-top");
      burger.children[1].classList.toggle("burger-to-x-mid");
      burger.children[2].classList.toggle("burger-to-x-bot");
    };

    
    const animateMobileBurger = () => {
      mobileBurger.children[0].classList.toggle("burger-to-x-moburg-top");
      mobileBurger.children[1].classList.toggle("burger-to-x-moburg-bot");
    };
    

    const toggleMobileMenu = () => {
      document.querySelector(".nav__mobile-menu").classList.toggle("show-nav__mobile-menu");
      animateBurger();
      animateMobileBurger();
    };
    burger.addEventListener("click", toggleMobileMenu);
    mobileBurger.addEventListener("click", toggleMobileMenu);
    
  })(); // end of nav menu section


  // nav submenus section desktop ---------------------------------------------
  (() => {   
    const navMain = document.querySelector(".nav__main-container"),
          comList = document.querySelector(".nav__ul-comm"),
          radList = document.querySelector(".nav__ul-radio");


    const toggleMenu = (list) => {
      navMain.classList.toggle("add-margin-bottom");
      list.classList.toggle("show-items");
    };


    const animateSubmenus = (thisList, otherList) => {
      if (otherList.classList.contains("show-items")){
        toggleMenu(otherList);
        let timeout = setTimeout( () => {
          toggleMenu(thisList);
        }, 300);
      } else {
        toggleMenu(thisList);
      };
    };

    
    document.querySelector(".nav__ul-com-btn").addEventListener("click", () => {
      animateSubmenus(comList, radList);
    });


    document.querySelector(".nav__ul-radio-btn").addEventListener("click", () => {
      animateSubmenus(radList, comList);
    });
  })(); // end of nav submenus section


  // nav__player section ------------------------------------------------------
  (() => {
    const player = document.querySelector(".nav__player"),
          progFill = document.querySelector(".nav__player__track-progress-fill"),
          playerPlayIcon = document.querySelector(".player__play-icon"),
          playerPauseIcon = document.querySelector(".player__pause-icon"),
          playerLoadIcon = document.querySelector(".player__loading-icon"),
          playerVolumeBtn = document.querySelector(".nav__player__volume-btn"),
          playerVolumeMeterBody = document.querySelector(".nav__player__volume-meter-body"),
          playerVolumeIndicator = document.querySelector(".nav__player__volume-indicator"),
          trackPlayBtns = Array.from(document.querySelectorAll(".tracklist__play-btn"));

    let isPlaying = false,
        indexOfCurrentTrack = null, // also used to determine if player has been activated
        progInterval,
        progPercentage,
        loadingTimeout; // used by waitToStartProgbar()


    const adjustPlayerForScreenWidth = () => {
      if(document.body.clientWidth > 1070){
        playerVolumeBtn.classList.remove("hide-element");
        if(indexOfCurrentTrack == null) playerPlayIcon.classList.remove("hide-element");                
      } else {
        playerVolumeBtn.classList.add("hide-element");
      };
    };
    window.addEventListener("resize", adjustPlayerForScreenWidth);
    adjustPlayerForScreenWidth();


    // ProgBar section ----------------------------------------------------
    const getAnimationTime = (index) => {
      const trackTimes = Array.from(document.querySelectorAll(".tracklist__time"));
      let trackLength = trackTimes[index].innerHTML,
          minsAndSecs = trackLength.split(":");
      return parseInt((+minsAndSecs[0] * 56) + (+minsAndSecs[1])); // 56 seems to work best for this simulation
    };


    const resetProgBar = () => {
      clearInterval(progInterval);
      progInterval = null;
      progPercentage = 0;
      progFill.style.width = 0;
    };
    

    const pauseResumeProgBar = () => {
      if(isPlaying) {
        clearInterval(progInterval);
      } else {
        progInterval = setInterval(animateProgBar, getAnimationTime(indexOfCurrentTrack));
      };
    };


    const animateProgBar = () => {
      progPercentage += 0.1;
      progFill.style.width = progPercentage + "%";
      if(progPercentage >= 100){
        clearInterval(progInterval);
        if(indexOfCurrentTrack === trackPlayBtns.length - 1) return; 
        resetProgBar();
        playNewTrack(indexOfCurrentTrack + 1);
      };
    };


    const startProgBar = (index) => {
      resetProgBar();
      progInterval = setInterval(animateProgBar, getAnimationTime(index));
    };


    // pauses and prevents issues while loading icon is doing it's whirly thang
    const waitToStartProgBar = () => {
      body.style.pointerEvents = "none";
      resetProgBar();
      loadingTimeout = setTimeout( () => {
        playerLoadIcon.classList.add("hide-element");
        playerPauseIcon.classList.toggle("hide-element");
        startProgBar(indexOfCurrentTrack);
        body.style.pointerEvents = "revert";
      }, 1000);
    };


    // icon manipulation ------------------------------------------------------
    const toggleTrackIcons = (index) => {
      const trackPlayIcons = Array.from(document.querySelectorAll(".tracklist__play-icon")),
            trackPauseIcons = Array.from(document.querySelectorAll(".tracklist__pause-icon"));

      trackPauseIcons[index].classList.toggle("hide-element");
      trackPlayIcons[index].classList.toggle("hide-element");
    };


    const togglePlayerIcons = () => {
      playerPlayIcon.classList.toggle("hide-element");
      playerPauseIcon.classList.toggle("hide-element");
    };

    
    // misc -------------------------------------------------------------------
    const displayArtistAndTitle = (index) => {
      const trackArtistAndTitles = Array.from(document.querySelectorAll(".tracklist__credit-btn"));
      document.querySelector(".nav__player__artist-song").innerHTML = trackArtistAndTitles[index].dataset.trackinfo;
    };


    const setCurrentIndex = (index) => {
      if(index < 0){
        indexOfCurrentTrack = trackPlayBtns.length - 1;
      } else if (index >= trackPlayBtns.length){
        indexOfCurrentTrack = 0;
      } else {
       indexOfCurrentTrack = index;
      };
    };


    // player section ---------------------------------------------------------
    const pauseResumePlayer = () => {
      clearTimeout(loadingTimeout); // <-- in case user reacts before timeout is finished
      toggleTrackIcons(indexOfCurrentTrack);
      togglePlayerIcons();
      pauseResumeProgBar();
      isPlaying = !isPlaying;
    };


    const prepPlayer = () => {
      if(isPlaying){
        playerPauseIcon.classList.add("hide-element");
      } else {
        playerPlayIcon.classList.add("hide-element");
      };
      playerLoadIcon.classList.remove("hide-element");
      displayArtistAndTitle(indexOfCurrentTrack);
      waitToStartProgBar();
    };


    const playNewTrack = (index) => {
      if(isPlaying) toggleTrackIcons(indexOfCurrentTrack);
      setCurrentIndex(index);
      prepPlayer(); // prepPlayer() also starts progBar
      toggleTrackIcons(indexOfCurrentTrack);
      isPlaying = true;
    };


    const setPlayerPositionFixed = () => {
      window.addEventListener("scroll", () => {
        const playerBtnsContainer = document.querySelector(".nav__player__btns-container");

        if(window.scrollY > 100){
          player.classList.add("player-scrolled-position");
          playerBtnsContainer.classList.add("btns-container-scrolled-position");
          playerVolumeMeterBody.classList.add("nav__volume-scrolled-position");
        } else {
          player.classList.remove("player-scrolled-position");
          playerBtnsContainer.classList.remove("btns-container-scrolled-position");
          playerVolumeMeterBody.classList.remove("nav__volume-scrolled-position");
        };
      });
    };


    const activatePlayer = (index) => {
      playNewTrack(index);  
      player.classList.remove("pointer-events-none","hide-element");
      document.querySelector(".nav__player__track-progress").style.display = "flex";
      setPlayerPositionFixed();
    };


    // a gaggle of eventListeners ----------------------------------------------
    document.querySelector(".listen__button").addEventListener("click", () => {
      adjustPlayerForScreenWidth();
      if(indexOfCurrentTrack == null){
        activatePlayer(0); // play first song
      } else {
        pauseResumePlayer();
      };
    });


    document.querySelector(".nav__player__play-btn").addEventListener("click", () => {
      pauseResumePlayer();
    });


    document.querySelector(".nav__player__previous-btn").addEventListener("click", () => {
      playNewTrack(indexOfCurrentTrack - 1);
    });


    document.querySelector(".nav__player__next-btn").addEventListener("click", () => {
      playNewTrack(indexOfCurrentTrack + 1);
    });


    document.querySelector(".nav__player__shuffle-btn").addEventListener("click", (event) => {
      event.currentTarget.classList.toggle("orange");
    });


    document.querySelector(".nav__player__repeat-btn").addEventListener("click", (event) => {
      event.currentTarget.classList.toggle("orange");
    });


    playerVolumeBtn.addEventListener("click", () => {
      playerVolumeMeterBody.classList.toggle("nav__volume-button-clicked");
    });


    //  nav volume meter section
    let isFirstClick = true; // only used here

    document.querySelector(".nav__player__volume-meter").addEventListener("click", (e) => {
      let indicatorHeight = playerVolumeMeterBody.clientHeight + 32; // why 32?

      if(playerVolumeMeterBody.classList.contains("nav__volume-scrolled-position")){
        indicatorHeight = playerVolumeMeterBody.clientHeight - 10; // now -10!?! wtf?
      };
      if(isFirstClick){
        // turn the player way down
        playerVolumeIndicator.style.top = "98%"; 
        isFirstClick = false;
      } else {
        playerVolumeIndicator.style.top = ((e.clientY - indicatorHeight)) + "px";
      };
    });


    // tracklist play/pause action --------------------------------------------
    trackPlayBtns.forEach((btn, index) => {
      btn.addEventListener("click", () => {
        if(indexOfCurrentTrack == null){
          activatePlayer(index);
        } else if(index === indexOfCurrentTrack){
          pauseResumePlayer();
        } else {
          playNewTrack(index);
        };
      });
    });
  })(); //end of nav__player section



  // hero__modal section ------------------------------------------------------
  (() => {
    const toggleHeroModal = () => {
      const heroImage = document.querySelector(".hero__modal__img-container"),
            heroModalContainer = document.querySelector(".hero__modal-container");

      heroModalContainer.style.top = getWindowPosition() + "px";
      heroModalContainer.classList.toggle("show-element");
      heroImage.classList.toggle("grow-element");
      body.classList.toggle("modal-open");
    };
    document.querySelector(".hero > img").addEventListener("click", toggleHeroModal);
    document.querySelector(".hero__modal").addEventListener("click", toggleHeroModal);
  })(); //end of hero__modal section
  
  
  
  // tracklist credit/licencing modal -----------------------------------------
  (() => {
    const tracklistModalContainer = document.querySelector(".tracklist__modal-container"),
          tracklistInfo = document.querySelector(".tracklist__modal-card"),
          modalTextarea = document.querySelector(".tracklist__modal-card textarea");

    const fillTextarea = (btn) => {
      const FIRST_LINE = "Music provided by Monstercat:\n",
            LINES_3_AND_4 = "https://youtube.com/monstercat\nhttps://youtube.com/monstercatinstinct";
      modalTextarea.value = FIRST_LINE + btn.dataset.trackinfo + "\n" + LINES_3_AND_4;
    };


    Array.from(document.querySelectorAll(".tracklistCreditButton")).forEach((btn) => {
      btn.addEventListener("click", () => {
        body.classList.add("modal-open"); 
        fillTextarea(btn);
        tracklistModalContainer.style.top = getWindowPosition() + "px";
        tracklistModalContainer.classList.add("show-element");
        tracklistInfo.classList.add("grow-element");
      });
    });


    const closeTracklistModal = () => {
      body.classList.remove("modal-open");
      tracklistModalContainer.classList.remove("show-element");
      tracklistInfo.classList.remove("grow-element");
    };
    document.querySelector(".tracklist__modal-card button").addEventListener("click", closeTracklistModal);
    document.querySelector(".tracklist__modal").addEventListener("click", closeTracklistModal);


    modalTextarea.addEventListener("click", () => {
      const confirmation = document.querySelector(".tracklist__modal-confirmation");

      modalTextarea.select();
      confirmation.classList.add("show-element", "grow-element");
      let timeout = setTimeout(function(){
        confirmation.classList.remove("show-element", "grow-element");
      }, 2000);
    });
  })(); // end of tracklist modal


  // Message-support section --------------------------------------------------
  (() => {
    const msgSupportPopup = document.querySelector(".footer__message-support");
    
    document.querySelector(".footer__ul-small button").addEventListener("click", () => {
      msgSupportPopup.classList.add("footer__message-support-show");
    });
    
    document.querySelector(".footer__message-support__close-button").addEventListener("click", () => {
      msgSupportPopup.classList.remove("footer__message-support-show");
    });
  })(); //end of messageSupport()
})(); //end of Monstercat()


