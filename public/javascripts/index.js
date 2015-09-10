$(function() {
  'use strict';

  $('#search').on('input', function(e) {
    var searchText = $(this).val();

    // Show all teams, all subteams, all members.
    $('.member, subteam-name, .team').each(function(index) {
      $(this).removeClass('hidden');
    });

    if (!searchText.length) return;

    // Find any members whose names don't match, and hide them.
    $('.member').filter(function(index) {
      return $(this).attr('data-name').toLowerCase().indexOf(searchText.toLowerCase()) == -1;
    }).each(function(index) {
      $(this).addClass('hidden');
    });

    // Find any teams that have no visible members, and hide them.
    $('.team').filter(function(index) {
      return $(this).children('.team-members').children(':not(.hidden)').length === 0;
    }).each(function(index) {
      $(this).addClass('hidden');
    });

    // Hide all subteams
    $('h2.subteam-name').each(function(index) {
      $(this).addClass('hidden');
    });

    // Find subteams belonging to visible members
    var subteams = $('.member:not(.hidden)').map(function(index) {
      return $(this).attr('data-subteam');
    }).filter(function(index) {
      return $(this).length > 0;
    });

    // For ever subteam of a visible member, show it.
    for (i = 0; i < subteams.length; i++) {
      var header = $('h2:contains(' + subteams[i] + ')').first();
      header.removeClass('hidden');
    }

  });
});
