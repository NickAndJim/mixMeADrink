

app = {};

app.init = function() {
  app.getDrinksByName();
  app.getDrinksByAlcohol();
}

$(function() {
  app.init();
})

app.userDrinksInput = "";
app.userAlcoholInput = "";
app.userIngredientInput1 = "";
app.userIngredientInput2 = "";

app.getDrinksByName = function() {
  $("form#drinksByName").on("submit", function() {
    app.userDrinksInput = $("#drinksByName input").val();
    $.ajax({
      url: "https://www.thecocktaildb.com/api/json/v1/1/search.php",
      method: "GET",
      dataType : "json",
      data: {
        s: app.userDrinksInput,
      }
    }).then(function(response) {
      console.log(response)
    })
  })
}

app.getDrinksByAlcohol = function () {
  $("form#drinksByAlcohol").on("submit", function () {
    app.userAlcoholInput = $("#drinksByAlcohol input").val();
    $.ajax({
      url: "https://www.thecocktaildb.com/api/json/v1/1/filter.php",
      method: "GET",
      dataType: "json",
      data: {
        i: app.userAlcoholInput,
      }
    }).then(function (response) {
      console.log(response)
    })
  })
}

app.getDrinksByIngredient = function() {
  $("form#drinksByIngredient").on("submit", function () {
    app.userIngredientInput1 = $("#drinksByIngredient input ingredient1").val();
    app.userIngredientInput2 = $("#drinksByIngredient input ingredient2").val();
    $.ajax({
      url: "https://www.thecocktaildb.com/api/json/v1/1/filter.php",
      method: "GET",
      dataType: "json",
      data: {
        i: app.userIngredientInput1,
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




