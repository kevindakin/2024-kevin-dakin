function blogTOC() {
    const mediaQuery = window.matchMedia("(min-width: 992px)");
  
    function handleViewportChange(e) {
      if (e.matches) {
        initTOC();
      } else {
        const tocWrapper = document.querySelector('[data-toc="wrapper"]');
        const sidebarTOC = document.querySelector(".sidebar_toc");
  
        if (tocWrapper) tocWrapper.innerHTML = "";
        if (sidebarTOC) sidebarTOC.style.display = "none";
      }
    }
  
    function initTOC() {
      const richText = document.querySelector('[data-toc="rich"]');
      const tocWrapper = document.querySelector('[data-toc="wrapper"]');
      const sidebarTOC = document.querySelector(".sidebar_toc");
  
      function createTocLink(headingText, headingId) {
        // Create the link structure as it exists in your Webflow design
        const link = document.createElement("a");
        link.setAttribute("data-toc", "link");
        link.classList.add("toc_link");
        link.href = `#${headingId}`;
  
        // Instead of creating a new div, find the existing one in the DOM to use as a template
        const existingLink = document.querySelector(".toc_link");
  
        if (existingLink && existingLink.firstElementChild) {
          const innerContent = existingLink.firstElementChild.cloneNode(true);
          innerContent.textContent = headingText;
          link.appendChild(innerContent);
        } else {
          const textDiv = document.createElement("div");
          textDiv.textContent = headingText;
          link.appendChild(textDiv);
        }
  
        return link;
      }
  
      function generateId(text, index) {
        return `${text.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
      }
  
      function createAnchorSpacer(id) {
        const spacer = document.createElement("div");
        spacer.className = "anchor-link-spacer";
        spacer.id = id;
        return spacer;
      }
  
      function buildTOC() {
        if (!richText || !tocWrapper) return;
  
        tocWrapper.innerHTML = "";
  
        const headings = richText.querySelectorAll("h1, h2, h3");
  
        if (headings.length === 0 && sidebarTOC) {
          sidebarTOC.style.display = "none";
          return;
        }
  
        headings.forEach((heading, index) => {
          const headingId = generateId(heading.textContent, index);
  
          heading.style.position = "relative";
  
          const spacer = createAnchorSpacer(headingId);
          heading.appendChild(spacer);
  
          const tocLink = createTocLink(heading.textContent, headingId);
          tocWrapper.appendChild(tocLink);
        });
  
        if (sidebarTOC) {
          sidebarTOC.style.display = "flex";
        }
  
        // Initialize the active state tracking
        initActiveStateTracking();
      }
  
      function initActiveStateTracking() {
        // Get all headings with anchor spacers
        const headings = richText.querySelectorAll(".anchor-link-spacer");
        const tocLinks = tocWrapper.querySelectorAll(".toc_link");
  
        // Options for the Intersection Observer
        const options = {
          rootMargin: "-100px 0px -70% 0px",
          threshold: 0,
        };
  
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            const id = entry.target.id;
            const correspondingLink = tocWrapper.querySelector(
              `.toc_link[href="#${id}"]`
            );
  
            if (correspondingLink) {
              if (entry.isIntersecting) {
                tocLinks.forEach((link) => link.classList.remove("is-active"));
  
                correspondingLink.classList.add("is-active");
              }
            }
          });
        }, options);
  
        // Observe each heading
        headings.forEach((heading) => {
          observer.observe(heading);
        });
      }
  
      buildTOC();
    }
  
    handleViewportChange(mediaQuery);
  
    mediaQuery.addEventListener("change", handleViewportChange);
  }
  
  function socialShare() {
    const linkShareButtons = document.querySelectorAll('[data-share="link"]');
  
    const handleLinkCopy = async (button) => {
      const currentUrl = window.location.href;
      const copyIcon = button.querySelector('[data-share="copy"]');
      const copiedIcon = button.querySelector('[data-share="copied"]');
  
      try {
        await navigator.clipboard.writeText(currentUrl);
  
        if (copyIcon && copiedIcon) {
          copiedIcon.style.display = "block";
          setTimeout(() => {
            copiedIcon.classList.add("is-open");
          }, 10);
        }
  
        setTimeout(() => {
          if (copyIcon && copiedIcon) {
            copiedIcon.classList.remove("is-open");
  
            setTimeout(() => {
              copiedIcon.style.display = "none";
            }, 300);
          }
        }, 2000);
      } catch (err) {
        console.error("Failed to copy URL:", err);
      }
    };
  
    linkShareButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        handleLinkCopy(button);
      });
    });
  }
  
  blogTOC();
  socialShare();  