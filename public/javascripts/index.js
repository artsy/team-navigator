$(function() {
  'use strict';

  var $teams, $header, $results, $members, threshold;

  $teams = $('.js-teams');
  $header = $('.js-header');
  $results = $('.js-results');
  $members = $('.js-member');

  threshold = Math.floor($members.length / 5) || ($members.length - 1);

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
