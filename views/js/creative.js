// init bootpag
let filter, genre, pages

function init() {
  filter = "all";
  genre = "drama";
  listAPICall(1).then(data => {
    pages = data.total_pages
    setPagination(pages)
  })

}

function setFilter(value) {
  filter = value
}

function setGenre(value) {
  genre = value
}

$("#form-id").on('submit', function (e) {
  e.preventDefault();
})

function reloadMovieList() {

  listAPICall(1)
    .then(() => {
      setPagination(pages)
    })

}

function setPagination(pages) {
  console.log("set pagination called")
  let config = {
    total: pages,
    page: 1,
    maxVisible: 5,
    leaps: true,
    href: "#",
  }
  $('#page-selection').bootpag(config).on("page", function (event, /* page number here */ num) {
    listAPICall(num)
  });
}

function listAPICall(page) {

  return new Promise((resolve, reject) => {
    $.ajax({
      url: "https://s4g2kaqznk.execute-api.us-east-1.amazonaws.com/Prod/movies-list?filter=" + filter + "&genre=" + genre + "&page=" + page,
      method: "GET",
      dataType: 'json',
      contentType: "application/json",
      success: function (data) {
        if (data.status == 200) {
          let list = data.data,
            elem = document.getElementById("image-list")
          pages = data.total_pages
          elem.innerHTML = ""
          list.forEach(function (movie) {

            let modalValue = "openModal(" + JSON.stringify(movie) + ")"
            elem.innerHTML += `<div data-toggle="modal" data-target="#myModal" onclick='` + modalValue + `')"
                    class="col-3 p-3">
                    <div class="pb-2">
                        <img id="box1" src='`+ movie.posters + `' class=" display-image" />
                    </div>
                    <a href="#" class="modal-toggle">`+ movie.title + `</a>
                </div>`
          })
          resolve(data)
        }
      },
    });
  })

}

function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function (e) {
    var a, b, i, val = this.value;
    /*close any already open lists of autocompleted values*/
    closeAllLists();
    if (!val) { return false; }
    currentFocus = -1;
    /*create a DIV element that will contain the items (values):*/
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    /*append the DIV element as a child of the autocomplete container:*/
    this.parentNode.appendChild(a);
    /*for each item in the array...*/
    for (i = 0; i < arr.length; i++) {
      /*check if the item starts with the same letters as the text field value:*/
      if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        /*create a DIV element for each matching element:*/
        b = document.createElement("DIV");
        /*make the matching letters bold:*/
        b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
        b.innerHTML += arr[i].substr(val.length);
        /*insert a input field that will hold the current array item's value:*/
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        /*execute a function when someone clicks on the item value (DIV element):*/
        b.addEventListener("click", function (e) {
          /*insert the value for the autocomplete text field:*/
          inp.value = this.getElementsByTagName("input")[0].value;
          /*close the list of autocompleted values,
          (or any other open lists of autocompleted values:*/
          closeAllLists();
        });
        a.appendChild(b);
      }
    }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function (e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      /*If the arrow DOWN key is pressed,
      increase the currentFocus variable:*/
      currentFocus++;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 38) { //up
      /*If the arrow UP key is pressed,
      decrease the currentFocus variable:*/
      currentFocus--;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (x) x[currentFocus].click();
      }
    }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}

$("#myInput").keyup(function () {
  console.log("keyup called==========")
  if ($("#myInput").val().length > 4) {
    autoCompleteSearch();
  }
})

/*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/
function autoCompleteSearch() {
  let searchValue = $("#myInput").val();
  /*An array containing all the country names in the world:*/
  $.ajax({
    url: "https://s4g2kaqznk.execute-api.us-east-1.amazonaws.com/Prod/movies-search?query=" + searchValue,
    method: "GET",
    dataType: 'json',
    contentType: "application/json",
    success: function (data) {
      console.log("data from API=======", data)
      if (data.status == 200) {
        var movies = data.data
        console.log("movies===========", movies)
        autocomplete(document.getElementById("myInput"), movies);
      }
    },
  });
}
function openModal(movieObj) {
  let movie = (typeof (movieObj) == 'string') ? JSON.parse(movieObj) : movieObj
  let elem = document.getElementById("modalMovieTitle"),
    url = window.location.href,
    userId = parseInt(url.substring(url.indexOf('userId=') + 7))
  elem.innerHTML = movie.title
  elem = document.getElementById("youtubeVideoLink")
  let youtubeLink = "https://www.youtube.com/embed/" + movie.youtube_id,
    closeVal = "closePopup(" + JSON.stringify(movie) + ")"
  elem.innerHTML = `<iframe src="` + youtubeLink + `" allowfullscreen></iframe>`
  elem = document.getElementById('close-button')
  elem.innerHTML = `<button id="close-button" type="button" class="modal-close close" onclick='` + closeVal + `'
  data-dismiss="modal">&times;</button>`
  let req = {
    "user_id": userId,
    "movie_id": movie.movie_id
  }


  $.ajax({
    url: "https://s4g2kaqznk.execute-api.us-east-1.amazonaws.com/Prod/movies-watched",
    method: "POST",
    data: JSON.stringify(req),
    dataType: 'json',
    contentType: "application/json",
    success: function (data) {
      if (data.status == 200) {
        console.log("data published into SQS")
      } else {
        console.log("error occured while publishing into SQS")
      }
    },
  });

}

function closePopup(movie) {
  let url = window.location.href,
    userId = parseInt(url.substring(url.indexOf('userId=') + 7))
  $('.modal').toggleClass('is-visible');
  let rating = $('input[name=rating]:checked').val()

  if (rating && movie) {
    let req = {
      "user_id": userId,
      "movie_id": movie.movie_id,
      "rating": rating
    }


    $.ajax({
      url: "https://s4g2kaqznk.execute-api.us-east-1.amazonaws.com/Prod/movies-watched",
      method: "POST",
      data: JSON.stringify(req),
      dataType: 'json',
      contentType: "application/json",
      success: function (data) {
        if (data.status == 200) {
          console.log("data published into SQS on close pop")
        } else {
          console.log("error occured while publishing into SQS")
        }
      },
    });
  }
}
