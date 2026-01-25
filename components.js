function lazyLoad() {
  const videos = document.querySelectorAll("[data-src]");

  if (!videos.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const video = entry.target;
          if (video.dataset.src) {
            video.src = video.dataset.src;
            video.load();
            delete video.dataset.src;
            observer.unobserve(video);
          }
        }
      });
    },
    {
      rootMargin: "400px",
    }
  );

  videos.forEach((video) => {
    observer.observe(video);
  });
}

function testimonialsSlider() {
  const sliders = document.querySelectorAll(".testimonials_slider_wrap");

  if (!sliders.length) return;

  sliders.forEach((slider) => {
    const wrapper = slider.querySelector(".testimonials_slider_cms.swiper");
    const list = slider.querySelector(
      ".testimonials_slider_list.swiper-wrapper"
    );
    const items = slider.querySelectorAll(
      ".testimonials_slider_item.swiper-slide"
    );
    const arrowNext = slider.querySelector(
      ".testimonials_slider_arrow.swiper-next"
    );
    const arrowPrev = slider.querySelector(
      ".testimonials_slider_arrow.swiper-prev"
    );

    // Randomize slides
    const itemsArray = Array.from(items);
    itemsArray.sort(() => Math.random() - 0.5);
    itemsArray.forEach((item) => list.appendChild(item));

    let swiper = new Swiper(wrapper, {
      slidesPerView: 1,
      spaceBetween: 0,
      speed: 200,
      loop: true,
      autoplay: {
        delay: 12000,
      },
      effect: "fade",
      fadeEffect: {
        crossFade: true,
      },
      watchOverflow: true,
      navigation: {
        nextEl: arrowNext,
        prevEl: arrowPrev,
      },
    });
  });
}

function workSwiper() {
  const wraps = document.querySelectorAll(".work-swiper_container");

  if (!wraps.length) return;

  wraps.forEach((wrap) => {
    const slider = wrap.querySelector(".work-swiper_wrap.swiper");
    const list = wrap.querySelector(".work-swiper_list.swiper-wrapper");
    const arrowPrev = wrap.querySelector(".work-swiper_arrow.swiper-prev");
    const arrowNext = wrap.querySelector(".work-swiper_arrow.swiper-next");
    const items = wrap.querySelectorAll(".work-swiper_item.swiper-slide");

    const itemsArray = Array.from(items);
    itemsArray.sort(() => Math.random() - 0.5);
    itemsArray.forEach((item) => list.appendChild(item));

    const swiper = new Swiper(slider, {
      slidesPerView: "auto",
      spaceBetween: 0,
      speed: 400,
      navigation: {
        nextEl: arrowNext,
        prevEl: arrowPrev,
      },
    });
  });
}

class ProjectModal {
  constructor(options = {}) {
    // Configuration
    this.config = {
      animationDuration: options.animationDuration || 600,
      fadeDelay: options.fadeDelay || 300,
      copyFeedbackDuration: options.copyFeedbackDuration || 1500,
      slideDistance: options.slideDistance || "10rem",
      focusableSelectors:
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ...options,
    };

    // State management
    this.openModals = new Map();
    this.isAnimating = false;
    this.eventHandlers = new Map();

    // Bind methods
    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleModalClick = this.handleModalClick.bind(this);

    this.init();
  }

  init() {
    this.bindEventListeners();
    document.addEventListener("keydown", this.handleKeydown);
  }

  bindEventListeners() {
    // Open triggers
    document.querySelectorAll("[data-modal-open]").forEach((trigger) => {
      const handler = () => {
        const slug = trigger.getAttribute("data-modal-open");
        if (slug) this.openModal(slug);
      };

      trigger.addEventListener("click", handler);
      this.eventHandlers.set(trigger, { type: "click", handler });
    });

    // Close buttons
    document.querySelectorAll("[data-modal-close]").forEach((closeBtn) => {
      const handler = () => {
        const slug = closeBtn.getAttribute("data-modal-close");
        if (slug) this.closeModal(slug);
      };

      closeBtn.addEventListener("click", handler);
      this.eventHandlers.set(closeBtn, { type: "click", handler });
    });

    // Modal backdrop clicks - NOW TRACKED FOR CLEANUP
    document.querySelectorAll("[data-modal-wrap]").forEach((modalWrap) => {
      this.eventHandlers.set(modalWrap, {
        type: "click",
        handler: this.handleModalClick,
      });
      modalWrap.addEventListener("click", this.handleModalClick);
    });
  }

  async openModal(slug) {
    if (this.isAnimating || this.openModals.has(slug)) return;

    const elements = this.getModalElements(slug);
    if (!elements.modalWrap || !elements.modalContainer) {
      console.warn(`Modal elements not found for slug: ${slug}`);
      return;
    }

    this.isAnimating = true;

    try {
      await this.animateModalOpen(elements);
      this.setupModalState(slug, elements);
      this.setupCopyButton(slug, elements.modalWrap);
    } catch (error) {
      console.error("Error opening modal:", error);
    } finally {
      this.isAnimating = false;
    }
  }

  async closeModal(slug) {
    if (this.isAnimating || !this.openModals.has(slug)) return;

    const elements = this.getModalElements(slug);
    if (!elements.modalWrap || !elements.modalContainer) return;

    this.isAnimating = true;

    try {
      await this.animateModalClose(elements);
      this.cleanupModalState(slug, elements);
    } catch (error) {
      console.error("Error closing modal:", error);
    } finally {
      this.isAnimating = false;
    }
  }

  getModalElements(slug) {
    const modalWrap = document.querySelector(`[data-modal-wrap="${slug}"]`);
    const modalContainer = modalWrap?.querySelector(".modal_project_contain");

    return { modalWrap, modalContainer };
  }

  animateModalOpen(elements) {
    const { modalWrap, modalContainer } = elements;

    return new Promise((resolve, reject) => {
      // Kill existing animations
      if (window.gsap) {
        window.gsap.killTweensOf([modalWrap, modalContainer]);
      }

      // Reset state
      modalWrap.style.display = "flex";
      this.resetScrollPositions(modalContainer);

      if (window.gsap) {
        const gsap = window.gsap;

        // Set initial state
        gsap.set(modalContainer, {
          x: this.config.slideDistance,
          autoAlpha: 1,
        });

        // Create timeline
        const tl = gsap.timeline({
          onComplete: resolve,
          onError: reject,
        });

        tl.to(modalWrap, {
          opacity: 1,
          duration: this.config.fadeDelay / 1000,
        }).to(
          modalContainer,
          {
            x: "0rem",
            duration: this.config.animationDuration / 1000,
            ease: "power2.out",
          },
          "-=0.1"
        );
      } else {
        // Fallback without GSAP
        modalWrap.style.opacity = "1";
        modalContainer.style.transform = "translateX(0)";
        modalContainer.style.opacity = "1";
        setTimeout(resolve, this.config.animationDuration);
      }
    });
  }

  animateModalClose(elements) {
    const { modalWrap, modalContainer } = elements;

    return new Promise((resolve, reject) => {
      if (window.gsap) {
        const gsap = window.gsap;
        gsap.killTweensOf([modalWrap, modalContainer]);

        const tl = gsap.timeline({
          onComplete: () => {
            modalWrap.style.display = "none";
            gsap.set(modalContainer, { clearProps: "transform,opacity" });
            resolve();
          },
          onError: reject,
        });

        tl.to(modalContainer, {
          x: this.config.slideDistance,
          duration: this.config.animationDuration / 1000,
          ease: "power2.in",
        }).to(
          modalWrap,
          {
            opacity: 0,
            duration: this.config.fadeDelay / 1000,
          },
          "-=0.3"
        );
      } else {
        // Fallback without GSAP
        modalWrap.style.opacity = "0";
        modalContainer.style.transform = `translateX(${this.config.slideDistance})`;
        setTimeout(() => {
          modalWrap.style.display = "none";
          resolve();
        }, this.config.animationDuration);
      }
    });
  }

  setupModalState(slug, elements) {
    const { modalWrap } = elements;

    this.openModals.set(slug, {
      element: modalWrap,
      lastFocused: document.activeElement,
    });

    this.trapFocus(modalWrap);
  }

  cleanupModalState(slug, elements) {
    const { modalWrap } = elements;
    const modalData = this.openModals.get(slug);

    if (modalData) {
      this.releaseFocus(modalWrap, modalData.lastFocused);
      this.openModals.delete(slug);
    }
  }

  resetScrollPositions(modalContainer) {
    modalContainer.scrollTop = 0;
    modalContainer
      .querySelectorAll('[style*="overflow"], .scrollable')
      .forEach((el) => (el.scrollTop = 0));
  }

  setupCopyButton(slug, modalWrap) {
    const copyBtn = modalWrap.querySelector(`[data-modal-link="${slug}"]`);
    if (!copyBtn) return;

    // Remove existing handler if any
    const existingHandler = this.eventHandlers.get(copyBtn);
    if (existingHandler) {
      copyBtn.removeEventListener(
        existingHandler.type,
        existingHandler.handler
      );
    }

    // OPTIMIZED: Query elements once and store references
    const copyElements = {
      linkIcon: copyBtn.querySelector('[data-button="link"]'),
      checkIcon: copyBtn.querySelector('[data-button="copied"]'),
      tooltip: copyBtn.querySelector('[data-button="tooltip"]'),
    };

    // Reset UI state
    this.resetCopyButtonState(copyElements);

    let isCopyLocked = false;
    const copyHandler = async () => {
      if (isCopyLocked) return;

      isCopyLocked = true;
      const url = `${location.origin}/project/${slug}`;

      try {
        await this.copyToClipboard(url);
        this.showCopySuccess(copyElements);

        setTimeout(() => {
          this.resetCopyButtonState(copyElements);
          isCopyLocked = false;
        }, this.config.copyFeedbackDuration);
      } catch (error) {
        console.error("Copy failed:", error);
        isCopyLocked = false;
      }
    };

    copyBtn.addEventListener("click", copyHandler);
    this.eventHandlers.set(copyBtn, { type: "click", handler: copyHandler });
  }

  // OPTIMIZED: Accept elements object instead of querying again
  resetCopyButtonState(elements) {
    const { linkIcon, checkIcon, tooltip } = elements;

    if (linkIcon) linkIcon.style.display = "block";
    if (checkIcon) checkIcon.style.display = "none";
    if (tooltip) tooltip.classList.remove("is-open");
  }

  // OPTIMIZED: Accept elements object instead of querying again
  showCopySuccess(elements) {
    const { linkIcon, checkIcon, tooltip } = elements;

    if (linkIcon) linkIcon.style.display = "none";
    if (checkIcon) checkIcon.style.display = "block";
    if (tooltip) tooltip.classList.add("is-open");
  }

  async copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    } else {
      // Fallback for older browsers or non-HTTPS
      return new Promise((resolve, reject) => {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          const successful = document.execCommand("copy");
          document.body.removeChild(textArea);

          if (successful) {
            resolve();
          } else {
            reject(new Error("Copy command failed"));
          }
        } catch (err) {
          document.body.removeChild(textArea);
          reject(err);
        }
      });
    }
  }

  trapFocus(modal) {
    const focusableElements = modal.querySelectorAll(
      this.config.focusableSelectors
    );
    if (focusableElements.length === 0) return;

    const firstEl = focusableElements[0];
    const lastEl = focusableElements[focusableElements.length - 1];

    const handleFocus = (e) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };

    modal._focusHandler = handleFocus;
    modal.addEventListener("keydown", handleFocus);

    // Focus first element with preventScroll
    requestAnimationFrame(() => {
      firstEl.focus({ preventScroll: true });
    });
  }

  releaseFocus(modal, lastFocused) {
    if (modal._focusHandler) {
      modal.removeEventListener("keydown", modal._focusHandler);
      delete modal._focusHandler;
    }

    if (lastFocused && typeof lastFocused.focus === "function") {
      requestAnimationFrame(() => {
        lastFocused.focus({ preventScroll: true });
      });
    }
  }

  handleModalClick(e) {
    if (e.target.hasAttribute("data-modal-wrap")) {
      const slug = e.target.getAttribute("data-modal-wrap");
      this.closeModal(slug);
    }
  }

  handleKeydown(e) {
    if (e.key === "Escape" && this.openModals.size > 0) {
      // Close all open modals
      const slugs = Array.from(this.openModals.keys());
      slugs.forEach((slug) => this.closeModal(slug));
    }
  }

  // Public API methods
  closeAllModals() {
    const slugs = Array.from(this.openModals.keys());
    slugs.forEach((slug) => this.closeModal(slug));
  }

  isModalOpen(slug) {
    return this.openModals.has(slug);
  }

  getOpenModals() {
    return Array.from(this.openModals.keys());
  }

  destroy() {
    // Remove all event listeners
    this.eventHandlers.forEach((data, element) => {
      element.removeEventListener(data.type, data.handler);
    });

    document.removeEventListener("keydown", this.handleKeydown);

    // Close all modals
    this.closeAllModals();

    // Clear references
    this.eventHandlers.clear();
    this.openModals.clear();
  }
}

function accordion() {
  const accordions = document.querySelectorAll(".accordion_component");

  if (!accordions) return;

  function closeAccordion(accordion) {
    const trigger = accordion.querySelector(".accordion_title-wrap");
    const content = accordion.querySelector(".accordion_content-wrap");
    const icon = accordion.querySelector(".accordion_icon");

    gsap
      .timeline({
        defaults: {
          duration: durationBase,
          ease: easeBase,
        },
      })
      .to(icon, {
        rotate: 0,
      })
      .to(
        content,
        {
          height: 0,
          onComplete: () => {
            content.style.display = "none";
            trigger.setAttribute("aria-expanded", "false");
          },
        },
        "<"
      );
  }

  function openAccordion(accordion) {
    const trigger = accordion.querySelector(".accordion_title-wrap");
    const content = accordion.querySelector(".accordion_content-wrap");
    const icon = accordion.querySelector(".accordion_icon");

    gsap
      .timeline({
        defaults: {
          duration: durationBase,
          ease: easeBase,
        },
      })
      .set(content, { display: "block" })
      .to(icon, {
        rotate: 180,
      })
      .to(
        content,
        {
          height: "auto",
          onComplete: () => {
            trigger.setAttribute("aria-expanded", "true");
          },
        },
        "<"
      );
  }

  if (accordions.length > 0) {
    const firstAccordion = accordions[0];
    const firstTrigger = firstAccordion.querySelector(".accordion_title-wrap");
    const firstContent = firstAccordion.querySelector(
      ".accordion_content-wrap"
    );
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
        accordions.forEach((otherAccordion) => {
          if (otherAccordion !== accordion) {
            closeAccordion(otherAccordion);
          }
        });
        openAccordion(accordion);
      }
    });
  });
}

function timedTabs() {
  const wrappers = document.querySelectorAll(".tabs_timed_wrap");

  if (!wrappers.length) return;

  wrappers.forEach((wrapper) => {
    const links = Array.from(wrapper.querySelectorAll(".tab_link_wrap"));
    const panels = Array.from(wrapper.querySelectorAll(".tabs_timed_visual"));
    const duration = 10000;

    let currentIndex = 0;
    let interval = null;
    let progressTween = null;
    let hasStarted = false;

    // Set up ARIA attributes
    const linksWrapper = wrapper.querySelector(".tabs_timed_links");
    const panelsWrapper = wrapper.querySelector(".tabs_timed_panels");

    if (linksWrapper) {
      linksWrapper.setAttribute("role", "tablist");
    }

    links.forEach((link, i) => {
      // ARIA attributes for tabs
      link.setAttribute("role", "tab");
      link.setAttribute("id", `tab-${i}`);
      link.setAttribute("aria-controls", `panel-${i}`);
      link.setAttribute("aria-selected", i === 0 ? "true" : "false");

      const progressLine = link.querySelector(".tab_link_progress_active");
      if (progressLine) {
        gsap.set(progressLine, { height: "0%" });
      }

      const description = link.querySelector(".tab_link_description");
      if (description && i === 0) {
        gsap.set(description, { height: "auto" });
      }
    });

    panels.forEach((panel, i) => {
      // ARIA attributes for panels
      panel.setAttribute("role", "tabpanel");
      panel.setAttribute("id", `panel-${i}`);
      panel.setAttribute("aria-labelledby", `tab-${i}`);
      panel.setAttribute("tabindex", "0");

      if (i !== 0) {
        gsap.set(panel, { display: "none", opacity: 0 });
        panel.setAttribute("aria-hidden", "true");
      } else {
        gsap.set(panel, { opacity: 1 });
        panel.setAttribute("aria-hidden", "false");
      }
    });

    links[0].classList.add("is-active");

    function showTab(index) {
      const previousIndex = currentIndex;
      currentIndex = index;

      const previousProgressLine = links[previousIndex].querySelector(
        ".tab_link_progress_active"
      );
      if (previousProgressLine) {
        gsap.set(previousProgressLine, { height: "0%" });
      }

      links.forEach((link, i) => {
        const isActive = i === index;
        link.classList.toggle("is-active", isActive);
        link.setAttribute("aria-selected", isActive ? "true" : "false");
      });

      const previousDescription = links[previousIndex].querySelector(
        ".tab_link_description"
      );
      const nextDescription = links[index].querySelector(
        ".tab_link_description"
      );

      if (previousDescription) {
        gsap.to(previousDescription, {
          height: 0,
          duration: 0.8,
          ease: "expo.out",
        });
      }

      if (nextDescription) {
        gsap.to(nextDescription, {
          height: "auto",
          duration: 0.8,
          ease: "expo.out",
        });
      }

      const currentPanel = panels[previousIndex];
      const nextPanel = panels[index];

      gsap.set(nextPanel, {
        display: "block",
        opacity: 1,
        scale: 1.3,
        clipPath: "inset(0% 100% 0% 0%)",
        zIndex: 2,
      });

      nextPanel.setAttribute("aria-hidden", "false");

      gsap.set(currentPanel, {
        zIndex: 1,
      });

      gsap.to(nextPanel, {
        scale: 1,
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 0.8,
        ease: "expo.out",
        onComplete: () => {
          gsap.set(currentPanel, { display: "none", opacity: 0, zIndex: 1 });
          currentPanel.setAttribute("aria-hidden", "true");
          gsap.set(nextPanel, { zIndex: 1 });
        },
      });
    }

    function animateProgress() {
      if (progressTween) {
        progressTween.kill();
      }

      const activeLink = links[currentIndex];
      const progressLine = activeLink.querySelector(
        ".tab_link_progress_active"
      );

      if (progressLine) {
        progressTween = gsap.to(progressLine, {
          height: "100%",
          duration: duration / 1000,
          ease: "linear",
        });
      }
    }

    function startTimer() {
      animateProgress();

      interval = setInterval(() => {
        const next = (currentIndex + 1) % links.length;
        showTab(next);
        animateProgress();
      }, duration);
    }

    function resetTimer() {
      clearInterval(interval);
      startTimer();
    }

    // Click handlers
    links.forEach((link, i) => {
      link.addEventListener("click", () => {
        if (i !== currentIndex) {
          showTab(i);
          resetTimer();
        }
      });

      // Also handle Enter/Space key activation
      link.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (i !== currentIndex) {
            showTab(i);
            resetTimer();
          }
        }
      });
    });

    // Intersection Observer to start timer on first view only
    const observerOptions = {
      root: null,
      rootMargin: "200px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasStarted) {
          hasStarted = true;

          // Respect prefers-reduced-motion
          const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
          );
          if (!prefersReducedMotion.matches) {
            startTimer();
          }

          // Disconnect observer after first intersection
          observer.disconnect();
        }
      });
    }, observerOptions);

    observer.observe(wrapper);
  });
}

function formLabel() {
  const inputs = document.querySelectorAll(".form_input");

  if (!inputs) return;

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

function contactLinkHover() {
  const links = document.querySelectorAll('[gsap-el="contact-hover"]');

  if (!links) return;

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

document.addEventListener("DOMContentLoaded", function () {
  lazyLoad();
  testimonialsSlider();
  workSwiper();
  accordion();
  timedTabs();
  formLabel();

  if (document.querySelector("[data-modal-wrap]")) {
    window.projectModal = new ProjectModal({
      animationDuration: 600,
      fadeDelay: 300,
      copyFeedbackDuration: 1500,
      slideDistance: "10rem",
    });
  }

  if (window.matchMedia("(min-width: 992px)").matches) {
    contactLinkHover();
  }
});