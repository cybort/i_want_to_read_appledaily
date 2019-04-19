const ElementRepo = {
  article(doc) {
    return doc.querySelector(".ndArticle_margin");
  },
  articleWrapper(doc) {
    return doc.querySelector(".ndArticle_content");
  },
  blockers(doc) {
    return doc.querySelectorAll(".ndPaywall,.ndgPayway");
  }
};

const isDesktop = () => !!document.querySelector(".ndArticle_content");
const isMobile = () =>
  document
    .querySelector("meta[name=viewport]")
    .content.includes("width=device-width");

ElementRepo.blockers(document).forEach(node =>
  node.parentNode.removeChild(node)
);

if (isDesktop()) {
  fetch(location.href)
    .then(response => response.text())
    .then(body => {
      const parser = new DOMParser();
      const $article = ElementRepo.article(
        parser.parseFromString(body, "text/html")
      );
      $article.style.removeProperty("display");
      const $wrapper = ElementRepo.articleWrapper(document);
      $wrapper.insertBefore($article, $wrapper.firstChild);
    });
} else if (isMobile()) {
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
}
