const script = document.createElement("script");
script.appendChild(
  document.createTextNode(
    `(${() => {
      Object.defineProperty(window, "setInterval", {
        value: () => {},
        writable: false
      });
    }})()`
  )
);
(document.head || document.documentElement).appendChild(script);

const ElementRepo = {
  article(doc) {
    return doc.querySelector(".ndArticle_margin");
  },
  articleWrapper(doc) {
    return doc.querySelector(".ndArticle_content");
  },
  videoWrapper(doc) {
    return doc.querySelector("#maincontent");
  },
  videoWrapperMobile(doc) {
    return doc.querySelector("#playerVideo");
  },
  blockers(doc) {
    return doc.querySelectorAll(".ndPaywall,.ndgPayway,.ndPaywallVideo");
  }
};

const prepend = (parent, element) =>
  parent.insertBefore(element, parent.firstChild);
const findFirstMp4 = body => {
  const result = body.match(/(https?:)?\/\/.*mp4/);
  return result ? result[0] : null;
};
const findVideoUrl = doc => findFirstMp4(doc.documentElement.innerHTML);
const createVideo = url => {
  const video = document.createElement("video");
  video.width = 640;
  video.height = 360;
  video.src = url;
  video.controls = true;
  return video;
};
const determinePage = doc => {
  if (
    doc.querySelector("meta[name=viewport]") &&
    doc.location.href.includes("video")
  )
    return "mobile-video";
  if (doc.querySelector("meta[name=viewport]")) return "mobile-article";
  if (doc.querySelector(".ndArticle_content")) return "article";
  if (doc.location.href.includes("video")) return "video";
};

window.addEventListener("DOMContentLoaded", () => {
  ElementRepo.blockers(document).forEach(node =>
    node.parentNode.removeChild(node)
  );

  const pageType = determinePage(document);

  switch (pageType) {
    case "article":
      fetch(location.href)
        .then(response => response.text())
        .then(body => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(body, "text/html");
          const $article = ElementRepo.article(doc);
          $article.style.removeProperty("display");
          prepend(ElementRepo.articleWrapper(document), $article);
          const videoUrl = findFirstMp4(body);
          if (videoUrl)
            prepend(
              ElementRepo.articleWrapper(document),
              createVideo(videoUrl)
            );
        });
      break;
    case "video":
      prepend(
        ElementRepo.videoWrapper(document),
        createVideo(findVideoUrl(document))
      );
      break;
    case "mobile-article":
      {
        const observer = new MutationObserver(function(mutations) {
          mutations.forEach(() => {
            document.documentElement.style.removeProperty("overflow-y");
            document.body.style.removeProperty("overflow-y");
          });
        });
        observer.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ["style"]
        });
        observer.observe(document.body, {
          attributes: true,
          attributeFilter: ["style"]
        });
        const video = createVideo(findVideoUrl(document));
        video.style.width = "100%";
        video.style.height = "100%";
        prepend(ElementRepo.videoWrapperMobile(document), video);
      }
      break;
    case "mobile-video":
      {
        const video = createVideo(findVideoUrl(document));
        video.removeAttribute("width");
        video.removeAttribute("height");
        video.style.width = "100%";
        prepend(ElementRepo.videoWrapperMobile(document), video);
      }
      break;
  }
});
