function fileClosure(){ 
  // everything in this file should be declared within this closure (function).

  (function updateDate() {
    var date = new Date();
    var year = date.getFullYear();
    elem('.year').innerHTML = year;
  })();

  (function() {
    let bar = 'nav_bar-wrap';
    let navBar = elem(`.${bar}`);
    let nav = elem('.nav-body');
    let open = 'nav-open';
    let exit = 'nav-exit';
    let drop = 'nav-drop';
    let pop = 'nav-pop';
    let navDrop = elem(`.${drop}`);

    function toggleMenu(){
      let menuOpen, menuPulled, status;
      modifyClass(navDrop, pop);
      modifyClass(navBar, hidden);
      menuOpen = containsClass(nav, open);
      menuPulled = containsClass(nav, exit);

      status = menuOpen || menuPulled ? true : false;

      status ? modifyClass(nav, exit) : modifyClass(nav, open);
      status ? modifyClass(nav, open) : modifyClass(nav, exit);
    }

    navBar.addEventListener('click', function() {
      toggleMenu();
    });
    elem('.nav-close').addEventListener('click', function() {
      toggleMenu();
    });

    elem('.nav-drop').addEventListener('click', function(e) {
      e.target === this ? toggleMenu() : false;
    });

  })();

  (function makeExternalLinks(){
    let links = elems('a');
    if(links) {
      Array.from(links).forEach(function(link){
        let target, rel, blank, noopener, attr1, attr2, url, isExternal;
        url = elemAttribute(link, 'href');
        isExternal = (url && typeof url == 'string' && url.startsWith('http')) && !url.startsWith(parentURL) ? true : false;
        if(isExternal) {
          target = 'target';
          rel = 'rel';
          blank = '_blank';
          noopener = 'noopener';
          attr1 = elemAttribute(link, target);
          attr2 = elemAttribute(link, noopener);

          attr1 ? false : elemAttribute(link, target, blank);
          attr2 ? false : elemAttribute(link, rel, noopener);
        }
      });
    }
  })();

  let headingNodes = [], results, link, icon, current, id,
  tags = ['h2', 'h3', 'h4', 'h5', 'h6'];

  current = document.URL;

  tags.forEach(function(tag){
    results = document.getElementsByTagName(tag);
    Array.prototype.push.apply(headingNodes, results);
  });

  headingNodes.forEach(function(node){
    link = createEl('a');
    icon = createEl('img');
    icon.src = '{{ absURL "images/icons/link.svg" }}';
    link.className = 'link';
    link.appendChild(icon);
    id = node.getAttribute('id');
    if(id) {
      link.href = `${current}#${id}`;
      node.appendChild(link);
      pushClass(node, 'link_owner');
    }
  });

  let inlineListItems = elems('ol li');
  if(inlineListItems) {
    inlineListItems.forEach(function(listItem){
      let firstChild = listItem.children[0]
      let containsHeading = isMatch(firstChild, tags);
      containsHeading ? pushClass(listItem, 'align') : false;
    })
  }

  (function copyHeadingLink() {
    let deeplink, deeplinks, newLink, parent, target;
    deeplink = 'link';
    deeplinks = elems(`.${deeplink}`);
    if(deeplinks) {
      document.addEventListener('click', function(event)
      {
        target = event.target;
        parent = target.parentNode;
        if (target && containsClass(target, deeplink) || containsClass(parent, deeplink)) {
          event.preventDefault();
          newLink = target.href != undefined ? target.href : target.parentNode.href;
          copyToClipboard(newLink);
        }
      });
    }
  })();

  (function copyLinkToShare() {
    let  copy, copied, excerpt, isCopyIcon, isInExcerpt, link, postCopy, postLink, target;
    copy = 'copy';
    copied = 'copy_done';
    excerpt = 'excerpt';
    postLink = 'post_card';

    doc.addEventListener('click', function(event) {
      target = event.target;
      isCopyIcon = containsClass(target, copy);
      let isWithinCopyIcon = target.closest(`.${copy}`);
      if (isCopyIcon || isWithinCopyIcon) {
        let icon = isCopyIcon ? isCopyIcon : isWithinCopyIcon;
        isInExcerpt = icon.closest(`.${excerpt}`);
        if (isInExcerpt) {
          link = target.closest(`.${excerpt}`).previousElementSibling;
          link = containsClass(link, postLink)? elemAttribute(link, 'href') : false;
        } else {
          link = window.location.href;
        }
        if(link) {
          copyToClipboard(link);
          pushClass(icon, copied);
        }
      }
    });
  })();

  (function hideAside(){
    let aside, title, posts;
    aside = elem('.aside');
    title = aside ? aside.previousElementSibling : null;
    if(aside && title.nodeName.toLowerCase() === 'h3') {
      posts = Array.from(aside.children);
      posts.length < 1 ? title.remove() : false;
    }
  })();

  (function goBack() {
    let backBtn = elem('.btn_back');
    let history = window.history;
    if (backBtn) {
      backBtn.addEventListener('click', function(){
        history.back();
      });
    }
  })();

  (function postsPager(){
    const pager = elem('.pagination');
    if (pager) {
      pushClass(pager, 'pager');
      const pagerItems = elems('li', pager);
      const pagerLinks = Array.from(pagerItems).map(function(item){
        return item.firstElementChild;
      });

      pagerLinks.forEach(function(link){
        pushClass(link, 'pager_link')
      });

      pagerItems.forEach(function(item){
        pushClass(item, 'pager_item')
      });
    }
  })();

  (function lazy() {
    function lazyLoadMedia(element) {
      let mediaItems = elems(element);
      if(mediaItems) {
        Array.from(mediaItems).forEach(function(item) {
        item.loading = "lazy";
        });
      }
    }
    lazyLoadMedia('iframe');
    lazyLoadMedia('img');
  })();

  const qr = elem(".crypto_qr");

  function cryptoAddressQR(address, el = qr) {
    const qrCode = new QRious({ element: el, size: 225, value: address});
    qrCode.set({
      foreground: "#ef7f1a",
      size: 225,
    });
  }

  function activeCryptoTitle(el) {
    const cryptoTitle = `${el.dataset.title} ${tAddress}`;  
    const cryptoTitleEl = elem(".crypto_title");
    cryptoTitleEl.textContent = cryptoTitle;
  }

  const cryptoRow = ".crypto_row";

  doc.addEventListener('click', function(event){
    const target = event.target;
    const cryptoCopy = ".crypto_copy";
    const cryptoScan = ".crypto_scan";
    const isCrypto = exactMatch(target, cryptoRow);
    if(qr) {
      const cryptoPad = qr.parentNode;
      if(isCrypto) {
        const isCopyCrypto = exactMatch(target, cryptoCopy);
        const isScanCrypto = exactMatch(target, cryptoScan);
        if(isCrypto.dataset) {
          const address = isCrypto.dataset.address;
          isCopyCrypto ? copyToClipboard(address) : false;
          isScanCrypto ? pushClass(cryptoPad, active) : false;
          markActive(isCrypto);
          cryptoAddressQR(address);
          activeCryptoTitle(isCrypto);
        }
      } else {
        containsClass(cryptoPad, active) ? modifyClass(cryptoPad, active) : false;
      }
    }
  });

  let applied = false;
  // let fadedUp = false;
  // let fadedSideways = false;
  const toFade = elems(".fp");
  const toFadeSideways = elems(".fs");
  window.addEventListener("scroll", () => {
    if(toFade.length) {
      toFade.forEach((el) => {
        let blockInPosition = elementInViewport(el);
        if(blockInPosition) {
          pushClass(el, "fade_up");
        }
      })
    }

    if(toFadeSideways.length) {
      toFadeSideways.forEach((el) => {
        let blockInPosition = elementInViewport(el);
        if(blockInPosition) {
          pushClass(el, "fade_left");
        }
      })
    }
  });

  // add new code above this line
}
window.addEventListener('load', fileClosure());
