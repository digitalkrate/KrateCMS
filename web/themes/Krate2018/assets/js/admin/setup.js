$(() => {
	const $forms = $('form[data-setup]');

	$('#install').on('click', e => {
		e.preventDefault();

		let setupData = {};
		let allValid = true;
		$forms.each(function() {
			const $this = $(this);
			const formData = $this.serializeArray();
			let data = {};

			formData.forEach(item => {
				const $elem = $this.find('[name="' + item.name + '"]');
				if(!item.value || !$elem[0].checkValidity()) {
					$elem.addClass('is-invalid');
					allValid = false;
				}

				data[item.name] = item.value;
			});

			setupData[$this.data('setup')] = data;
		});

		console.log(setupData);
	});
});
