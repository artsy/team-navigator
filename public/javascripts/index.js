function searchTextUpdated(searchField) {
  var searchText = searchField.value;


  $('.member').each(function(index) {
    // console.log($(this).attr('data-name'));
    $(this).removeClass('hidden');
  });

  $('.member').filter(function(index) {
    return $(this).attr('data-name').toLowerCase().indexOf(searchText.toLowerCase()) == -1;
  }).each(function(index) {
    $(this).addClass('hidden');
  });

  // TODO: hide empty teams

  console.log("");
}
