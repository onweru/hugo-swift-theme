function createEl(element) {
  return document.createElement(element);
}

function elem(selector, parent = document){
  let elem = document.querySelector(selector);
  return elem != false ? elem : false;
}

function elems(selector) {
  let elems = document.querySelectorAll(selector);
  return elems.length ? elems : false; 
}

function containsClass(el, targetClass) {
  if (el && typeof el == 'object' && targetClass) {
    return el.classList.contains(targetClass) ? true : false;
  }
}

function pushClass(el, targetClasses) {
  // equivalent to addClass
  if (el && typeof el == 'object' && targetClasses) {
    let targets = targetClasses.split(" ");
    targets.forEach(function(targetClass) {
      elClass = el.classList;
      elClass.contains(targetClass) ? false : elClass.add(targetClass);
    });
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
  // equivalent to toggleClass
  if (el && typeof el == 'object' && targetClass) {
    elClass = el.classList;
    elClass.contains(targetClass) ? elClass.remove(targetClass) : elClass.add(targetClass);
  }
}

function listen(el, event, fn) {
  if(el && typeof el === 'object' && typeof event === 'string') {
    el.addEventListener(event, fn);
  }
}


(function() {
  function toggleMenu(){
    let nav, open, pop, navDrop, navBar, hidden;
    nav = '.nav-body';
    open = 'nav-open';
    pop = 'nav-pop';
    hidden = 'hidden';
    navDrop = elem('.nav-drop');
    navBar = elem('.nav-bar');
    // $('.nav-drop').toggleClass('nav-pop');
    modifyClass(navDrop, pop);
    // $('.nav-bar').toggleClass('hidden');
    modifyClass(navBar, hidden)
    var menuOpen = $(nav).hasClass(open);
    var menuPulled = $(nav).hasClass('nav-exit');
    (menuOpen || menuPulled) ? $(nav).toggleClass('nav-open nav-exit') : $(nav).toggleClass(open);
  }
  

  $('.nav-bar, .nav-close').on('click', function() {
    toggleMenu();
  } );

  $('.nav-drop').on('click', function(e) {
    e.target === this ? toggleMenu() : false;
  });


  var $fetchas = new Date();
  var $anos = $fetchas.getFullYear();
  $('.year').text($anos);

  $('.articulo a').attr('target', '_blank');

})();

(function ($) {
  var $comments = $('.js-comments');
  let $form = $('#comments-form');
  $form.submit(function () {
    let form = this;

    $(this).addClass('form-loading');

    $.ajax({
      type: $(this).attr('method'),
      url: $(this).attr('action'),
      data: $(this).serialize(),
      contentType: 'application/x-www-form-urlencoded',
      success: function (data) {
        showModal('Review submitted', 'Thanks for your review! It will show on the site once it has been approved.');
        $(this).removeClass('form-loading');
        $("form").trigger("reset");
      },
      error: function (err) {
        showModal('Error', 'Sorry, there was an error with the submission!');
        $(this).removeClass('form-loading');
        $("form").trigger("reset");
      }
    });

    return false;
  });

  $('.modal_close').click(function () {
    $('body').removeClass('modal_show');
    $('form').removeClass('form-loading').removeClass('form-open');
    $('.form_toggle').removeClass('toggled');
  });

  function showModal(title, message) {
    $('.modal_title').text(title);
    $('.modal_text').html(message);

    $('body').addClass('modal_show');
  }
})(jQuery);


(function toggleForm() {
  $('.form_toggle').on('click', function() {
    $('.form-comments').toggleClass('form-open');
    $(this).toggleClass('toggled');
    $(this).hasClass('toggled') ? $(this).text('Cancel') : $(this).text('Comment');
  });
})();

(function share(){
  function showShare() {
    $('.share').addClass('share-open').removeClass('share-close');
  }
  function hideShare() {
    $('.share').removeClass('share-open').addClass('share-close');
  }

  $('.share-trigger').on('click', function() {
    showShare();
    setTimeout(hideShare, 5000);
  });
})();

(function(){
  'use strict';
  /*
  For every heading in your page, this adds a little anchor link `#` that you can click to get a permalink to the heading.
  Ignores `h1`, because you should only have one per page.
  The text content of the tag is used to generate the link, so it will fail "gracefully-ish" if you have duplicate heading text.
  */
  
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
    icon.src = '/images/link-symbol.svg';
    link.className = 'link';
    link.appendChild(icon);
    id = node.getAttribute('id');
    if(id) {
      link.href = `${current}#${id}`;
      node.appendChild(link);
      pushClass(node, 'link_owner');
    }
  });
})();

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
    document.body.addEventListener('click', function(event) {
      let target = event.target;
      if (target.classList.contains(deeplink) || target.parentNode.classList.contains(deeplink)) {
        let newLink = target.href != undefined ? target.href : target.parentNode.href; 
        copyToClipboard(newLink);
      }
    });
  }
})();