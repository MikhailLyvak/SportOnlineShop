fetch('http://127.0.0.1:8000/api/types/')
	.then(response => response.json())
	.then(data => {
		const menu = document.querySelector('.simplebar-content ul');
		const icons = [
			'ri-shape-fill',
			'ri-focus-2-line',
			'ri-table-alt-fill',
			'ri-drag-move-line',
			'ri-contrast-2-fill'
		]

		data.forEach((category, index) => {
			const dropdownMenu = document.createElement('li');
			dropdownMenu.className = index === 0 ? 'nav-item border-top border-bottom border-2' : 'nav-item border-bottom border-2';

			const randomIndex = getRandomInt(0, icons.length - 1);
			const randomIcon = icons[randomIndex];
			dropdownMenu.innerHTML = `
                <a class="nav-link menu-link collapsed" href="#sidebar${category.name}" data-bs-toggle="collapse" role="button"
                    aria-expanded="false" aria-controls="sidebar${category.name}">
                    <i class="${randomIcon}"></i> <span data-key="t-authentication">${category.name}</span>
                </a>
                <div class="menu-dropdown collapse" id="sidebar${category.name}" style="">
                    <ul class="nav nav-sm flex-column">
                        <!-- JavaScript will dynamically generate links here -->
                    </ul>
                </div>
            `;

			const dropdownMenuUl = dropdownMenu.querySelector('.menu-dropdown ul');

			category.cluster_types.forEach(clusterType => {
				const menuItem = document.createElement('li');
				menuItem.className = 'nav-item';
				menuItem.innerHTML = `
                    <a class="nav-link" data-key="t-sweet-alerts" id="${clusterType}" style="cursor:grab">
                        ${clusterType}
                    </a>
                `;

				menuItem.addEventListener('click', function () {
					filterBy = clusterType;
					const url = `/api/goods/?good_type_name=${filterBy}&ordering=${orderBy}`;
					const goodCardsListContainer = document.getElementById("goodCardsListContainer");
					goodCardsListContainer.innerHTML = '';
					previousButton = menuItem.querySelector('a');
					var nextButton = document.getElementById('next_button');
					nextButton.classList.remove('disabled');
				
					goodCardsList(url, true, filterBy);
				});
				dropdownMenuUl.appendChild(menuItem);
			});
				

			menu.appendChild(dropdownMenu);
		});
	})
	.catch(error => {
		console.error('Error fetching data:', error);
	});

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

