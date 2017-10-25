function uploadFileHandler(formID, regex, messageDivID){
	var reader = new FileReader();
	$('#'+formID+' input[type="submit"]').addClass('disabled');
	
	$('#'+formID+' input[type="file"]').change(function(e) {
		resetMessage(messageDivID);
		var file = $('#'+formID+' input[type="file"]')[0].files[0];
		if (file.name.match(regex)) {
			reader.readAsText(file);
			reader.onloadstart = function(){
				$('#'+formID+' input[type="submit"]').button('loading');
			}
			reader.onloadend = function(){
				$('#'+formID+' input[type="submit"]').button('reset');
			};
		} else {
			$('#'+messageDivID).replaceWith('<div id="'+messageDivID+'" class="alert alert-info"><strong>Errore! </strong> File non supportato</div>');
			$('#'+formID+' input[type="submit"]').addClass('disabled');
		}
	});
	
	$('#'+formID).submit(function(e) {
		e.preventDefault();
		e.stopImmediatePropagation();
		if(!$('#'+formID+' input[type="submit"]').hasClass('disabled')){
			$('#'+formID+' input[type="submit"]').button('loading');
			$.ajax({
				type: "POST",
				cache: false,
				url: $(this).attr('action'),
				data: reader.result,
				dataType: 'json',
				success: function(data) {
					if (data.info.status == true) {
					   $('#'+messageDivID).replaceWith('<div id="'+messageDivID+'" class="alert alert-success"><strong>Successo! </strong>' + data.info.description + '</div>');
					   $('#'+formID)[0].reset();								
					} else {
						$('#'+messageDivID).replaceWith('<div id="'+messageDivID+'" class="alert alert-danger"><strong>Errore! </strong>' + data.info.description + '</div>');
					}
					$('#'+formID+' input[type="submit"]').button('reset');
					setTimeout(function(){
					$('#'+formID+' input[type="submit"]').addClass('disabled');
					}, 0);
				},
				error: function(data, textStatus, errorThrown){
					$('#'+formID+' input[type="submit"]').button('reset');
					$('#'+formID+' input[type="submit"]').addClass('disabled');
					$('#'+messageDivID).replaceWith('<div id="'+messageDivID+'" class="alert alert-danger"><strong>Errore! </strong>' + errorThrown + '</div>');
				}
			});
		}
	});
									

							
}	

function resetMessage(messageDivID) {
	$('#'+messageDivID).replaceWith('<div id="'+messageDivID+'"></div>');
}