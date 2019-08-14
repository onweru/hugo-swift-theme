function createEl(element) {
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
  // equivalent to addClass
  if (el && typeof el == 'object' && targetClass) {
    elClass = el.classList;
    elClass.contains(targetClass) ? false : elClass.add(targetClass);
  }
}

function deleteClass(el, targetClass) {
  // equivalent to removeClass
  if (el && typeof el == 'object' && targetClass) {
    elClass = el.classList;
    elClass.contains(targetClass) ? elClass.remove(targetClass) : false;
  }
}

function modifyClass(el, targetClass) {
  if (el && typeof el == 'object' && targetClass) {
    elClass = el.classList;
    elClass.contains(targetClass) ? elClass.remove(targetClass) : elClass.add(targetClass);
  }
}

function containsClass(el, targetClass) {
  if (el && typeof el == 'object' && targetClass) {
    return el.classList.contains(targetClass) ? true : false;
  }
}

function isChild(node, parentClass) {
  let objectsAreValid = node && typeof node == 'object' && parentClass && typeof parentClass == 'string';
  return (objectsAreValid && node.closest(parentClass)) ? true : false;
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
  let hidden = 'hidden';

  function toggleMenu(){
    modifyClass(navDrop, pop);
    modifyClass(navBar, hidden);
    let menuOpen = containsClass(nav, open);
    let menuPulled = containsClass(nav, exit);

    let status = menuOpen || menuPulled ? true : false;

    status ? modifyClass(nav, exit) : modifyClass(nav, open);
    status ? modifyClass(nav, open) : modifyClass(nav, exit);
  }

  // $('.nav-bar, .nav-close').on('click', () => toggleMenu());
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

(function share(){
  let share = elem('.share');
  let open = 'share-open';
  let close = 'share-close';
  let button = elem('.share-trigger');

  function showShare() {
    pushClass(share, open);
    deleteClass(share, close);
  }

  function hideShare() {
    pushClass(share, open);
    deleteClass(share, close);
  }
  if (button) {
    button.addEventListener('click', function() {
      showShare();
      setTimeout(hideShare, 5000);
    });
  }
})();

(function comments(){

  let comments = elem('.comments');
  let form = elem('.form');
  let body = elem('body');
  let button = elem('.form_toggle');
  let replyNoticeTag = elem('.form .reply-notice')
  let loading = 'form-loading';
  let open = 'form-open';
  let show = 'modal_show'
  let toggled = 'toggled';

  let successOutput = ['{{ i18n "successTitle" }}', '{{ i18n "successMsg" }}'];
  let errorOutput = ['{{ i18n "errTitle" }}', '{{ i18n "errMsg" }}'];

  function handleForm(form) {
    // clear form when reset button is clicked
    elem('.form_input-reset').addEventListener('click', function (){
      clearForm();
    });

    form.addEventListener('submit', function (event) {
      pushClass(form, loading);
      elem('.form_input-submit').value = '{{ i18n "btnSubmitted" }}';  // btn "submit"

      function resetForm() {
        deleteClass(form, loading);
        elem('.form_input-submit').value = '{{ i18n "btnSubmit" }}';  // btn "submit"
        // $("form").trigger("reset");
      }

      function formActions(message) {
        showModal(...message) // array destructuring
        resetForm();
      }

      event.preventDefault();

      {{ with .Site.Params.staticman -}}
        let endpoint = '{{ .endpoint | default "https://staticman-frama.herokuapp.com" }}';
        let gitProvider = '{{ .gitprovider }}';
        let username = '{{ .username }}';
        let repository = '{{ .repository }}';
        let branch = '{{ .branch }}';

        let data = {
          fields: {
            name: elem('input[name="fields[name]"]', form).value,
            email: elem('input[name="fields[email]"]', form).value,
            comment: elem('input[name="fields[name]"]', form).value,
            replyID: elem('input[name="fields[replyID]"]', form).value,
            replyName: elem('input[name="fields[replyName]"]', form).value,
            replyThread: elem('input[name="fields[replyThread]"]', form).value
          },
          options: {
            slug: elem('input[name="options[slug]"]', form).value
          }
        };
        {{ with .recaptcha }}
          data.options.reCaptcha = {};
          data.options.reCaptcha.siteKey = '{{ .sitekey }}';
          data.options.reCaptcha.secret = '{{ .secret }}';
          data["g-recaptcha-response"] = elem('[name="g-recaptcha-response"]', form).value;
        {{ end }}
      {{ end }}
      let url = [endpoint, 'v3/entry', gitProvider, username, repository, branch, 'comments'].join('/');
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
  }

  form ? handleForm(form) : false;
  function closeModal() {
    elem('.modal_close').addEventListener('click', function () {
      deleteClass(body, show);
      deleteClass(form, loading);
      elem('.form_input-submit').value = '{{ i18n "btnSubmit" }}';  // btn "submit"
      deleteClass(form, open);
      deleteClass(button, toggled);
      button.textContent = '{{ i18n "comment" }}';  // change button text to original state
    });
  }

  function showModal(title, message) {
    elem('.modal_title').textContent = title;
    elem('.modal_text').innerHTML = message;

    pushClass(body, show);
    closeModal();
    clearForm();
  }

  (function toggleForm() {
    if(button) {
      button.addEventListener('click', function() {
        modifyClass(form, open);
        modifyClass(this, toggled);
        this.textContent  = containsClass(this, toggled) ?  '{{ i18n "cancel" }}' : '{{ i18n "comment" }}';
      });
    }
  })();

  function clearForm() {
    resetReplyTarget();
    // empty all text & hidden fields
    elems('.form_input').forEach((form_input) => {form_input.value = ''});
  }

  function resetReplyTarget() {
    elem('.form-comments .reply-notice .reply-name').textContent = ''; // reset reply target
    let avatarTag = elem('.form-comments .reply-notice img');
    // using elem('.reply-notice-close-btn') doesn't return an operable object
    if (avatarTag) {
      replyNoticeTag.removeChild(avatarTag); // remove reply avatar
      replyNoticeTag.removeChild(replyNoticeTag.lastChild); // remove the rightmost '×' button
      pushClass(replyNoticeTag, 'hidden'); // hide reply target display
    }
    elem('.form-comments input[name="fields[replyThread]"]').value = '';
    elem('.form-comments input[name="fields[replyID]"]').value = '';
    elem('.form-comments input[name="fields[replyName]"]').value = '';
  }

  // record reply target when "reply to this comment" is pressed
  (function toggleReplyNotice() {
    if (comments) {
      comments.addEventListener('click', function (evt){
        if (evt.target && containsClass(evt.target, 'comment_reply-btn')) {
          // open the form in it's closed
          if (!containsClass(form, open)) {
            pushClass(form, open);
            pushClass(button, toggled);
            button.textContent  = '{{ i18n "cancel" }}';
          }
          resetReplyTarget();
          let comment = evt.target.parentNode;
          let threadID = comment.getElementsByClassName('comment_threadID')[0].textContent;
          elem('.form-comments input[name="fields[replyThread]"]').value = threadID;
          elem('.form-comments input[name="fields[replyID]"]').value = comment.id;
          let replyName = comment.getElementsByClassName('comment_name_span')[0].textContent;
          elem('.form-comments input[name="fields[replyName]"]').value = replyName;

          // display reply target avatar and name
          deleteClass(replyNoticeTag, 'hidden');
          elem('.form-comments .reply-name').textContent = replyName;
          let avatarTag = createEl('img');
          avatarTag.className = 'comment_pic';
          avatarTag.src = comment.getElementsByClassName('comment_pic')[0].src;
          let replyNameTag = replyNoticeTag.getElementsByClassName('reply-name')[0];
          replyNoticeTag.insertBefore(avatarTag, replyNameTag);

          // add button for removing reply target (static method would give error msg)
          let closeReplyBtnTag = createEl('a');
          closeReplyBtnTag.className = 'reply-notice-close-btn';
          closeReplyBtnTag.textContent = '\u274C';
          // handle removal of reply target when '×' is pressed
          closeReplyBtnTag.addEventListener('click', function(){
            resetReplyTarget();
          });
          replyNoticeTag.appendChild(closeReplyBtnTag);
        }
      });
    }
  })();
})();

function elemAttribute(elem, attr, value = null) {
  if (value) {
    elem.setAttribute(attr, value);
  } else {
    value = elem.getAttribute(attr);
    return value ? value : false;
  }
}

(function(){
  let links = document.querySelectorAll('a');
  if(links) {
    Array.from(links).forEach(function(link){
      let target, rel, blank, noopener, attr1, attr2, url, isExternal;
      url = elemAttribute(link, 'href');
      isExternal = (url && typeof url == 'string' && url.startsWith('http')) && !containsClass(link, 'nav_item') && !isChild(link, '.post_item') && !isChild(link, '.pager') ? true : false;
      if(isExternal) {
        target = 'target';
        rel = 'rel';
        blank = '_blank';
        noopener = 'noopener';
        attr1 = elemAttribute(link, target);
        attr2 = elemAttribute(link, noopener);

        attr1 ? false : elemAttribute(link, target, blank);
        attr2 ? false : elemAttribute(link, noopener, noopener);
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
  icon.src = '{{ "images/icons/link.svg" | absURL }}';
  link.className = 'link';
  link.appendChild(icon);
  id = node.getAttribute('id');
  if(id) {
    link.href = `${current}#${id}`;
    node.appendChild(link);
    pushClass(node, 'link_owner');
  }
});

const copyToClipboard = str => {
  // Create a <textarea> element
  const el = createEl('textarea');
  // Set its value to the string that you want copied
  el.value = str;
  // Make it readonly to be tamper-proof
  el.setAttribute('readonly', '');
  // Move outside the screen to make it invisible
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  // Append the <textarea> element to the HTML document
  document.body.appendChild(el);
  // Check if there is any content selected previously
  const selected =
  document.getSelection().rangeCount > 0
  ? document.getSelection().getRangeAt(0)   // Store selection if found
  : false;                                  // Mark as false to know no selection existed before
  el.select();                              // Select the <textarea> content
  document.execCommand('copy'); // Copy - only works as a result of a user action (e.g. click events)
  document.body.removeChild(el);                  // Remove the <textarea> element
  if (selected) {                                 // If a selection existed before copying
    document.getSelection().removeAllRanges();    // Unselect everything on the HTML document
    document.getSelection().addRange(selected);   // Restore the original selection
  }
}

(function copyHeadingLink() {
  let deeplink = 'link';
  let deeplinks = document.querySelectorAll(`.${deeplink}`);
  if(deeplinks) {
    document.body.addEventListener('click', function(event)
    {
      let target = event.target;
      if (target.classList.contains(deeplink) || target.parentNode.classList.contains(deeplink)) {
        event.preventDefault();
        let newLink = target.href != undefined ? target.href : target.parentNode.href;
        copyToClipboard(newLink);
      }
    });
  }
})();

(function copyLinkToShare() {
  let  copy, copied, excerpt, isCopyIcon, isInExcerpt, link, page, postCopy, postLink, target;
  copy = 'copy';
  copied = 'copy_done';
  excerpt = 'excerpt';
  postCopy = 'post_copy';
  postLink = 'post_card';
  page = document.documentElement;

  page.addEventListener('click', function(event) {
    target = event.target;
    isCopyIcon = containsClass(target, copy);
    isInExcerpt = containsClass(target, postCopy);
    if (isCopyIcon) {
      if (isInExcerpt) {
        link = target.closest(`.${excerpt}`).previousElementSibling;
        link = containsClass(link, postLink)? elemAttribute(link, 'href') : false;
      } else {
        link = window.location.href;
      }
      if(link) {
        copyToClipboard(link);
        pushClass(target, copied);
      }
    }
  });
})();

(function hideAside(){
  let aside, title, posts;
  aside = elem('.aside');
  title = aside.previousElementSibling;
  if(aside && title.nodeName.toLowerCase() === 'h3') {
    posts = Array.from(aside.children);
    posts.length < 1 ? title.remove() : false;
  }
})();
