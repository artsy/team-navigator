$(function() {
  'use strict';

  var threshold, $results, $members;

  threshold = 30;
  $results = $('.js-results');
  $members = $('.js-member');

  $('.js-search').on('input', function() {
    var query, $matches;

    query = $(this).val().toLowerCase();
    $matches = $members.filter(function() {
      if (this.textContent.toLowerCase().indexOf(query) >= 0) return $(this);
    });

    if (threshold >= $matches.length) {
      var $rendered;

      $rendered = $('<div class="team-members"></div>').html($matches.clone());
      $results.html($rendered).show();
    } else {
      $results.empty().hide();
    }
  });
});
