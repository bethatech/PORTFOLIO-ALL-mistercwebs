(() => {
  'use strict';

  // GLOBAL VARIABLES
  const intersections = new Map(); // used to control flame anims


  const changeTitles = ((indexParam = 0) => {
    Array.from(document.getElementsByClassName('title')).forEach((title, index) => {
      title.style.transform = `translateY(${title.clientHeight * -indexParam}px)`;
      index === indexParam ? title.style.opacity = 1 : title.style.opacity = 0;
    });
  });


  const observeWater = element => {
    const mask = document.getElementById('water__clip-path__path');
    if(element.isIntersecting){
      changeTitles(0);
      mask.style.animationPlayState = 'running';
      return;
    };
    mask.style.animationPlayState = 'paused';
  };


  const animateFlames = element => {
    changeTitles(1);
    clearInterval(intersections.get(element.target));
    intersections.set(element.target, setInterval(() => {
      let rotationSetting = (Math.random() * 3) - 1.4;
      let scaleSetting = (Math.random() * 1.62) - 0.45;
      scaleSetting > 1 ? element.target.style.transform = `rotate(${rotationSetting}deg) scaleY(${scaleSetting})` 
                       : element.target.style.transform = `rotate(${rotationSetting}deg)`;
    }, 200));
  };


  const observeCandles = element => {
    if(element.isIntersecting && intersections.get(element.target) != null){
      animateFlames(element);
    } else if(element.isIntersecting){
      animateFlames(element);
    } else if(!element.isIntersecting && intersections.get(element.target) != null){
      clearInterval(intersections.get(element.target));
    };
  };

  
  // GLOBAL VARIABLE ////////////////////////////
  const observeCoins = element => {
    let coinAnimationClassName;
    document.querySelectorAll('[data-observe="coin"]').forEach(coin => {
      if(element.isIntersecting){
        changeTitles(2);
        window.innerWidth > window.innerHeight ? coinAnimationClassName = 'play-desktop' : coinAnimationClassName = 'play-mobile';
        coin.classList.add(coinAnimationClassName);
      } else {
        coin.classList.remove(coinAnimationClassName);
      };
    });
  };


  const animator = new IntersectionObserver(elements => {
    elements.forEach(element => { // req'd
      switch(element.target.dataset.observe){
        case 'water':
          observeWater(element);
        break;
        case 'candle':
          observeCandles(element);
          break;
          case 'coins':
            observeCoins(element);
          break;
        default:
          console.log('Houston, we have a problem');
      };
    });
  }, {threshold: 0.3});
  

  animator.observe(document.getElementById('water__svg'));
  animator.observe(document.getElementById('coins'));
  Array.from(document.getElementsByClassName('candles__flame-wrapper')).forEach(wrapper =>{
    animator.observe(wrapper);
  });

})();