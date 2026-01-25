function loaderLong() {
  const loaderWrap = document.querySelector('[load-el="wrap"]');

  const block1 = loaderWrap.querySelector('[load-el="block-1"]');
  const block2 = loaderWrap.querySelector('[load-el="block-2"]');
  const block3 = loaderWrap.querySelector('[load-el="block-3"]');
  const heading = document.querySelector('[load-el="heading"]');
  const gradient = heading.querySelectorAll(".text-highlight");
  const button = document.querySelector('[load-el="button"]');
  const description = document.querySelector('[load-el="description"]');
  const marquee = document.querySelector('[load-el="marquee"]');
  const logo = document.querySelector(".loader_logo");
  const wordMark = document.querySelector(".loader_logo-type svg");

  const headlineSplit = new SplitType(heading, {
    types: "lines, words",
    tagName: "span",
  });

  const splitText = heading.querySelectorAll(".word");

  const loader = gsap.timeline({
    defaults: {
      duration: durationSlow,
      ease: easeBase,
    },
  });

  gsap.set(logo, { display: "flex" });

  loader
    .to(logo, {
      opacity: 1,
    })
    .to(
      logo,
      {
        xPercent: -50,
      },
      "<0.4"
    )
    .to(
      wordMark,
      {
        xPercent: 110,
      },
      "<"
    )
    .to(
      block1,
      {
        yPercent: -100,
        borderRadius: "0px 0px 25vw 25vw",
      },
      "<1"
    )
    .to(
      block2,
      {
        yPercent: -100,
        borderRadius: "0px 0px 25vw 25vw",
      },
      "<0.1"
    )
    .to(
      block3,
      {
        yPercent: -100,
        borderRadius: "0px 0px 25vw 25vw",
      },
      "<0.2"
    )
    .from(
      splitText,
      {
        y: "100%",
        stagger: 0.1,
      },
      "<0.35"
    )
    .from(
      description,
      {
        opacity: 0,
        duration: 2,
      },
      "<0.4"
    )
    .from(
      button,
      {
        opacity: 0,
        duration: 2,
      },
      "<0.4"
    )
    .from(
      marquee,
      {
        opacity: 0,
        filter: "blur(8px)",
        duration: 2,
      },
      "<0.4"
    )
    .from(
      gradient,
      {
        backgroundSize: "0% 70%",
        stagger: 0.2,
      },
      "<"
    )
    .set(loaderWrap, { display: "none" });
}

function loaderShort() {
  const loaderWrap = document.querySelector('[load-el="wrap"]');

  const block1 = loaderWrap.querySelector('[load-el="block-1"]');
  const block2 = loaderWrap.querySelector('[load-el="block-2"]');
  const block3 = loaderWrap.querySelector('[load-el="block-3"]');
  const heading = document.querySelector('[load-el="heading"]');
  const gradient = heading.querySelectorAll(".text-highlight");
  const button = document.querySelector('[load-el="button"]');
  const description = document.querySelector('[load-el="description"]');
  const marquee = document.querySelector('[load-el="marquee"]');

  gsap.set(block2, { display: "none" });

  const headlineSplit = new SplitType(heading, {
    types: "lines, words",
    tagName: "span",
  });

  const splitText = heading.querySelectorAll(".word");

  const loader = gsap.timeline({
    defaults: {
      duration: durationSlow,
      ease: easeBase,
    },
  });

  loader
    .to(block1, {
      yPercent: -100,
      borderRadius: "0px 0px 25vw 25vw",
    })
    .to(
      block3,
      {
        yPercent: -100,
        borderRadius: "0px 0px 25vw 25vw",
      },
      "<0.1"
    )
    .from(
      splitText,
      {
        y: "100%",
        stagger: 0.1,
      },
      "<0.35"
    )
    .from(
      description,
      {
        opacity: 0,
        duration: 2,
      },
      "<0.4"
    )
    .from(
      button,
      {
        opacity: 0,
        duration: 2,
      },
      "<0.4"
    )
    .from(
      marquee,
      {
        opacity: 0,
        filter: "blur(8px)",
        duration: 2,
      },
      "<0.4"
    )
    .from(
      gradient,
      {
        backgroundSize: "0% 70%",
        stagger: 0.2,
      },
      "<"
    )
    .set(loaderWrap, { display: "none" });
}

function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// Cookie check
const seenLoader = getCookie("seenLoader");

if (seenLoader) {
  loaderShort();
} else {
  loaderLong();
  setCookie("seenLoader", "true", 7);
}

// Page transition animation

const links = document.querySelectorAll("a");

links.forEach((link) => {
  link.addEventListener("click", (event) => {
    const isInternal = link.hostname === window.location.hostname;

    if (isInternal) {
      event.preventDefault();

      const wrap = document.querySelector('[transition-el="wrap"]');

      const block1 = wrap.querySelector('[transition-el="block-1"]');
      const block3 = wrap.querySelector('[transition-el="block-3"]');

      gsap.set(wrap, { display: "block" });

      const transition = gsap.timeline({
        defaults: {
          duration: durationBase,
          ease: easeBase,
        },
      });

      transition
        .to(block3, {
          yPercent: -100,
          borderRadius: "0vw 0vw 0px 0px",
        })
        .to(
          block1,
          {
            yPercent: -100,
            borderRadius: "0vw 0vw 0px 0px",
            onComplete: () => {
              window.location.href = link.href;
            },
          },
          "<0.1"
        );
    }
  });
});