require('../styles/index.scss');

// Make sure viewBox attributes are added to all SVG symbol references
Array.from(document.querySelectorAll('use'))
	.forEach(ref => {
		if (ref.hasAttribute('xlink:href') && !ref.hasAttribute('viewBox')) {
			const symbolId = ref.getAttribute('xlink:href').substring(1);
			const svgParentEl = ref.parentElement;
			const symbolEl = document.getElementById(symbolId);

			if (symbolId && svgParentEl && symbolEl) {
				const viewBoxRaw = symbolEl.getAttribute('viewBox');
				const viewBoxVals = viewBoxRaw.indexOf(' ') !== -1 ? viewBoxRaw.split(' ') : viewBoxRaw.split(',');
				viewBoxVals.map(value => value.trim());
				svgParentEl.setAttribute('viewBox', `0 0 ${viewBoxVals[2]} ${viewBoxVals[3]}`);
			}
		}
	});
