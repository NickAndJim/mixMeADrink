app = {};

app.init = function() {
	app.smoothScrollFromHeader();
	app.getDrinksByName();
	app.getDrinksByAlcohol();
	app.getDrinksByIngredient();
	app.populateSpotlight();

	// separated these so it runs once on load
	app.getDrinksByRandom();
	app.getDrinksByRandomListenerEvent();
};

$(function() {
	app.init();
});

//Function for scrolling the page to the appropriate section when the user clicks anywhere on the header.
app.smoothScrollFromHeader = function() {
	$("header").on("click", function() {
		$("html,body").animate(
			{
				scrollTop: $("main").offset().top
			},
			"slow"
		);
	});
};
//Function to give the user a selection of drinks based on their search parameter displayed to the right of the userInput
app.getDrinksByName = function() {
	$("form.drinksByNameForm").on("submit", function(e) {
		e.preventDefault();
		const userDrinksInput = $("#drinksByName").val();
		$.ajax({
			url: "https://www.thecocktaildb.com/api/json/v1/1/search.php",
			method: "GET",
			dataType: "json",
			data: {
				s: userDrinksInput
			}
		}).then(function(response) {
			if (userDrinksInput != "") {
				app.populateGallery(response);
			}
		});
	});
};
//Function to give the user a selection of drinks based on their search parameter displayed to the right of the userInput
app.getDrinksByAlcohol = function() {
	$("form.drinksByAlcoholForm").on("submit", function(e) {
		e.preventDefault();
		const userAlcoholInput = $("#drinksByAlcohol").val();
		$.ajax({
			url: "https://www.thecocktaildb.com/api/json/v1/1/filter.php",
			method: "GET",
			dataType: "json",
			data: {
				i: userAlcoholInput
			}
		}).then(function(response) {
			if (userAlcoholInput != "") {
				app.populateGallery(response);
			}
		});
	});
};
//Function to give the user a selection of drinks based on their search parameter displayed to the right of the userInput. If the user gives 2 inputs, the selection given will only be drinks that contain both ingredients.
app.getDrinksByIngredient = function() {
	$("form.drinksByIngredientForm").on("submit", function(e) {
		e.preventDefault();
		const userIngredientInput1 = $("#drinksByIngredient1").val();
		const userIngredientInput2 = $("#drinksByIngredient2").val();

		const $call1 = $.ajax({
			url: "https://www.thecocktaildb.com/api/json/v1/1/filter.php",
			method: "GET",
			dataType: "json",
			data: {
				i: userIngredientInput1
			}
		});
		const $call2 = $.ajax({
			url: "https://www.thecocktaildb.com/api/json/v1/1/filter.php",
			method: "GET",
			dataType: "json",
			data: {
				i: userIngredientInput2
			}
		});

		if (userIngredientInput1 && !userIngredientInput2) {
			$call1.then(function(response1) {
				app.populateGallery(response1);
			});
		} else if (!userIngredientInput1 && userIngredientInput2) {
			$call2.then(function(response2) {
				app.populateGallery(response2);
			});
		} else if (userIngredientInput1 && userIngredientInput2) {
			const finalArray = { drinks: [] };
			$.when($call1, $call2).done(function(drinksArray1, drinksArray2) {
				differentArray = drinksArray1[0].drinks.filter(function(
					itemFromArray1
				) {
					drinksArray2[0].drinks.forEach(function(itemFromArray2) {
						if (itemFromArray1.idDrink === itemFromArray2.idDrink) {
							
							finalArray.drinks.push(itemFromArray1);
						}
					});
				});
				console.log(finalArray);
				app.populateGallery(finalArray);
			});
		}
	});
};
//This function will bring the user away from the user input section and be presented with a drink construction information page on a random drink with the data obtained from an ajax call
app.getDrinksByRandomListenerEvent = function() {
	$(".feelingLuckyForm").on("submit", function(event) {
		event.preventDefault();
		app.getDrinksByRandom();
	});
};

app.getDrinksByRandom = function() {
	$.ajax({
		url: "https://www.thecocktaildb.com/api/json/v1/1/random.php",
		method: "GET",
		dataType: "json"
	}).then(function(response) {
		$(".ingredientList").empty();
		const drinkInstruction = response.drinks[0].strInstructions;
		const drinkName = response.drinks[0].strDrink;
		const drinkGlass = response.drinks[0].strGlass;
		const drinkUrl = response.drinks[0].strDrinkThumb;
		const { strIngredient1, strIngredient2, idDrink } = response.drinks[0];
		for (i = 0; i <= 15; i++) {
			ingredientType = `strIngredient${i}`;
			ingredientAmount = `strMeasure${i}`;

			if (response.drinks[0][ingredientType]) {
				const coolWhip = `
					<li>
						<p>${response.drinks[0][ingredientType]} ${response.drinks[0][ingredientAmount]}</p>
					</li>
				`;
				$(".ingredientList").append(coolWhip);
			}
		}
		$(".howToMixIt").html(drinkInstruction);
		$(".drinkSpotlight .drinkName").html(drinkName);
		$(".drinkSpotlight .glassType").html(drinkGlass);
		$(".drinkSpotlight img").attr("src", `${drinkUrl}`);
		$(".drinkGallery").css("display", "none");
		$(".drinkSpotlight").css("display", "block");
		app.populateRelatedDrinks(strIngredient1, strIngredient2, idDrink);
	});
};
//This function will populate the gallery to the right of the user input section with the data obtained from an ajax call
app.populateGallery = function(response) {
	app.switchToGallery();
	
	if (response) {
		let i = 0;
		let countDown = 18;
		modArray = response.drinks.slice(0, 18);
		
		modArray.forEach(function(item) {
			
			i++;
			const drinkTitle = item.strDrink;
			const drinkID = item.idDrink;
			const drinkUrl = item.strDrinkThumb;
			let htmlToAppend;
			if (response.drinks.length < 6) {
				$(".drinkGallery ul").css("align-content", "space-evenly");
			}
			if (response.drinks.length < 3) {
				$(".drinkGallery ul").css("justify-content", "center");
			}
			if (response.drinks.length < 18 && response.drinks.length % 3 != 0) {
				$(".drinkGallery ul").css({
					"align-content": "flex-start",
					"justify-content": "flex-start"
				});

				htmlToAppend = `
				<li data-id="${drinkID}" class="drinkGalleryItem appearJS wide" tabindex="0">
				<h3>${drinkTitle}</h3>
				<img src="${drinkUrl}" alt="${drinkTitle}" />
				</li>
				`;
				
			} else {
				$(".drinkGallery ul").css({
					"align-content": "flex-start",
					"justify-content": "flex-start"
				});

				htmlToAppend = `
			<li data-id="${drinkID}" class="drinkGalleryItem appearJS" tabindex="0">
			<h3>${drinkTitle}</h3>
			<img src="${drinkUrl}" alt="${drinkTitle}" />
			</li>
			`;
			
			}

			setTimeout(function() {
				$(".drinkGallery ul").append(htmlToAppend);
				countDown -= 1;
			}, 200 + i);
			i += 200;
		});
	}
};

app.switchToGallery = function() {
	$(".drinkGallery ul").empty();
	$(".drinkGallery").css("opacity", "1");
	$(".drinkGallery ul").css("opacity", "0");
	$(".drinkSpotlight").css("opacity", "0");
	setTimeout(function() {
		$(".drinkGallery").css("display", "block");
		$(".drinkSpotlight").css("display", "none");
		$(".drinkGallery ul").css("opacity", "1");
	}, 400);
};

//This function will bring the user away from the user input section and be presented with a drink construction information page on the drink of their choice with the data obtained from an ajax call
app.populateSpotlight = function() {
	$(".drinkGallery ul, .relatedDrinks ul	").on("click", "li", function() {
		$(".ingredientList").empty();
		app.switchToSpotlight();
		const spotlightID = $(this).data("id");
		$.ajax({
			url: "https://www.thecocktaildb.com/api/json/v1/1/lookup.php",
			method: "GET",
			dataType: "json",
			data: {
				i: spotlightID
			}
		}).then(function(response) {
			const drinkInstruction = response.drinks[0].strInstructions;
			const drinkName = response.drinks[0].strDrink;
			const drinkGlass = response.drinks[0].strGlass;
			const drinkUrl = response.drinks[0].strDrinkThumb;
			const { strIngredient1, strIngredient2 } = response.drinks[0];
			for (i = 0; i <= 15; i++) {
				ingredientType = `strIngredient${i}`;
				ingredientAmount = `strMeasure${i}`;

				// if there's an ingredient
				if (response.drinks[0][ingredientType]) {
					// set string to a variable
					let ingredientItem = `${response.drinks[0][ingredientType]} ${response.drinks[0][ingredientAmount]}`;

					// if there isn't a measurement amount for an ingredient, prevent it from writing 'null' in the string
					ingredientItem = ingredientItem.replace("null", "");

					const htmlToAppend = `
						<li>
							<p>${ingredientItem}</p>
						</li>
					`;
					$(".ingredientList").append(htmlToAppend);
				}
			}

			$(".howToMixIt").html(drinkInstruction);
			$(".drinkSpotlight .drinkName").text(drinkName);
			$(".drinkSpotlight .glassType").text(drinkGlass);
			$(".drinkSpotlight img")
				.attr("src", `${drinkUrl}`)
				.attr("alt", drinkName);

			app.populateRelatedDrinks(strIngredient1, strIngredient2, spotlightID);
		});
	});
};

app.switchToSpotlight = function() {
	$(".drinkGallery").css("opacity", "0");
	$(".drinkSpotlight").css("opacity", "1");
	$(
		".drinkSpotlight h2, .imgContainer, .ingredientParent, .instructionParent"
	).css("opacity", "0");
	setTimeout(function() {
		$(".drinkGallery").css("display", "none");
		$(".drinkSpotlight").css("display", "block");
		$(
			".drinkSpotlight h2, .imgContainer, .ingredientParent, .instructionParent"
		).css("opacity", "1");
	}, 400);
};

// give user a list of related drinks based on the first two ingredients
app.populateRelatedDrinks = function(ingredient1, ingredient2, originalID) {
	$(".relatedDrinks ul").empty();
	// create first ingredient response
	const $call1 = $.ajax({
		url: "https://www.thecocktaildb.com/api/json/v1/1/filter.php",
		method: "GET",
		dataType: "json",
		data: {
			i: ingredient1
		}
	});
	// create second ingredient response
	const $call2 = $.ajax({
		url: "https://www.thecocktaildb.com/api/json/v1/1/filter.php",
		method: "GET",
		dataType: "json",
		data: {
			i: ingredient2
		}
	});

	$.when($call1, $call2).done(function(drinksArray1, drinksArray2) {
		// initializing these for comparison logic later
		// const finalArray = [];
		let finalArray;
		let longerArray;
		let shorterArray;
		// need to find out which is longer
		const concatArray = [...drinksArray1[0].drinks, ...drinksArray2[0].drinks];
		const filteredArray = concatArray.filter(item => {
			if (item.idDrink != originalID) {
				
				return item;
			}
			
		});
		// checking to only return unique values
		finalArray = filteredArray.filter((item, index) => {
			return filteredArray.indexOf(item) == index;
		});

		// append these drinks to the related drinks ul
		for (let i = 0; i < 4; i++) {
			let randomNumber = Math.floor(Math.random() * finalArray.length);
			const { idDrink, strDrink, strDrinkThumb } = finalArray[randomNumber];
			htmlToAppend = `
				<li data-id="${idDrink}" class="appearJS" tabindex="0">
				<h3>${strDrink}</h3>
				<img src="${strDrinkThumb}" alt="${strDrink}" />
				</li>
				`;

			finalArray.splice(randomNumber, 1);
			$(".relatedDrinks ul").append(htmlToAppend);
		}
	});
};
