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
			console.log(response);
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
			console.log(response);
		});
	});
};

app.getDrinksByIngredient = function() {
	$("form.drinksByIngredientForm").on("submit", function(e) {
        e.preventDefault();
		const userIngredientInput1 = $(
			"#drinksByIngredient1"
		).val();
		const userIngredientInput2 = $(
			"#drinksByIngredient2"
		).val();
		$.ajax({
			url: "https://www.thecocktaildb.com/api/json/v1/1/filter.php",
			method: "GET",
			dataType: "json",
			data: {
				i: userIngredientInput1
			}
		}).then(function(response) {
			console.log(response);
		});
	});
};

app.populateGallery = function(drinkTitle, drinkUrl) {};

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
