app = {};

app.init = function() {
	app.smoothScrollFromHeader();
	app.getDrinksByName();
	app.getDrinksByAlcohol();
	app.getDrinksByIngredient();
	app.populateSpotlight();
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
//Function to give the user a selection of drinks based on their search parameter displayed to the right of the userinput
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
//Function to give the user a selection of drinks based on their search parameter displayed to the right of the userinput
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
//Function to give the user a selection of drinks based on their search parameter displayed to the right of the userinput. If the user gives 2 inputs, the selection given will only be drinks that contain both ingredients.
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
							console.log(finalArray);
							finalArray.drinks.push(itemFromArray1);
						}
					});
				});

				app.populateGallery(finalArray);
			});
		}
	});
};
//This function will bring the user away from the user input section and be presented with a drink construction information page on a random drink with the data obtained from an ajax call
app.getDrinksByRandom = function() {
	$(".feelingLuckyForm").on("submit", function() {
		$.ajax({
      url: "https://www.thecocktaildb.com/api/json/v1/1/random.php",
      method: "GET",
      dataType: "json",
    }).then(function(response) {
      $(".ingredientList").empty();
      const drinkInstruction = response.drinks[0].strInstructions;
      const drinkName = response.drinks[0].strDrink;
			const drinkGlass = response.drinks[0].strGlass;
			const drinkUrl = response.drinks[0].strDrinkThumb;
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
      $(".drinkSpotlight .drinkMain img").attr("src", `${drinkUrl}`);
    });
	})
}
//This function will populate the gallery to the right of the user input section with the data obtained from an ajax call
app.populateGallery = function(response) {
	$(".drinkGallery ul").empty();
	if (response) {
		let i = 0;
		let countDown = 9;
		modArray = response.drinks.slice(0, 9);
		modArray.forEach(function(item) {
			i++;
			const drinkTitle = item.strDrink;
			const drinkID = item.idDrink;
			const drinkUrl = item.strDrinkThumb;
			const htmlToAppend = `
			<li data-id="${drinkID}" class="drinkGalleryItem appearJS" tabindex="0">
			<h3>${drinkTitle}</h3>
			<img src="${drinkUrl}" alt="${drinkTitle}" />
			</li>
			`;

			const appending = setTimeout(function() {
				$(".drinkGallery ul").append(htmlToAppend);
				countDown -= 1;
			}, 200 + i);
			i += 200;
		});
	}
};
//This function will bring the user away from the user input section and be presented with a drink construction information page on the drink of their choice with the data obtained from an ajax call
app.populateSpotlight = function() {
	$(".drinkGallery ul").on("click", "li", function() {
		$(".ingredientList").empty();
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
			for (i = 0; i <= 15; i++) {
				ingredientType = `strIngredient${i}`;
				ingredientAmount = `strMeasure${i}`;

				if (response.drinks[0][ingredientType]) {
					const htmlToAppend = `
						<li>
							<p>${response.drinks[0][ingredientType]} ${response.drinks[0][ingredientAmount]}</p>
						</li>
					`;
					$(".ingredientList").append(htmlToAppend);
				}
			}
			$(".howToMixIt").html(drinkInstruction);
			$(".drinkSpotlight .drinkName").html(drinkName);
			$(".drinkSpotlight .glassType").html(drinkGlass);
			$(".drinkSpotlight .drinkMain img").attr("src", `${drinkUrl}`);
		});
	});
};
