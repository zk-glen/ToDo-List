//Select the elements

const clear = document.querySelector('.clear');
const dateElement = document.getElementById('date');
const list = document.getElementById('list');
const input = document.getElementById('input');
const addEntry = document.getElementById('add-entry');

//Classes names
const CHECK = 'fa-check-circle';
const UNCHECK = 'fa-circle-thin';
const LINE_THROUGH = 'lineThrough';

//Variables
let LIST, id;

//get item from local storage
let data = localStorage.getItem('TODO');

//Check if data is not empty
if (data) {
	LIST = JSON.parse(data);
	id = LIST.length; //set the id to the last one in the list
	loadList(LIST); //Load the list to the user interface
} else {
	//if data isn't empty
	LIST = [];
	id = 0;
}

//Load the list to the user interface
function loadList(array) {
	array.forEach(function(item) {
		addToDo(item.name, item.id, item.done, item.trash);
	});
}

//clear the local storage
clear.addEventListener('click', function() {
	localStorage.clear();
	location.reload();
});

//Show today's Date
const options = { weekday: 'long', month: 'short', day: 'numeric' };
const today = new Date();

dateElement.innerHTML = today.toLocaleDateString('en-US', options);

//add a todo function
function addToDo(toDo, id, done, trash) {
	//Check to see if it isn't in the trash
	if (trash) {
		return;
	}
	//Check if item is not completed
	const DONE = done ? CHECK : UNCHECK;
	const LINE = done ? LINE_THROUGH : '';

	const item = `
                    <li class="item">
                        <i class="fa ${DONE} co" job="complete" id="${id}"></i>
                        <p class="text ${LINE}">${toDo}</p>
                        <i class="fa fa-trash-o de" job="delete" id="${id}"></i>
                    </li>
                    `;
	const position = 'beforeend';

	list.insertAdjacentHTML(position, item);
}

//Add an item to the list when user clicks add button
addEntry.addEventListener('click', function(event) {
	const toDo = input.value;

	//If the input isn't empty
	if (toDo) {
		addToDo(toDo, id, false, false);

		LIST.push({
			name: toDo,
			id: id,
			done: false,
			trash: false
		});
		//add item to localstorage (This cost must be addded where the LIST  array is updated)
		localStorage.setItem('TODO', JSON.stringify(LIST));

		id++;
	}
	input.value = '';
});

//Add an item to the list when user hits enter key
document.addEventListener('keyup', function(event) {
	if (event.keyCode == 13) {
		const toDo = input.value;

		//If the input isn't empty
		if (toDo) {
			addToDo(toDo, id, false, false);

			LIST.push({
				name: toDo,
				id: id,
				done: false,
				trash: false
			});
			//add item to localstorage (This cost must be addded where the LIST  array is updated)
			localStorage.setItem('TODO', JSON.stringify(LIST));

			id++;
		}
		input.value = '';
	}
});

//complete to do
function completeToDo(element) {
	element.classList.toggle(CHECK);
	element.classList.toggle(UNCHECK);
	element.parentNode.querySelector('.text').classList.toggle(LINE_THROUGH);

	LIST[element.id].done = LIST[element.id].done ? false : true;
}

//Remove todo
function removeToDo(element) {
	element.parentNode.parentNode.removeChild(element.parentNode);

	LIST[element.id].trash = true;
}

//target the items created dynamically
list.addEventListener('click', function(event) {
	const element = event.target; //return the clicked element inside list
	const elementJob = element.attributes.job.value; //comple or delete

	if (elementJob == 'complete') {
		completeToDo(element);
	} else if (elementJob == 'delete') {
		removeToDo(element);
	}
	//add item to localstorage (This cost must be addded where the LIST  array is updated)
	localStorage.setItem('TODO', JSON.stringify(LIST));
});
