//
// FUNCTION DECLARATIONS
//

// Featured work scroll animation

function workScroll() {
    const projects = document.querySelectorAll(".ft-work_item-wrap");
  
    projects.forEach((project) => {
      const projectAnim = gsap.timeline({
        scrollTrigger: {
          trigger: project,
          start: "top bottom",
          toggleActions: "play none none reverse",
        },
        defaults: {
          duration: durationSlow,
          ease: easeBase,
        },
      });
  
      projectAnim.from(project, {
        opacity: 0,
        filter: "blur(8px)",
      });
    });
  }
  
  //if (window.matchMedia("(min-width: 992px)").matches) {
  
  function workParallax() {
    if (window.matchMedia("(min-width: 992px)").matches) {
      const elements = document.querySelectorAll(".ft-work_item-wrap");
  
      elements.forEach((item, index) => {
        let yStart, yEnd, scrubValue;
  
        switch (index) {
          case 0:
            yStart = "4rem";
            yEnd = "-4rem";
            scrubValue = 1;
            break;
          case 1:
            yStart = "-3rem";
            yEnd = "3rem";
            scrubValue = 0.8;
            break;
          case 2:
            yStart = "4rem";
            yEnd = "-4rem";
            scrubValue = 1.2;
            break;
          case 3:
            yStart = "-4rem";
            yEnd = "4rem";
            scrubValue = 1;
            break;
          case 4:
            yStart = "-3rem";
            yEnd = "3rem";
            scrubValue = 1;
            break;
          case 5:
            yStart = "4rem";
            yEnd = "-4rem";
            scrubValue = 1;
            break;
        }
  
        const parallaxAnim = gsap.timeline({
          defaults: {
            ease: "none",
          },
          scrollTrigger: {
            trigger: item,
            start: "top bottom",
            end: "bottom top",
            scrub: scrubValue,
          },
        });
  
        parallaxAnim.fromTo(item, { y: yStart }, { y: yEnd });
      });
    }
  }
  
  //
  // FUNCTION INITS
  //
  
  workScroll();
  workParallax();  