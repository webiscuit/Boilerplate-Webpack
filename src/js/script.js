// import 'bootstrap/dist/js/bootstrap';
import $ from 'jquery';

$('.navbar-toggler').click(function() {
  var target = $(this).attr('data-target');
  
  if($(target).hasClass('show')) {
    $(target).removeClass('show');
  } else {
    $(target).addClass('show');
  }
  
});

$('#pageTop').click(function() {
  $('html, body').animate({scrollTop:0});
});
