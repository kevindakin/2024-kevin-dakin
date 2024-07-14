//
// FUNCTION DECLARATIONS
//

// Work Swiper

function workSwiper() {
    const swiper = new Swiper(".swiper", {
      slidesPerView: 1,
      forceToAxis: true,
      speed: 400,
      breakpoints: {
        768: {
          slidesPerView: 2,
        },
      },
    });
  }
  
  // Drag mouse follow
  
  function dragCursor() {
    const trigger = document.querySelector(".work-swiper_container");
    const cursor = document.querySelector(".drag_component");
  
    trigger.addEventListener("mousemove", (event) => {
      const rect = trigger.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;
  
      cursor.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    });
  
    trigger.addEventListener("mouseenter", (event) => {
      const rect = trigger.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;
  
      cursor.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  
      gsap.set(cursor, { display: "flex" });
      gsap.to(cursor, {
        scale: 1,
        opacity: 1,
        duration: durationBase,
        ease: easeBase,
      });
    });
  
    trigger.addEventListener("mouseleave", () => {
      gsap.to(cursor, {
        scale: 0.5,
        opacity: 0,
        duration: durationBase,
        ease: easeBase,
        onComplete: () => {
          gsap.set(cursor, { display: "none" });
        },
      });
    });
  }
  
  //
  // FUNCTION INITS
  //
  
  workSwiper();
  // dragCursor();  