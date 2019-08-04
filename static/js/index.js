function elem(selector, parent = document){
  let elem = document.querySelector(selector);
  return elem != false ? elem : false;
}

function elems(selector) {
  let elems = document.querySelectorAll(selector);
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

  let comments = elem('.js-comments');
  let form = elem('.form');
  let body = elem('body');
  let button = elem('.form_toggle');
  let loading = 'form-loading';
  let open = 'form-open';
  let show = 'modal_show'
  let toggled = 'toggled';

  let successOutput = [
    'Review submitted', 
    'Thanks for your review! It will show on the site once it has been approved.'
  ];

  let errorOutput = [
    'Error', 
    'Sorry, there was an error with the submission!'
  ];
  
  function handleForm(form) {
    form.addEventListener('submit', function (event) {
      pushClass(form, loading);

      function resetForm() {
        deleteClass(form, loading);
        // $("form").trigger("reset");
      }

      function formActions(message) {
        showModal(...message) // array destructuring
        resetForm();
      }
      
      // $.ajax({
      //   type: $(this).attr('method'),
      //   url: $(this).attr('action'),
      //   data: $(this).serialize(),
      //   contentType: 'application/x-www-form-urlencoded',
      //   success: function (data) {
      //     formActions(successOutput);
      //   },
      //   error: function (err) {
      //     formActions(errorOutput);
      //   }
      // });

      event.preventDefault();
      
      function formToJSON(obj) {
        let rawData = Array.from(obj.elements);
        let data = {};
        rawData.forEach(function(element){
          data[element.name] = element.value;
        });

        return JSON.stringify(data);
      }
      
      let data = formToJSON(form);
      let url = form.getAttribute('action').trim();
      fetch(url, {
        method: "POST",
        body: data,
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
      deleteClass(form, open);
      deleteClass(button, toggled);
    });
  }
  
  containsClass(body, show) ? closeModal() : false;
  
  function showModal(title, message) {
    elem('.modal_title').textContent = title;
    elem('.modal_text').innerHTML = message;
    
    pushClass(body, show);
  }
  
  
  (function toggleForm() {
    if(button) {
      button.addEventListener('click', function() {
        modifyClass(form, open);
        modifyClass(this, toggled);
        this.textContent  = containsClass(this, toggled) ?  'cancel' : 'comment';
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
      isExternal = (url && typeof url == 'string' &&url.startsWith('http')) ? true : false;
      
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