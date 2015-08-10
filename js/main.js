var json 	= "json/content.json",
	Filter 	= {},
	country = [{"AC":"Acre","AL":"Alagoas","AP":"Amapá","AM":"Amazonas","BA":"Bahia","CE":"Ceará","DF":"Distrito Federal","ES":"Espírito Santo","GO":"Goiás","MA":"Maranhão","MT":"Mato Grosso","MS":"Mato Grosso do Sul","MG":"Minas Gerais","PA":"Pará","PB":"Paraíba","PR":"Paraná","PE":"Pernambuco","PI":"Piauí","RJ":"Rio de Janeiro","RN":"Rio Grande do Norte","RS":"Rio Grande do Sul","RO":"Rondônia","RR":"Roraima","SC":"Santa Catarina","SP":"São Paulo","SE":"Sergipe","TO":"Tocantins"}];

Filter = {
	collection: "",
	selectContainer: "header",
	selectState: "filter-state",
	selectCity: "filter-city",
	selectMain: "filter-main",
	selectButton: "select-list",

	init : function(){
		this.get();
	},

	selected : function(){
		var disabledCity = $("#" + this.selectCity).find("li")[0] ? true : false;
		
		if (disabledCity == false) {
			$("#" + this.selectCity).addClass('disabled');

			return disabledCity;
		}else {
			$("#" + this.selectCity).removeClass('disabled');
			return disabledCity;
		}
	},

	disabled : function(){
		var list 	= this.collection,
			_this 	= this;

		_.each(list, function(value, key){
			var action = $("#" + _this.selectState + " li[data-state='" + value.estado + "'][data-action='true']").length;
			if(action == 0) {
				$("#" + _this.selectState + " li[data-state='" + value.estado + "']").attr("data-action", true);
			}
			
		});
	},

	get : function(){
		
		var _this = this;

		$.getJSON(json, function(data){
			//console.dir(data);
		}).done(function(data){
			_this.collection = data;
			_this.selected();
			_this.disabled();
			_this.clickState();
			_this.clickCity();
			_this.clickToggle();
			_this.changeText();
		});
	},

	filterAll : function(id){
		var state 		= _.where(this.collection, { estado: id }),
			_this		= this,
			item		= "",
			listCity	= ""; 
		
		_.each(state, function(value, key){
			item  = "<li>";
			item += "<h2>" + value.nome + "</h2>";
			item += "<h3>" + value.endereco + " - " + value.cep + "</h3>";
			item += "<h4>" + value.bairro + "</h4>";
			item += "<h4>" + value.cidade + "</h4>";
			item += "</li>";

			listCity = "<li data-city='" + value.cidade + "'>";
			listCity += value.cidade;
			listCity += "</li>";

			$("#" + _this.selectMain).find('.list').append(item);
			
			if ($("#" + _this.selectCity).find('li[data-city="' + value.cidade + '"]').length == 0) {
				$("#" + _this.selectCity).find('.list').append(listCity);
			}

		});
	},

	filterBy : function(id){
		var city 		= _.where(this.collection, { cidade: id }),
			_this		= this,
			item		= "",
			listCity	= ""; 

		_.each(city, function(value, key){
			item  = "<li>";
			item += "<h2>" + value.nome + "</h2>";
			item += "<h3>" + value.endereco + " - " + value.cep + "</h3>";
			item += "<h4>" + value.bairro + "</h4>";
			item += "<h4>" + value.cidade + "</h4>";
			item += "</li>";

			$("#" + _this.selectMain).find('.list').append(item);

		});

	},

	clickState : function(){
		var _this = this;
		$(document).on("click", "#" + this.selectState + " li", function(){
			$("#" + _this.selectMain).find(".list").empty();
			$("#" + _this.selectCity).find('.list').empty();	
			var id = $(this).attr("data-state");
			_this.filterAll(id);
			_this.selected();
		});
	},

	clickCity : function(){
		var _this = this;
		$(document).on("click", "#" + this.selectCity + " li", function(){
			$("#" + _this.selectMain).find(".list").empty();
			var id = $(this).attr("data-city");
			_this.filterBy(id);			
		});	
	},

	clickToggle : function(){
		var _this = this;
		$(document).on('click', '.' + this.selectButton, function(){
			if ($(this).hasClass('disabled') != true) {
				$(this).find('.list').toggle();
			}
		});
	},

	changeText : function(){
		var _this = this;

		$(document).on('click', '.' + this.selectButton + ' li', function(){
			$(this).parent().siblings('span').empty();
			
			if($(this).parent().parent()[0].id == _this.selectState){
				var attr = $(this).text();
				$(this).parent().siblings('span').text(attr);
				$("#" + _this.selectCity).find("span")

				if ($("#" + _this.selectCity).find("span").text() != "Selecione uma cidade") {
					$("#" + _this.selectCity).find("span").empty().text("Selecione uma cidade");
				}
			}else {
				var attr = $(this).attr("data-city");
				$(this).parent().siblings('span').text(attr);
			}
		});
	}

};

(function($){
	Filter.init();
})(jQuery);