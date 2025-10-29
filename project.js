function lazyLoad() {
  const videos = document.querySelectorAll("[data-src]");

  if (videos.length === 0) return;

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

lazyLoad();