function fileClosure(){ 
  // everything in this file should be declared within this closure (function).

  // global variables
  let hidden;
  hidden = 'hidden';

  const doc = document.documentElement;
  const parentURL = '{{ .Site.BaseURL }}';
  const staticman = Object.create(null);
  {{ with .Site.Params.staticman -}}
  const endpoint = '{{ .endpoint | default "https://staticman3.herokuapp.com" }}';
  const gitProvider = '{{ .gitprovider }}';
  const username = '{{ .username }}';
  const repository = '{{ .repository }}';
  const branch = '{{ .branch }}';

  // store reCAPTCHA v2 site key and secret
  {{ with .recaptcha -}}
  staticman.siteKey = '{{ .sitekey }}';
  staticman.secret = '{{ .secret }}';
  {{ end -}}
  {{ end -}}

  const translations = {
    success: {
      title: '{{ i18n "successTitle" }}',
      text: '{{ i18n "successMsg" }}',
      close: '{{ i18n "close" }}'
    },
    error: {
      title: '{{ i18n "errTitle" }}',
      text: '{{ i18n "errMsg" }}',
      close: '{{ i18n "close" }}'
    },
    discard: {
      title: '{{ i18n "discardComment" }}',
      button: '{{ i18n "discard" }}'
    },
    submit: '{{ i18n "btnSubmit" }}',
    submitted: '{{ i18n "btnSubmitted" }}'
  };

  function isObj(obj) {
    return (obj && typeof obj === 'object' && obj !== null) ? true : false;
  }

  function createEl(element = 'div') {
    return document.createElement(element);
  }

  function elem(selector, parent = document){
    let elem = parent.querySelector(selector);
    return elem != false ? elem : false;
  }

  function elems(selector, parent = document) {
    let elems = parent.querySelectorAll(selector);
    return elems.length ? elems : false;
  }

  function pushClass(el, targetClass) {
    if (isObj(el) && targetClass) {
      elClass = el.classList;
      elClass.contains(targetClass) ? false : elClass.add(targetClass);
    }
  }

  function deleteClass(el, targetClass) {
    if (isObj(el) && targetClass) {
      elClass = el.classList;
      elClass.contains(targetClass) ? elClass.remove(targetClass) : false;
    }
  }

  function modifyClass(el, targetClass) {
    if (isObj(el) && targetClass) {
      elClass = el.classList;
      elClass.contains(targetClass) ? elClass.remove(targetClass) : elClass.add(targetClass);
    }
  }

  function containsClass(el, targetClass) {
    if (isObj(el) && targetClass && el !== document ) {
      return el.classList.contains(targetClass) ? true : false;
    }
  }

  function isChild(node, parentClass) {
    let objectsAreValid = isObj(node) && parentClass && typeof parentClass == 'string';
    return (objectsAreValid && node.closest(parentClass)) ? true : false;
  }

  function elemAttribute(elem, attr, value = null) {
    if (value) {
      elem.setAttribute(attr, value);
    } else {
      value = elem.getAttribute(attr);
      return value ? value : false;
    }
  }

  function deleteChars(str, subs) {
    let newStr = str;
    if (Array.isArray(subs)) {
      for (let i = 0; i < subs.length; i++) {
        newStr = newStr.replace(subs[i], '');
      }
    } else {
      newStr = newStr.replace(subs, '');
    }
    return newStr;
  }

  function isBlank(str) {
    return (!str || str.trim().length === 0);
  }

  function isMatch(element, selectors) {
    if(isObj(element)) {
      if(selectors.isArray) {
        let matching = selectors.map(function(selector){
          return element.matches(selector)
        })
        return matching.includes(true);
      }
      return element.matches(selectors)
    }
  }

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

  function convertToUnderScoreCase(str) {
    let char, newChar, newStr;
    newStr = '';
    if (typeof str == 'string') {
      for (let x = 0; x < str.length; x++) {
        char = str.charAt(x);
        if (char.match(/^[A-Z]*$/)) {
          char = char.toLowerCase();
          newChar = `_${char}`
          newStr += newChar;
        } else {
          newStr += char;
        }
      }
      return newStr;
    }
  }

  function createModal(children, parent) {
    let body, modal, title;

    modal = createEl();
    pushClass(modal, 'modal');
    body = createEl();
    pushClass(body, 'modal_inner');
    title = createEl('h3');
    pushClass(title, 'modal_title');
    body.appendChild(title);
    // add html specific to modal
    if (isObj(children)) {
      if (Array.isArray(children)) {
        children.map(function(child){
          body.appendChild(child);
        });
      } else {
        body.appendChild(children);
      }
    }
    modal.appendChild(body);
    parent.append(modal);
    pushClass(doc, 'modal_show');
  }

  function fillModal(obj) {
    let el, targetClass, modal;
    modal = elem('.modal');
    const entries = Object.entries(obj)
    for (const [element, content] of entries) {
      targetClass = `.${convertToUnderScoreCase(element)}`;
      el = elem(targetClass, modal);
      el.innerHTML = content;
    }
  }

  (function comments(){
    let comments, form, replyNotice, open;

    comments = elem('.comments');
    form = elem('.form');
    button = elem('.form_toggle');
    replyNotice = elem('.reply_notice')
    open = 'form_open';

    let successOutput, errorOutput;

    successOutput = {
      modalTitle: translations.success.title,
      modalText: translations.success.text,
      modalClose: translations.success.close
    };
    errorOutput = {
      modalTitle: translations.error.title,
      modalText: translations.error.text,
      modalClose: translations.error.close
    };

    function feedbackModal() {
      let body, button, children;
      body = createEl();
      pushClass(body, 'modal_text');
      button = createEl();
      pushClass(button, 'btn');
      pushClass(button, 'modal_close');
      children = [
        body,
        button
      ];
      return children;
    }

    function confirmModal() {
      // confirm if you want to exit form
      let group, button, cancel;
      group = createEl();
      pushClass(group, 'btn_group');
      button = createEl();
      pushClass(button, 'btn');
      pushClass(button, 'modal_close')
      pushClass(button, 'form_close')
      cancel = createEl();
      pushClass(cancel, 'modal_close')
      pushClass(cancel, 'btn_close');
      pushClass(cancel, 'icon');
      group.appendChild(button);
      group.appendChild(cancel);
      return group;
    }

    function handleForm(form) {

      function formValues() {
        // returns an object with form field values
        let deadWeight, fields, fieldAreas, obj;
        fieldAreas = elems('.form_input', form);
        fields = Array.from(fieldAreas);
        obj = Object.create(null);
        deadWeight = ['fields', 'options', '[' , ']', 'undefined'];

        fields.map(function(field) {
          let key, value;
          key = deleteChars(field.name, deadWeight);
          key = convertToUnderScoreCase(key);
          value = field.value;
          obj[key] = value;
        });
        return obj;
      }

      (function submitForm() {
        form.addEventListener('submit', function (event) {
          event.preventDefault();

          let fields, recaptchaResponse, submit, url;
          url = [endpoint, 'v3/entry', gitProvider, username, repository, branch, 'comments'].join('/');
          fields = formValues();
          submit = elem('.form_submit', form);
          recaptchaResponse = elem('[name="g-recaptcha-response"]', form);

          submit.value = translations.submitted;

          function formActions(info) {
            showModal(info);
            submit.value = translations.submit;
          }

          let data = {
            fields: {
              name: fields.name,
              email: fields.email,
              comment: fields.comment,
              replyID: fields.reply_id,
              replyName: fields.reply_name,
              replyThread: fields.reply_thread
            },
            options: {
              slug: fields.slug
            }
          };

          if (staticman.secret){
            data.options.reCaptcha = {};
            data.options.reCaptcha.siteKey = staticman.siteKey;
            data.options.reCaptcha.secret = staticman.secret;
            data["g-recaptcha-response"] = recaptchaResponse.value;
          }

          fetch(url, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json"
            }
          }).then(function(res) {
            if(res.ok) {
              formActions(successOutput);
            } else {
              formActions(errorOutput);
            }
          }).catch(function(error) {
            formActions(errorOutput);
            console.error('Error:', error);
          });
        });
      })();

      function getHiddenFields() {
        let reply_id, reply_name, reply_thread, reply_to, obj;

        reply_id = elem('.reply_id', form);
        reply_name = elem('.reply_name', form);
        reply_thread = elem('.reply_thread', form);
        reply_to = elem('.reply_to', form);

        obj = {
          id: reply_id,
          name: reply_name,
          thread: reply_thread,
          to: reply_to
        }

        return obj;
      }

      function setReplyValues(trigger) {
        let comment, id, name, thread;

        let reply_fields = getHiddenFields();

        comment = trigger.parentNode;
        id = comment.id;
        name = elem('.comment_name_span', comment);
        thread = elem('.comment_thread', comment);
        reply_fields.thread.value = thread.textContent;
        reply_fields.id.value = id;
        reply_fields.name.value = name.textContent;
        reply_fields.to.textContent = name.textContent;
      }

      function resetReplyValues() {
        let reply_fields;
        reply_fields = getHiddenFields();
        const values = Object.entries(reply_fields);
        for (const [key, element] of values) {
          if (key == 'to') {
            element.textContent = '';
          } else {
            element.value = '';
          }
        }
      }

      function toggleForm(action = true) {
        let reply_to, toggle_btn;
        action = action ? pushClass : deleteClass;
        toggle_btn = elem('.form_toggle');
        action(form, open);
        action(toggle_btn, hidden);
        reply_to = getHiddenFields().to.textContent;
        isBlank(reply_to) ? pushClass(replyNotice, hidden) : deleteClass(replyNotice, hidden) ;
      }

      comments.addEventListener('click', function (event){
        let confirm, fields, modal, target, obj, formIsEmpty, hiddenValuesEmpty;

        // buttons
        let isFormCloseBtn, isFormToggleBtn, isModalCloseBtn, isResetFormBtn, isReplyBt;

        target = event.target;
        fields = formValues();
        formIsEmpty = isBlank(fields.name) && isBlank(fields.comment) && isBlank(fields.email) ? true : false;
        hiddenValuesEmpty = isBlank(fields.reply_id) ? true : false;

        isFormCloseBtn = containsClass(target, 'form_close');
        isFormToggleBtn = containsClass(target, 'form_toggle');
        isModalCloseBtn = containsClass(target, 'modal_close');
        isResetFormBtn = containsClass(target, 'form_reset');
        isReplyBtn = containsClass(target, 'reply_btn');

        isReplyBtn ? setReplyValues(target) : false;
        isReplyBtn || isFormToggleBtn ? toggleForm() : false;
        isFormCloseBtn ? toggleForm(false) : false;

        if (isFormCloseBtn) {
          form.reset();
        } 

        if (isResetFormBtn) {
          if (formIsEmpty) {
            hiddenValuesEmpty ? false : resetReplyValues();
            toggleForm(false);
          } else {
            obj = {
              modalTitle: translations.discard.title,
              modalClose: translations.discard.button
            }
            confirm = confirmModal();
            createModal(confirm, comments);
            fillModal(obj);
          }
        }

        if (isModalCloseBtn) {
          modal = target.closest('.modal');
          modal.remove();
          deleteClass(doc, 'modal_show');
        }
      });
    }

    form ? handleForm(form) : false;

    function showModal(obj) {
      let feedbackBody;
      feedback = feedbackModal();
      createModal(feedback, comments);
      fillModal(obj);
    }

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

  const copyToClipboard = str => {
    let copy, selection, selected;
    copy = createEl('textarea');
    copy.value = str;
    copy.setAttribute('readonly', '');
    copy.style.position = 'absolute';
    copy.style.left = '-9999px';
    selection = document.getSelection();
    doc.appendChild(copy);
    // check if there is any selected content
    selected = selection.rangeCount > 0 ? selection.getRangeAt(0) : false;
    copy.select();
    document.execCommand('copy');
    doc.removeChild(copy);
    if (selected) { // if a selection existed before copying
      selection.removeAllRanges(); // unselect existing selection
      selection.addRange(selected); // restore the original selection
    }
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
        Array.from(mediaItems).forEach(function(item, index) {
        item.loading = "lazy";
        });
      }
    }
    lazyLoadMedia('iframe');
    lazyLoadMedia('img');
  })();

  doc.addEventListener('click', function(event){
    const target = event.target;
    const cryptoCopy = '.crypto_copy';
    const copied = 'active';
    let isCopyCrypto = target.matches(cryptoCopy);
    const isInCopyCrypto = target.closest(cryptoCopy);
    if(isCopyCrypto || isInCopyCrypto) {
      if(isInCopyCrypto) {
        isCopyCrypto = isInCopyCrypto;
      }
      const address = isCopyCrypto.previousElementSibling.dataset.address;
      copyToClipboard(address);
      pushClass(isCopyCrypto, copied);
    }
  });

  // add new code above this line
}
window.addEventListener('load', fileClosure());
