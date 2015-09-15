$(function() {
  'use strict';

  var threshold, $teams, $header, $results, $members;

  threshold = 30;

  $teams = $('.js-teams');
  $header = $('.js-header');
  $results = $('.js-results');
  $members = $('.js-member');

  $('.js-search')
    .on('focus', function() {
      $header.addClass('is-focused');
    })
    .on('blur', function() {
      $header.removeClass('is-focused');
    })
    .on('input', function() {
      var query, $matches;

      query = $(this).val().toLowerCase();
      $matches = $members.filter(function() {
        if (this.textContent.toLowerCase().indexOf(query) >= 0) return $(this);
      });

      if (threshold >= $matches.length) {
        var $rendered;

        $teams.hide();

        $rendered = $('<div class="members"></div>').html($matches.clone());
        $results.html($rendered).show();
      } else {
        $teams.show();

        $results.empty().hide();
      }
    });
});
