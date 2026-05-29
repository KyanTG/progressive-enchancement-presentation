const form = document.querySelector('.filter-form');
const results = document.getElementById('results');

if (form && results) {
	const submitBtn = form.querySelector('button[type="submit"]');
	if (submitBtn) submitBtn.remove();

	const select = form.querySelector('select[name="category"]');

	const searchWrap = document.createElement('label');
	searchWrap.className = 'search-label';
	searchWrap.innerHTML = `
		<span>Search</span>
		<input type="search" name="q" placeholder="Type to search…" autocomplete="off">
	`;
	form.appendChild(searchWrap);
	const search = searchWrap.querySelector('input');

	let items = null;

	form.addEventListener('submit', (e) => e.preventDefault());
	select.addEventListener('change', update);
	search.addEventListener('input', update);

	async function update() {
		if (items === null) items = await loadItems();
		render(items, select.value, search.value.trim().toLowerCase());
	}

	async function loadItems() {
		try {
			const res = await fetch('data.json');
			if (!res.ok) throw new Error(res.statusText);
			return await res.json();
		} catch (err) {
			console.warn('fetch failed — falling back to in-page items', err);
			return [...results.querySelectorAll('li')].map(li => ({
				title: li.textContent.trim(),
				category: li.dataset.category || '',
			}));
		}
	}

	function render(list, category, query) {
		const filtered = list.filter(i => {
			const byCategory = category === 'all' || i.category === category;
			const byQuery = !query || i.title.toLowerCase().includes(query);
			return byCategory && byQuery;
		});

		results.innerHTML = filtered.length
			? filtered.map(i => `<li data-category="${i.category}">${i.title}</li>`).join('')
			: '<li class="empty">No matches</li>';
	}

	update();
}


const carousel = document.querySelector('.carousel');
const jsPrev = document.querySelector('.js-prev');
const jsNext = document.querySelector('.js-next');

if (carousel && jsPrev && jsNext) {
	jsPrev.addEventListener('click', () => {
		carousel.scrollBy({ left: -carousel.clientWidth, behavior: 'smooth' });
	});
	jsNext.addEventListener('click', () => {
		carousel.scrollBy({ left: carousel.clientWidth, behavior: 'smooth' });
	});
}
