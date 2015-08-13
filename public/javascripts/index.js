function searchTextUpdated(searchField) {
  var searchText = searchField.value;


  $('.member, .team').each(function(index) {
    $(this).removeClass('hidden');
  });

  $('.member').filter(function(index) {
    return $(this).attr('data-name').toLowerCase().indexOf(searchText.toLowerCase()) == -1;
  }).each(function(index) {
    $(this).addClass('hidden');
  });

  $('.team').filter(function(index) {
    return $(this).children('.team-members').children(':not(.hidden)').length == 0
  }).each(function(index) {
    $(this).addClass('hidden');
  });
}
