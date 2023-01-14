// ==UserScript==
// @name         Bandcamp: Show publish date (tralbum)
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Shows Bandcamp releases' real "publish date" below the listed release date. Also shows "date modified" if different from publish date.
// @author       w_biggs (~joks)
// @match        https://*.bandcamp.com/*
// ==/UserScript==

const jsonElements = document.querySelectorAll('script[data-tralbum]');

jsonElements.forEach((jsonElement) => {
  const tralbum = jsonElement.attributes.getNamedItem('data-tralbum');
  const jsonalbum = JSON.parse(tralbum.textContent);
  const datePublished = jsonalbum.current.publish_date;
  const dateModified = jsonalbum.current.mod_date;

  const embed = jsonElement.attributes.getNamedItem('data-embed');
  const jsonembed = JSON.parse(embed.textContent);
  const dateEmbeddable = jsonembed.embed_info.public_embeddable;
  if (datePublished) {
    const credits = document.querySelector('div.tralbum-credits');

    const publishDate = new Date(datePublished);
    const publishDateString = publishDate.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    let dateString = `<span>published ${publishDateString} (publish_date)<br>`;

    if (dateModified) {
      const modifiedDate = new Date(dateModified);
      const modifiedDateString = modifiedDate.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      if (modifiedDateString !== publishDateString) {
        dateString += `modified ${modifiedDateString} (mod_date)`;
      }
    }

    if (typeof dateEmbeddable === 'string') {
      const embedDate = new Date(dateEmbeddable);
      const embedDateString = embedDate.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      if (embedDateString !== publishDateString) {
        dateString += `embeddable ${embedDateString} (public_embeddable)`;
      }
    }

    dateString += '</span>';

    if (credits.innerHTML.match(/\<br\>/)) {
      credits.innerHTML = credits.innerHTML.replace(/\<br\>/, `<p>${dateString}<p>`);
    } else {
      credits.innerHTML += `<br>${dateString}`;
    }
  }
});