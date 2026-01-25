function workParallax() {
  if (window.matchMedia("(min-width: 992px)").matches) {
    const elements = document.querySelectorAll(".ft-work_item-wrap");

    if (!elements) return;

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

document.addEventListener("DOMContentLoaded", function () {
  workParallax();
});