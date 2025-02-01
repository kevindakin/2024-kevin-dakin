function accordionOpen() {
  const accordions = document.querySelectorAll(".accordion_component");
  
  // Helper function to close accordion
  function closeAccordion(accordion) {
    const trigger = accordion.querySelector(".accordion_title-wrap");
    const content = accordion.querySelector(".accordion_content-wrap");
    const icon = accordion.querySelector(".accordion_icon");
    
    gsap.timeline({
      defaults: {
        duration: durationBase,
        ease: easeBase,
      }
    })
    .to(icon, {
      rotate: 0,
    })
    .to(content, {
      height: 0,
      onComplete: () => {
        content.style.display = "none";
        trigger.setAttribute("aria-expanded", "false");
      },
    }, "<");
  }

  // Helper function to open accordion
  function openAccordion(accordion) {
    const trigger = accordion.querySelector(".accordion_title-wrap");
    const content = accordion.querySelector(".accordion_content-wrap");
    const icon = accordion.querySelector(".accordion_icon");
    
    gsap.timeline({
      defaults: {
        duration: durationBase,
        ease: easeBase,
      }
    })
    .set(content, { display: "block" })
    .to(icon, {
      rotate: 180,
    })
    .to(content, {
      height: "auto",
      onComplete: () => {
        trigger.setAttribute("aria-expanded", "true");
      },
    }, "<");
  }

  // Open first accordion by default
  if (accordions.length > 0) {
    const firstAccordion = accordions[0];
    const firstTrigger = firstAccordion.querySelector(".accordion_title-wrap");
    const firstContent = firstAccordion.querySelector(".accordion_content-wrap");
    firstContent.style.display = "block";
    firstContent.style.height = "auto";
    firstTrigger.setAttribute("aria-expanded", "true");
    firstAccordion.querySelector(".accordion_icon").style.rotate = "180deg";
  }

  accordions.forEach((accordion) => {
    const trigger = accordion.querySelector(".accordion_title-wrap");

    trigger.addEventListener("click", function () {
      const isExpanded = trigger.getAttribute("aria-expanded") === "true";

      if (isExpanded) {
        closeAccordion(accordion);
      } else {
        // Close all other accordions first
        accordions.forEach((otherAccordion) => {
          if (otherAccordion !== accordion) {
            closeAccordion(otherAccordion);
          }
        });
        // Then open the clicked accordion
        openAccordion(accordion);
      }
    });
  });
}

accordionOpen();