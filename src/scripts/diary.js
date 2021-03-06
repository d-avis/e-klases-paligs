window.addEventListener(`pageLoading`, () => {
	if (!window.location.href.includes(`/Family/Diary`)) {
		return;
	}

	/*
		Change the diary header buttons
	*/
	for (let diaryHeaderElement of document.querySelectorAll(`.students-journal-header-links`)) {
		diaryHeaderElement.removeChild(diaryHeaderElement.children[0]); // Remove the timetable button
		
		/* let legendButton = document.createElement(`a`);
		legendButton.href = `javascript:void(0);`;
		legendButton.className = `open-legend`;
		legendButton.innerText = `Apzīmējumi`; */
		// I'm gonna implement the legend button at a later date

		let timetableButton = document.createElement(`a`);
		timetableButton.href = `javascript:void(0);`;
		timetableButton.className = `open-timetable`;
		timetableButton.innerText = `Stundu laiki`;
		// The reason we created the timetable button again even though it was already there is
		// to remove all event listeners so the scripts in /animations/ directory can have an easier life

		diaryHeaderElement.insertBefore(timetableButton, diaryHeaderElement.children[0]);
		//diaryHeaderElement.insertBefore(legendButton, diaryHeaderElement.children[0]);
	}

	/*
		Add modal background element
	*/
	let modalBgElement = document.createElement(`div`);
	modalBgElement.className = `modal-background`;
	document.body.appendChild(modalBgElement);

	/*
		Load the timetable data from the very beginning
	*/
	fetch(`https://my.e-klase.lv/Family/LessonTimes`).then((response) => {
		response.text().then((res) => {
			let data = new DOMParser().parseFromString(res, `text/html`);
			let timetableElement = document.querySelector(`.lesson-times-modal .modal-body .timetable`);

			for (let item of data.querySelectorAll(`.timetible-item`)) {
				timetableElement.innerHTML +=
					`<div class="timetible-item">
						<div class="name">
							<span>
								${item.children[0].innerText.trim()}
							</span>
						</div>
						<div class="time">
							${item.children[1].innerText.trim()}
						</div>
					</div>`; 
					// Unfortunately the misspelled "timetible" can't be changed to "timetable" because the CSS breaks too much then
					// It's still somewhat relying on the original E-klase CSS code
			}

			timetableElement.classList.remove(`loading-animation-container`);
		});
	});

	/*
		Remove the different column colors from the table header in diary when there is no data
	*/
	for (let i of document.querySelectorAll(`table.lessons-table`)) {
		if (i.children[1].children[0].children[0].className.includes(`no-data`)) {
			for (let o of i.querySelectorAll(`thead tr td`)) {
				o.innerHTML = ``;
				o.style.background = `var(--background-middle-dark-color)`;
			}
		}
	}

	/*
		Make the grade column wider when necessary
	*/
	let gradeColumnWidth = 110; // 110px is the default width
	for (let element of document.querySelectorAll(`.score.open-mark-file`)) {
		if (element.clientWidth + 12 > gradeColumnWidth) {
			gradeColumnWidth = element.clientWidth + 12; // Add 12 because the padding on both sides is 6px
		}
	}
	for (let element of document.querySelectorAll(`.lessons-table td.score`)) {
		element.style.width = `${gradeColumnWidth}px`;
	}

	/*
		Resize the answering container to fit the content
	*/
	for (let element of document.querySelectorAll(`.home-task-answer-widget-container`)) {
		tryResizingAnswerWidget(element);
	}

	/*
		Add the custom calendar
	*/
	if (document.querySelector(`.main-eklase-content`) !== null) {
		let parentElement = document.querySelector(`.main-eklase-content`);

		let calendarElement = document.createElement(`div`);
		calendarElement.className = `calendar desktop-top closed`;
		calendarElement.style.display = `none`;
		calendarElement.innerHTML = `
			<div class="calendar-level">
				<div class="calendar-header">

				</div>
			</div>
			<div class="calendar-level">
				<div class="calendar-header">

				</div>
			</div>
		`;

		parentElement.appendChild(calendarElement);

		let topCalendarHolder = document.querySelectorAll(`.week-selector .selected-period`)[0];
		topCalendarHolder.addEventListener(`click`, () => {
			if (calendarElement.style.display === `none`) {
				calendarElement.style.display = `block`;

				setTimeout(() => {
					calendarElement.style.opacity = `1`;
					calendarElement.style.transform = `translateY(0)`;
				}, 20);
			} else {
				calendarElement.style.opacity = `0`;
				calendarElement.style.transform = `translateY(10px)`;

				setTimeout(() => {
					calendarElement.style.display = `none`;
				}, 200);
			}
		});
	}
});

const tryResizingAnswerWidget = (element) => {
	if (element.querySelector(`.Widget`) !== null) {
		let elementHeight = Math.ceil(element.querySelector(`p`).innerText.length / 50) * 18 + 34;
		element.style.height = `${elementHeight}px`;
		element.children[0].style.height = `${elementHeight}px`;
	} else {
		setTimeout(() => tryResizingAnswerWidget(element), 20);
	}
}