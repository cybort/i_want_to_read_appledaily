const ElementRepo = {
  article(doc) {
    return doc.querySelector(".ndArticle_margin");
  },
  articleWrapper(doc) {
    return doc.querySelector(".ndArticle_content");
  },
  blocker(doc) {
    return doc.querySelector(".ndPaywall");
  }
};

const isArticlePage = () => !!document.querySelector(".ndArticle_content");

if (isArticlePage()) {
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
      const $blocker = ElementRepo.blocker(document);
      $blocker.parentNode.removeChild($blocker);
    });
}
