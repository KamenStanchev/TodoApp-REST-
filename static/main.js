
let activeItem = null
function getCookie(name) {
		    let cookieValue = null;
		    if (document.cookie && document.cookie !== '') {
		        let cookies = document.cookie.split(';');
		        for (let i = 0; i < cookies.length; i++) {
		            let cookie = cookies[i].trim();
		            // Does this cookie string begin with the name we want?
		            if (cookie.substring(0, name.length + 1) === (name + '=')) {
		                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
		                break;
		            }
		        }
		    }
		    return cookieValue;
		}
let csrftoken = getCookie('csrftoken');

let list_snapshot = []

buildList()

function buildList(){
    const wrapper = document.getElementById('list-wrapper')
    wrapper.innerHTML = ''
    let url = 'http://127.0.0.1:8000/api/task-list/'

    fetch(url)
        .then((resp) => resp.json())
        .then(function(data){
            console.log('Data:', data)

            let list = data
            for (let i in list){
                let title = '<span class="title">' + list[i].title + '</span>'
                if (list[i].completed === true){
                    title = '<strike class="title">' + list[i].title + '</strike>'
                }
                let item =
                    '<div id = "data-row-${i}" class="task-wrapper flex-wrapper">' +
                        '<div style="flex:7">' +
                            title +
                        '</div>' +
                        '<div style="flex:1">' +
                            '<button class="btn btn-sm btn-outline-info edit">Edit</button>' +
                        '</div>' +
                        '<div style="flex:1">' +
                            '<button class="btn btn-sm btn-outline-dark delete">-</button>' +
                        '</div>' +
                    '</div>'

                wrapper.innerHTML += item
            }


            for (let i in list){
                let editBtn = document.getElementsByClassName('edit')[i]
                let deleteBtn = document.getElementsByClassName('delete')[i]
                let titleBtn = document.getElementsByClassName('title')[i]

                editBtn.addEventListener('click', function (){editItem(list[i])})
                deleteBtn.addEventListener('click', function (){deleteItem(list[i])})
                titleBtn.addEventListener('click', function (){strikeUnstrike(list[i])})

            }
        })
}

let form = document.getElementById('form-wrapper')


form.addEventListener('submit', function (e){
    e.preventDefault()
    console.log('Submit form')

    let url = 'http://127.0.0.1:8000/api/task-create/'
    if (activeItem != null){
				url = `http://127.0.0.1:8000/api/task-update/${activeItem.id}/`
				activeItem = null
    }


    let title = document.getElementById('title').value
    fetch(url, {
        method:'POST',
        headers:{
            'Content-type':'application/json',
            'X-CSRFToken':csrftoken,
        },
        body:JSON.stringify({'title':title})
    }
    ).then(function(){
				buildList()
				document.getElementById('form').reset()
			})
		})

function editItem(item){
    console.log('Edit Item:', item.title)
    activeItem = item
    document.getElementById('title').value = activeItem.title
}

function deleteItem(item){
    console.log('Delete item:', item.title)
    let url = `http://127.0.0.1:8000/api/task-delete/${item.id}/`
    fetch(url, {
            method:'DELETE',
            headers:{
                'Content-type':'application/json',
                'X-CSRFToken':csrftoken,
            }
        }).then(function(){
        buildList()
    })
}

function strikeUnstrike(item){
    console.log('Strike-Unstrike Item:', item.title)
    item.completed = !item.completed
    console.log(item.completed)
    let url = `http://127.0.0.1:8000/api/task-update/${item.id}/`
    fetch(url, {
        method:'POST',
        headers:{
            'Content-type':'application/json',
            'X-CSRFToken':csrftoken,
        },
        body:JSON.stringify({'title':item.title, 'completed': item.completed})
    }
    ).then((response) => {
				buildList()
			})
}



