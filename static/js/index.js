(function() {
  function toggleMenu(){
    let nav = '.nav-body';
    let open = 'nav-open';
    $('.nav-drop').toggleClass('nav-pop');
    $('.nav-bar').toggleClass('hidden');
    var menuOpen = $(nav).hasClass(open);
    var menuPulled = $(nav).hasClass('nav-exit');
    (menuOpen || menuPulled) ? $(nav).toggleClass('nav-open nav-exit') : $(nav).toggleClass(open);
  }

  $('.nav-bar, .nav-close').on('click', () => toggleMenu());

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

// (function(){
//   font = document.createElement('link');
//   font.type = 'text/css'; 
//   font.rel = 'stylesheet';
//   font.href = '{{ Site.Data.fonts }}';
//   s = document.getElementsByTagName('link')[0]; 
//   s.parentNode.insertBefore(font, s);
// })();

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