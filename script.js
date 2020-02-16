app = {};

app.init = function() {
  app.getDrinksByName();
  app.getDrinksByAlcohol();
	app.getDrinksByIngredient();
	app.populateSpotlight();

  $("header").on("click", function() {
    $("html,body").animate(
      {
        scrollTop: $("main").offset().top
      },
      "slow"
    );
  });
};

$(function() {
  app.init();
});

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
      app.populateGallery(response);
    });
  });
};

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
        differentArray = drinksArray1[0].drinks.filter(function(itemFromArray1) {
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



app.populateSpotlight = function() {
	$("ul").on("click", "li", function() {
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
			for (i = 0; i <= 15; i++ ) {
				ingredientType = `strIngredient${i}`
				ingredientAmount = `strMeasure${i}`

				
				if (response.drinks[0][ingredientType]) {
					const coolWhip = `
						<li>
							<p>${response.drinks[0][ingredientType]} ${response.drinks[0][ingredientAmount]} a word</p>
						</li>
					`;
					$(".ingredientList").append(coolWhip);
					
				}
			}
		});

	})
};
