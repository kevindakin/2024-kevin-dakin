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

// Initialize with default options
const projectModal = new ProjectModal({
  animationDuration: 600,
  fadeDelay: 300,
  copyFeedbackDuration: 1500,
  slideDistance: "10rem",
});