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
  if (el && typeof el == 'object' && targetClass) {
    elClass = el.classList;
    elClass.contains(targetClass) ? false : elClass.add(targetClass);
  }
}

function deleteClass(el, targetClass) {
  if (el && typeof el == 'object' && targetClass) {
    elClass = el.classList;
    elClass.contains(targetClass) ? elClass.remove(targetClass) : false;
  }
}

function modifyClass(el, targetClass) {
  if (el && typeof el == 'object' && targetClass) {
    // make exception for documentElement later
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

(function comments(){
  let body, button, comments, form, hidden, loading, replyNotice, open, show, toggled;
  
  comments = elem('.comments');
  form = elem('.form');
  body = elem('body');
  button = elem('.form_toggle');
  replyNotice = elem('.reply_notice')
  loading = 'form_loading';
  open = 'form_open';
  show = 'modal_show'
  toggled = 'toggled';
  hidden = 'hidden';

  let successOutput, errorOutput;
  
  successOutput = ['{{ i18n "successTitle" }}', '{{ i18n "successMsg" }}'];
  errorOutput = ['{{ i18n "errTitle" }}', '{{ i18n "errMsg" }}'];

  function handleForm(form) {
    // clear form when reset button is clicked
    elem('.form_reset').addEventListener('click', function (){
      clearForm();
    });

    form.addEventListener('submit', function (event) {
      let name, email, message, reply_id, reply_name, reply_thread, submit;
      name = elem('.form_name', form);
      email = elem('.form_email', form);
      message = elem('.form_message', form);
      reply_id = elem('.reply_id', form);
      reply_name = elem('.reply_name', form);
      reply_thread = elem('.reply_thread', form);
      submit = elem('.form_submit');

      
      pushClass(form, loading);
      submit.value = '{{ i18n "btnSubmitted" }}';  // btn "submit"

      function resetForm() {
        deleteClass(form, loading);
        submit.value = '{{ i18n "btnSubmit" }}';  // btn "submit"
      }

      function formActions(message) {
        showModal(...message);
        resetForm();
      }

      event.preventDefault();

      {{ with .Site.Params.staticman -}}
        let branch, endpoint, gitProvider, repo, username;
        endpoint = '{{ .endpoint | default "https://staticman-frama.herokuapp.com" }}';
        gitProvider = '{{ .gitprovider }}';
        username = '{{ .username }}';
        repo = '{{ .repository }}';
        branch = '{{ .branch }}';

        let data = {
          fields: {
            name: name.value,
            email: email.value,
            comment: message.value,
            replyID: reply_id.value,
            replyName: reply_name.value,
            replyThread: reply_thread.value
          },
          options: {
            slug: elem('.form_slug', form).value
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
      elem('.form_submit').value = '{{ i18n "btnSubmit" }}';  // btn "submit"
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
    document.addEventListener('click', function(event) {
      let isBtn, target;

      target = event.target;
      isBtn = containsClass(target, 'form_toggle') || containsClass(target, 'reply_btn') || containsClass(target, 'btn_close');

      if(isBtn) {
        modifyClass(form, open);
        modifyClass(elem('.form_toggle'), hidden);
        resetReplyTarget();
      }

    });
  })();

  function clearForm() {
    let fields = elems('.form_input', form);
    fields.forEach((field) => { field.value = '' });
  }

  function resetReplyTarget() {
    // toggle reply notice
    modifyClass(replyNotice, 'hidden');
  }

  // record reply target when "reply to this comment" is pressed
  (function toggleReplyNotice() {
    let comment, reply_id, reply_name, reply_thread;
    reply_id = elem('.reply_id', form);
    reply_name = elem('.reply_name', form);
    reply_thread = elem('.reply_thread', form);
    if (comments) {
      comments.addEventListener('click', function (evt){
        if (evt.target && containsClass(evt.target, 'reply_btn')) {
          comment = evt.target.parentNode;
          let threadID = elem('.comment_thread', comment).textContent;
          reply_thread.value = threadID;
          reply_id.value = comment.id;
          let replyName = comment.getElementsByClassName('comment_name_span')[0].textContent;
          reply_name.value = replyName;
          elem('.reply_name').textContent = replyName;
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

(function makeExternalLinks(){
  let links = elems('a');
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
  let copy, doc, selection, selected;
  copy = createEl('textarea');
  copy.value = str;
  copy.setAttribute('readonly', '');
  copy.style.position = 'absolute';
  copy.style.left = '-9999px';
  selection = document.getSelection();
  doc = document.documentElement;
  doc.appendChild(copy);
  // check if there is any content selected previously
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
  let deeplink, deeplinks, newLink, target;
  deeplink = 'link';
  deeplinks = elems(`.${deeplink}`);
  if(deeplinks) {
    document.addEventListener('click', function(event)
    {
      target = event.target;
      if (target && target.classList.contains(deeplink) || target.parentNode.classList.contains(deeplink)) {
        event.preventDefault();
        newLink = target.href != undefined ? target.href : target.parentNode.href;
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
  title = aside ? aside.previousElementSibling : null;
  if(aside && title.nodeName.toLowerCase() === 'h3') {
    posts = Array.from(aside.children);
    posts.length < 1 ? title.remove() : false;
  }
})();
