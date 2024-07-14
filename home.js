//
// FUNCTION DECLARATIONS
//

// Contact link hover

function contactLinkHover() {
    const links = document.querySelectorAll('[gsap-el="contact-hover"]');
  
    links.forEach((link) => {
      const linkText = link.querySelector('[gsap-el="contact-text"]');
      const hoverText = link.querySelector('[gsap-el="hover-text"]');
  
      if (linkText && hoverText) {
        const linkChars = new SplitType(linkText, { types: "chars" });
        const hoverChars = new SplitType(hoverText, { types: "chars" });
  
        const enterTL = gsap.timeline({
          paused: true,
          defaults: {
            duration: durationFast,
            ease: "power2.out",
          },
        });
  
        enterTL.to(linkChars.chars, { yPercent: -100, stagger: 0.01 }, "<");
        enterTL.to(hoverChars.chars, { yPercent: -100, stagger: 0.01 }, "<");
  
        const leaveTL = gsap.timeline({
          paused: true,
          defaults: {
            duration: durationFast,
            ease: "power2.out",
          },
        });
  
        leaveTL.to(hoverChars.chars, { yPercent: 0, stagger: 0.02 }, "<");
        leaveTL.to(linkChars.chars, { yPercent: 0, stagger: 0.02 }, "<");
  
        link.addEventListener("mouseenter", () => enterTL.restart());
        link.addEventListener("mouseleave", () => leaveTL.restart());
      }
    });
  }
  
  // Floating form labels
  
  function formLabel() {
    const inputs = document.querySelectorAll(".form_input");
  
    inputs.forEach((input) => {
      input.addEventListener("focusout", function () {
        if (this.value.length > 0) {
          this.classList.add("focus-out");
        } else {
          this.classList.remove("focus-out");
        }
      });
    });
  }
  
  //
  // Function Inits
  //
  
  if (window.matchMedia("(min-width: 992px)").matches) {
    contactLinkHover();
  }
  formLabel();
  