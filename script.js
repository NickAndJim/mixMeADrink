

app = {};

app.init = function() {
  app.getDrinksByName();
  app.getDrinksByAlcohol();
}

$(function() {
  app.init();
})

app.getDrinksByName = function() {
  $("form#drinksByName").on("submit", function() {
    const userDrinksInput = $("#drinksByName input").val();
    $.ajax({
      url: "https://www.thecocktaildb.com/api/json/v1/1/search.php",
      method: "GET",
      dataType : "json",
      data: {
        s: userDrinksInput,
      }
    }).then(function(response) {
      console.log(response)
    })
  })
}

app.getDrinksByAlcohol = function () {
  $("form#drinksByAlcohol").on("submit", function () {
    const userAlcoholInput = $("#drinksByAlcohol input").val();
    $.ajax({
      url: "https://www.thecocktaildb.com/api/json/v1/1/filter.php",
      method: "GET",
      dataType: "json",
      data: {
        i: userAlcoholInput,
      }
    }).then(function (response) {
      console.log(response)
    })
  })
}

app.getDrinksByIngredient = function() {
  $("form#drinksByIngredient").on("submit", function () {
    const userIngredientInput1 = $("#drinksByIngredient input ingredient1").val();
    const userIngredientInput2 = $("#drinksByIngredient input ingredient2").val();
    $.ajax({
      url: "https://www.thecocktaildb.com/api/json/v1/1/filter.php",
      method: "GET",
      dataType: "json",
      data: {
        i: userIngredientInput1,
      }
    }).then(function (response) {
      console.log(response)
    })
    
  })
}

app.populateGallery = function(drinkTitle, drinkUrl) {

}

app.populateSpotlight = function(spotlightID) {
  $.ajax({
    url: "https://www.thecocktaildb.com/api/json/v1/1/lookup.php",
    method: "GET",
    dataType: "json",
    data: {
      i: spotlightID
    }
  }).then(function (response) {
    console.log(response)
  })
}




