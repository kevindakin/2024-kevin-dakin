//
// GLOBAL VARIABLES
//

const durationBase = 1;
const durationFast = 0.6;
const durationSlow = 1.4;
const easeBase = "power4.inOut";
const main = document.querySelector(".page_main");
const nav = document.querySelector(".nav_component");
const hamburgerEl = document.querySelector(".hamburger_wrap");

//
// FUNCTION DECLARATIONS
//

// Nav move on scroll

function navScroll() {
  const navItems = nav.querySelectorAll(".nav_brand, .book_component");

  const navAnim = gsap.timeline({
    defaults: {
      duration: durationBase,
      ease: "power3.in",
    },
  });

  let scrolled = false;

  window.onscroll = function () {
    const currentScrollPos = window.pageYOffset;
    if (currentScrollPos > 0) {
      if (!scrolled) {
        navAnim.to(navItems, { y: "-2rem", opacity: 0 });
        navAnim.set(navItems, { display: "none" });
        scrolled = true;
      }
    } else {
      navAnim.set(navItems, { display: "flex" });
      navAnim.to(navItems, { y: 0, opacity: 1, ease: "power3.out" });
      scrolled = false;
    }
  };
}

// Open menu

function menuOpenAnim() {
  const menuEl = document.querySelector(".nav_menu");
  const lineTop = hamburgerEl.querySelector(".is-top");
  const lineBottom = hamburgerEl.querySelector(".is-bottom");
  const mainItems = menuEl.querySelectorAll(".menu_link-wrap");
  const itemCount = menuEl.querySelectorAll(".menu_link-count");
  const menuSubhead = menuEl.querySelector(".menu_subhead");
  const secondaryItems = document.querySelectorAll(".menu_service-wrap");
  const navItems = menuEl.querySelector(".nav_container");
  let menuOpen = false;

  const menuAnim = gsap.timeline({
    paused: true,
    defaults: {
      duration: durationBase,
      ease: easeBase,
    },
  });

  const openMenu = () => {
    menuAnim
      .set(menuEl, { display: "flex", yPercent: -100 })
      .set(secondaryItems, { y: "100%" })

      .to(
        menuEl,
        {
          yPercent: 0,
          borderRadius: "0px 0px 0vw 0vw",
        },
        "<"
      )
      .to(
        main,
        {
          y: "40vh",
        },
        "<"
      )
      .to(
        lineTop,
        {
          y: 6,
          rotate: -45,
          duration: durationFast,
        },
        "<"
      )
      .to(
        lineBottom,
        {
          y: -6,
          rotate: 45,
          duration: durationFast,
        },
        "<"
      )
      .from(
        mainItems,
        {
          yPercent: 130,
          stagger: 0.1,
          duration: 2,
          ease: "expo.inOut",
        },
        "<-0.2"
      )
      .from(
        itemCount,
        {
          opacity: 0,
          filter: "blur(4px)",
          stagger: 0.1,
          duration: durationSlow,
        },
        "<"
      )
      .from(
        menuSubhead,
        {
          yPercent: 100,
          duration: durationSlow,
          ease: "expo.inOut",
        },
        "<0.8"
      )
      .to(
        secondaryItems,
        {
          y: "0%",
          stagger: 0.1,
          duration: durationBase,
          ease: "expo.inOut",
        },
        "<0.4"
      )
      .from(
        navItems,
        {
          opacity: 0,
          filter: "blur(4px)",
          stagger: 0.1,
          duration: durationSlow,
        },
        "<"
      )
      .play();
    menuOpen = true;
  };

  const closeMenu = () => {
    menuAnim
      .to(menuEl, {
        yPercent: -100,
        borderRadius: "0px 0px 25vw 25vw",
      })
      .to(
        main,
        {
          y: "0vw",
        },
        "<"
      )
      .to(
        lineTop,
        {
          y: 0,
          rotate: 0,
          duration: durationFast,
        },
        "<"
      )
      .to(
        lineBottom,
        {
          y: 0,
          rotate: 0,
          duration: durationFast,
        },
        "<"
      )
      .set(menuEl, { display: "none" })
      .play();

    menuOpen = false;
  };

  hamburgerEl.addEventListener("click", () => {
    if (menuOpen) {
      closeMenu();
      enableScrolling();
    } else {
      openMenu();
      disableScrolling();
    }
  });

  const closeEl = document.querySelectorAll('[js-el="close-menu"]');

  closeEl.forEach((btn) => {
    btn.addEventListener("click", () => {
      closeMenu();
      enableScrolling();
    });
  });
}

// Menu link hover

function menuLinkHover() {
  const menuLinks = document.querySelectorAll('[gsap-el="menu-link"]');

  menuLinks.forEach((link) => {
    const linkText = link.querySelector('[gsap-el="menu-text"]');
    const hoverText = link.querySelector('[gsap-el="hover-text"]');
    const line = link.querySelector(".menu_link-line");

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

      enterTL.to(line, { width: "100%" });
      enterTL.to(linkChars.chars, { yPercent: -100, stagger: 0.02 }, "<");
      enterTL.to(hoverChars.chars, { yPercent: -100, stagger: 0.02 }, "<");

      const leaveTL = gsap.timeline({
        paused: true,
        defaults: {
          duration: durationFast,
          ease: "power2.out",
        },
      });

      leaveTL.to(line, { width: "0%" });
      leaveTL.to(hoverChars.chars, { yPercent: 0, stagger: 0.02 }, "<");
      leaveTL.to(linkChars.chars, { yPercent: 0, stagger: 0.02 }, "<");

      link.addEventListener("mouseenter", () => enterTL.restart());
      link.addEventListener("mouseleave", () => leaveTL.restart());
    }
  });
}

// Menu link hover (Secondary)

function secondaryLinkHover() {
  const links = document.querySelectorAll(".menu_service-wrap");

  links.forEach((link) => {
    const arrow = link.querySelectorAll(".menu_service-icon");
    const text = link.querySelectorAll(".menu_service-title");
    const arrowHover = link.querySelector(".menu_service-icon.is-hover");
    const textHover = link.querySelector(".menu_service-title.is-hover");

    if (arrowHover && textHover) {
      const tl = gsap.timeline({
        paused: true,
        defaults: {
          duration: durationFast,
          ease: "power2.inOut",
        },
      });

      tl.to(arrow, { x: "2rem" }).to(text, { yPercent: -100 }, "<");

      link.addEventListener("mouseenter", () => {
        tl.play();
      });

      link.addEventListener("mouseleave", () => {
        tl.reverse();
      });
    }
  });
}

// Image reveal (Scroll)

function imageReveal() {
  const wrapper = document.querySelectorAll(".parallax");

  wrapper.forEach((wrap) => {
    const block = wrap.querySelector(".overlay-block");
    const img = wrap.querySelector(".u-cover-absolute.is-parallax");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrap,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
      defaults: {
        duration: durationBase,
        ease: "power3.out",
      },
    });

    tl.from(block, {
      height: "100%",
    }).from(
      img,
      {
        scale: 1.5,
      },
      "<0.2"
    );
  });
}

// Image parallax

function imageParallax() {
  const parallaxWrap = document.querySelectorAll(".parallax");

  parallaxWrap.forEach((wrap) => {
    const img = wrap.querySelector(".u-cover-absolute.is-parallax");

    if (img) {
      const parallaxAnim = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      parallaxAnim.fromTo(
        img,
        {
          yPercent: -5,
        },
        {
          yPercent: 5,
        }
      );
    }
  });
}

// Split chars (Scroll)

function splitChars() {
  const splitElements = document.querySelectorAll('[gsap-el="split-chars"]');

  splitElements.forEach((text) => {
    const chars = new SplitType(text, { types: "chars, lines" });

    const anim = gsap.timeline({
      scrollTrigger: {
        trigger: text,
        start: "top bottom+=20%",
        toggleActions: "play none none reverse",
      },
      defaults: {
        duration: durationSlow,
        ease: easeBase,
      },
    });

    anim.from(text.querySelectorAll(".char"), {
      y: "100%",
      stagger: 0.05,
    });
  });
}

// Split lines (Scroll)

function splitLines() {
  const splitElements = document.querySelectorAll('[gsap-el="split-line"]');

  splitElements.forEach((text) => {
    const lines = new SplitType(text, { types: "lines, words" });

    const anim = gsap.timeline({
      scrollTrigger: {
        trigger: text,
        start: "top bottom+=20%",
        toggleActions: "play none none reverse",
      },
      defaults: {
        duration: durationSlow,
        ease: easeBase,
      },
    });

    anim.from(text.querySelectorAll(".word"), {
      y: "100%",
      stagger: {
        each: 0.03,
      },
    });
  });
}

// Floating form labels

function floatingLabel() {
  const input = document.querySelector(".footer-form_input");
  input.addEventListener("focusout", function () {
    if (this.value.length > 0) {
      this.classList.add("focus-out");
    } else {
      this.classList.remove("focus-out");
    }
  });

  input.addEventListener("focus", function () {
    const sibling = this.parentElement.querySelector(".footer-form_border");
    if (sibling) {
      sibling.style.width = "100%";
    }
  });

  input.addEventListener("blur", function () {
    const sibling = this.parentElement.querySelector(".footer-form_border");
    if (sibling) {
      sibling.style.width = "0%";
    }
  });
}

// Disable scroll

function disableScrolling() {
  document.body.classList.add("no-scroll");
  lenis.stop();
}

function enableScrolling() {
  document.body.classList.remove("no-scroll");
  lenis.start();
}

// Footer scroll

function footerScroll() {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: main,
      start: "bottom center",
      toggleActions: "play none none reverse",
    },
    defaults: {
      duration: durationBase,
      ease: easeBase,
    },
  });

  tl.to(hamburgerEl, {
    opacity: 0,
  });
}

// Dynamic count for nav links

function cmsCount() {
  const workCMS = document.getElementById("work-list");
  const templateCMS = document.getElementById("templates-list");

  if (!workCMS || !templateCMS) {
    return;
  }
  const workLength = workCMS.children.length;
  const templatesLength = templateCMS.children.length;

  const workCount = document.getElementById("work-count");
  const templatesCount = document.getElementById("templates-count");

  if (!workCount || !templatesCount) {
    return;
  }

  workCount.textContent = workLength;
  templatesCount.textContent = templatesLength;
}

//
// FUNCTION INITS
//

if (window.matchMedia("(min-width: 992px)").matches) {
  navScroll();
  menuLinkHover();
  secondaryLinkHover();
}
menuOpenAnim();
imageReveal();
imageParallax();
splitChars();
splitLines();
floatingLabel();
footerScroll();
cmsCount();

document.querySelectorAll('[data-scroll="disable"]').forEach((element) => {
  element.addEventListener("click", (event) => {
    disableScrolling();
  });
});

document.querySelectorAll('[data-scroll="enable"]').forEach((element) => {
  element.addEventListener("click", (event) => {
    enableScrolling();
  });
});