function searchTextUpdated(searchField) {
  var searchText = searchField.value;


  $('.member').each(function(index) {
    // console.log($(this).attr('data-name'));
    $(this).removeClass('hidden');
  });

  $('.member').filter(function(index) {
    return $(this).attr('data-name').indexOf(searchText) == -1;
  }).each(function(index) {
    $(this).addClass('hidden');
  });

  console.log("");
}
