$(document).ready(function() {
    // Piilottaa uusihaku painikkeen
    $("#uusiHaku").hide()

    function googleTranslateElementInit() {
        // Mahdollistaa nettisivun kielenvaihtamisen
        new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element')     
    }
    function korosta(sana, query) {
        // Korostaa hakusanan haetun elokuvan otsikosta       
        let check = new RegExp(query, "ig")
        return sana.toString().replace(check, function(korostus) {
            return "<u>" + korostus + "</u>"
        })       
    }

    // Haku tietokannasta tapahtuu automaattisesti kun merkkejä on tarpeeksi annetun haku-inputin avulla
    $(".haku-input").keyup(function() {
        googleTranslateElementInit()
        let haku = $(this).val()
        let tulokset = ""
        // Jos hakukenttä on tyhjä mitään ei tapahdu, jos ei niin ohjelma jatkaa toimintaa
        if (haku == "") {
            $("#tulokset").fadeOut(500)
            $("#uusiHaku").hide()
        }
        // Hakee tiedon Omdb:n elokuvatietokannasta henkilökohtaisen api avaimen avulla
        $.getJSON("https://www.omdbapi.com/?", { apikey: "b1b58476", s: haku }, function(data) {
            // Jos tieto löytyy tietokannasta ohjelma jatkaa etenemistään
            if (data.Search !== undefined) {
                // Käy läpi jokaisen oleellisen rivin ja valitsee enintään viisi oleellisinta hakutulosta
                $.each(data.Search, function(index, value) {
                    if (index < 5) {
                        $.getJSON("https://www.omdbapi.com/?", { apikey: "b1b58476", i: value.imdbID }, function(leffaData) {
                            // Hakutuloksista näytetään posteri, elokuvan nimi, imdb arvostelu, mahdolliset kielet, näyttelijät sekä pieni kuvaus elokuvan juonesta
                            if (leffaData) {
                                tulokset += '<div class="tulos">'
                                tulokset += '<div><img class="posteri" src=' + leffaData.Poster + '/></div>'
                                tulokset += '<div class="leffa-title">'+ korosta(leffaData.Title, $(".haku-input").val()) +' ('+ leffaData.Year +')</div>'
                                tulokset += '<div class="rating-div">Rating:'+ leffaData.imdbRating +'</div>'
                                tulokset += '<div>Language: '+ leffaData.Language + '</div>'
                                tulokset += '<div>Director: '+ leffaData.Director + '</div>'
                                tulokset += '<div>Actors: '+ leffaData.Actors + '</div>'
                                tulokset += '<div>'+ leffaData.Plot + '</div>'
                                tulokset += '</div>'
                                $("#tulokset").html(tulokset)
                            }
                        })
                    }
                });
                // Näyttää tulokset
                $("#tulokset").fadeIn(500)
                // Näyttää uusihaku painikkeen
                $("#uusiHaku").show()
            }
        });
    });
    // uusihaku painike, joka tyhjentää hakutuloslistan, haku-inputin tekstin ja piilottaa myös napin sitä painettaessa
    $("#uusiHaku").click(function(e) {
        $("#tulokset").fadeOut(500)
        $(".haku-input").val("")
        $("#uusiHaku").hide()
        });
    });
