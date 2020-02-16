app = {};

app.init = function() {
  app.getDrinksByName();
  app.getDrinksByAlcohol();
  app.getDrinksByIngredient();
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
      app.populateGallery(response);
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
      app.populateGallery(respone);
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
      const finalArray = {drinks:[]};
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
    response.drinks.forEach(function(item) {
      const drinkTitle = item.strDrink;
      const drinkID = item.idDrink;
      const drinkUrl = item.strDrinkThumb;
      const htmlToAppend = `
				<li class="drinkGalleryItem">
					<h3 data-id="${drinkID}">${drinkTitle}</h3>
					<img src="${drinkUrl}" alt="${drinkTitle}" />
				</li>
			`;
      $(".drinkGallery ul").append(htmlToAppend);
    });
  }
};

app.populateSpotlight = function(spotlightID) {
  $.ajax({
    url: "https://www.thecocktaildb.com/api/json/v1/1/lookup.php",
    method: "GET",
    dataType: "json",
    data: {
      i: spotlightID
    }
  }).then(function(response) {
    console.log(response);
  });
};
