$(function() {
	var $mainContent = $('body .content');
	var $sidebar = $('body .side-nav');

	$('iframe.edit').on('load', function() {
		$(this).height($mainContent.height());
		$(this).css('visibility', 'visible');
		$(this).contents().find('body').attr('contenteditable', 'true');
	});

	$('#sidebarToggle').on('click', function() {
		var $this = $(this);

		if(!$sidebar.data('closed')) {
			$sidebar.css('margin-left', '-150px');
			$this.addClass('rotated');
			$sidebar.data('closed', true);
		} else {
			$sidebar.css('margin-left', 0);
			$this.removeClass('rotated');
			$sidebar.data('closed', false);
		}
	});
});