function validateForm() {
	let errorContainer = document.getElementById("information");
	let pizzaName = document.forms["addPizza"]["pizzaName"].value;
	let pizzaPrice = document.forms["addPizza"]["pizzaPrice"].value;
	
	if (pizzaName == "") {
		errorContainer.innerHTML = "Pizza name must be filled out";
		return false;
	} else if (pizzaName.length > 30) {
		errorContainer.innerHTML = "Pizza name must be shorter than 30 symbols";
		return false;
	} else if (pizzaPrice = document.forms["addPizza"]["pizzaPrice"].value == "") {
		errorContainer.innerHTML = "Price must be filled out";
		return false;
	} else if (document.querySelectorAll('input[type="checkbox"]:checked').length < 2) {
		errorContainer.innerHTML = "Select at least two toppings";
		return false;
	} else {
		return true;
	}
}

function submitNewPizza() {
	if(validateForm()){
		if(sessionStorage.getItem('noOfPizzas') == null)
			sessionStorage.setItem('noOfPizzas', 1);
		
		let number = parseInt(sessionStorage.getItem('noOfPizzas'))+1;
		sessionStorage.setItem(number+"name", document.forms["addPizza"]["pizzaName"].value);
		sessionStorage.setItem(number+"price", document.forms["addPizza"]["pizzaPrice"].value);
		sessionStorage.setItem(number+"heat", document.forms["addPizza"]["pizzaHeat"].value);
		
		let toppings = document.getElementsByName("topping");
			let checkedToppings = [];
			for (let i=0;i<toppings.length;i++){
			  if(toppings[i].checked){
				checkedToppings.push(toppings[i]);
			  }
			}
			let selectedToppings = "";
			for (let i=0;i<checkedToppings.length;i++){
				if(i != checkedToppings.length-1){
					selectedToppings += toppings[i].value + ", ";
				} else {
					selectedToppings += toppings[i].value;
				}
			}
		
		sessionStorage.setItem(number+"toppings", selectedToppings);
		sessionStorage.setItem(number+"photo", document.forms["addPizza"]["photo"].value);
		
		sessionStorage.setItem('noOfPizzas', number)
		return true;
	} else {
		return false;
	}
}

function drawBorder(id) {
	let previousValue = document.forms["addPizza"]["photo"].value;
	if(previousValue != ""){
		document.getElementById(previousValue).style.margin = "2px";
		document.getElementById(previousValue).style.border = "none";
	}
	document.forms["addPizza"]["photo"].value = id;
	document.getElementById(id).style.margin = "0px";
	document.getElementById(id).style.border = "2px solid orange";
}

function loadMenu() {
	document.getElementById("pizzaMenuLabel").innerHTML = "Pizza Menu";
	
	for (let i=1;i<=sessionStorage.getItem('noOfPizzas');i++){
		let pizza = document.createElement('li');
		let pizzaId = i + "-pizza";
		pizza.setAttribute('id', pizzaId);
		//pizza.style.display = "inline-block"
		let pizzaName = document.createElement('p');
		let pizzaNameId = i + "-pizza-name";
		pizzaName.setAttribute('id', pizzaNameId);
		pizzaName.innerHTML = sessionStorage.getItem(i+"name");
		pizza.appendChild(pizzaName);
		
		let pizzaPhoto = document.createElement('img');
		pizzaPhoto.setAttribute('src', sessionStorage.getItem(i+"photo"));
		pizzaPhoto.setAttribute('height', '188');
		pizzaPhoto.setAttribute('width', '234');
		pizza.appendChild(pizzaPhoto);
		
		let pizzaPrice = document.createElement('p');
		let pizzaPriceId = i + "-pizza-price";
		pizzaPrice.setAttribute('id', pizzaPriceId);
		pizzaPrice.innerHTML = sessionStorage.getItem(i+"price")+" €";
		pizza.appendChild(pizzaPrice);
		
		let pizzaHeatValue = document.createElement('input');
		pizzaHeatValue.setAttribute('type', 'hidden');
		let pizzaHeatValueId = i + "-pizza-heat";
		pizzaHeatValue.setAttribute('id', pizzaHeatValueId);
		pizzaHeatValue.setAttribute('value', sessionStorage.getItem(i+"heat"));
		pizza.appendChild(pizzaHeatValue);
		
		for (let j=1; j<sessionStorage.getItem(i+"heat"); j++){
			let pizzaHeat = document.createElement('img');
			pizzaHeat.setAttribute('src', 'chili.png' );
			pizzaHeat.setAttribute('height', '20');
			pizzaHeat.setAttribute('width', '20');
			pizza.appendChild(pizzaHeat);
		}
		
		let pizzaToppings = document.createElement('p');
		pizzaToppings.innerHTML = sessionStorage.getItem(i+"toppings");
		pizza.appendChild(pizzaToppings);
		
		let deleteButton = document.createElement('button');
		deleteButton.onclick=function() {
			deletePizza(i);
		};
		deleteButton.innerHTML = "Delete";
		deleteButton.style.marginBottom = "20px";
		pizza.appendChild(deleteButton);
		
		pizza.style.marginBottom = "50px";
		pizza.style.border = "2px solid black";
		document.getElementById("pizzaMenu").appendChild(pizza);
	}
	sortMenu("by name");
}

function deletePizza(i){
	if(confirm("Are You sure You want to delete this pizza?")){
		sessionStorage.removeItem(i+'name');
		sessionStorage.removeItem(i+'price');
		sessionStorage.removeItem(i+'heat');
		sessionStorage.removeItem(i+'toppings');
		sessionStorage.removeItem(i+'photo');
		let newNumberOfPizzas = parseInt(sessionStorage.getItem('noOfPizzas'))-1;
		sessionStorage.setItem('noOfPizzas', newNumberOfPizzas);
		document.getElementById(i+"-pizza").remove();
	}
}

function sortMenu(sortingProperty) {
  var list, i, switching, b, shouldSwitch;
  list = document.getElementById("pizzaMenu");
  switching = true;
  while (switching) {
    switching = false;
    b = list.getElementsByTagName("LI");
    for (i = 0; i < (b.length - 1); i++) {
      shouldSwitch = false;
	  let currentElementData;
	  let nextElementData;
	  if(sortingProperty == "by name"){
		  currentElementData = document.getElementById(b[i].id+"-name").innerHTML.toLowerCase();
		  nextElementData = document.getElementById(b[i + 1].id+"-name").innerHTML.toLowerCase();
	  } else if (sortingProperty == "by price"){
		  currentElementData = document.getElementById(b[i].id+"-price").innerHTML;
		  currentElementData.substring(0, currentElementData.length - 2);
		  nextElementData = document.getElementById(b[i + 1].id+"-price").innerHTML;
		  nextElementData.substring(0, nextElementData.length - 2);
	  } else if (sortingProperty == "by heat"){
		currentElementData = document.getElementById(b[i].id+"-heat").value; 
		nextElementData = document.getElementById(b[i + 1].id+"-heat").value;
	  }
      if (currentElementData > nextElementData) {
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      b[i].parentNode.insertBefore(b[i + 1], b[i]);
      switching = true;
    }
  }
}