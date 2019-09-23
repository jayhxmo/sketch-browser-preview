var get_html = function(nameOriginal, name, background) {
	return `<html>
  		<head><title>${nameOriginal}</title><meta charset='UTF-8'></head>
    	<body style='text-align: center; margin: 0; padding: 0; background: ${background};'>
    		<img style='width: 100%; margin: 0;' src='./${name}.webp'>
    	</body>
    </html>`;
};

var get_background = function(artboard) {
	let backgroundColor = artboard.backgroundColor();
	let red = (backgroundColor.red() * 255).toFixed(0),
		green = (backgroundColor.green() * 255).toFixed(0),
		blue = (backgroundColor.blue() * 255).toFixed(0),
		alpha = backgroundColor.alpha().toFixed(2);

	return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};

var preview = function(context, doc) {
	const selection = context.selection;

	if (selection.count() == 0) doc.showMessage('Please select 1 or more artboard(s)');
	else {
		let artboardExists = false;
		for (let i = 0; i < selection.count(); i++) {
			// let artboard = doc.currentPage().currentArtboard();
			if (selection[i].class() == 'MSArtboardGroup') {
				let artboardExists = true, artboard = selection[i];

				if (artboard != null) {
					let name = artboard.name().replace('/', '_');
					let artboard_filename = NSTemporaryDirectory() + name + '.webp';
					doc.saveArtboardOrSlice_toFile(artboard, artboard_filename);

					let background = get_background(artboard);

					let someContent = NSString.stringWithString_(get_html(artboard.name(), name, background));
					let filename = NSTemporaryDirectory() + name + '.html';
					someContent
						.dataUsingEncoding_(NSUTF8StringEncoding)
						.writeToFile_atomically_(filename, true);

					let file = NSURL.fileURLWithPath(filename);
					NSWorkspace.sharedWorkspace().openFile(file.path());
				}
			}
		}

		if (!artboardExists) {
			doc.showMessage('You must select 1 or more artboard(s)');
		}
	}
};

var onRun = function(context) {
	preview(context, context.document);
};
