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

document.addEventListener("DOMContentLoaded", function () {
  testimonialsSlider();
});