// Accordion open and close

function accordionOpen() {
    const accordions = document.querySelectorAll(".accordion_component");
  
    accordions.forEach((accordion) => {
      const trigger = accordion.querySelector(".accordion_title-wrap");
      const content = accordion.querySelector(".accordion_content-wrap");
      const icon = accordion.querySelector(".accordion_icon");
  
      trigger.addEventListener("click", function () {
        const isExpanded = trigger.getAttribute("aria-expanded") === "true";
  
        const tl = gsap.timeline({
          defaults: {
            duration: durationBase,
            ease: easeBase,
          },
        });
  
        if (isExpanded) {
          tl.to(icon, {
            rotate: 0,
          }).to(
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
        } else {
          tl.set(content, { display: "block" })
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
      });
    });
  }
  
  accordionOpen();  