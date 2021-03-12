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
