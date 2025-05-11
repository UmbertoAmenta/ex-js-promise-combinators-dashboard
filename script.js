// Nota: a differenza di quanto visto finora negli esempi, per accedere all'API utilizzare utilizzare l'url base:
//      https://boolean-spec-frontend.vercel.app/freetestapi
//      al posto di:
//      https://freetestapi.com/api/v1
// Ad esempio:
// https://boolean-spec-frontend.vercel.app/freetestapi/users
// per chiamare l'endpoint /users

// In questo esercizio, utilizzerai Promise.all() per creare la funzione getDashboardData(query), che accetta una città come input e recupera simultaneamente:
//      Nome completo della città e paese da  /destinations?search=[query]
//          (result.name, result.country, nelle nuove proprietà city e country).
//      Il meteo attuale da /weathers?search={query}
//          (result.temperature e result.weather_description nella nuove proprietà temperature e weather).
//      Il nome dell’aeroporto principale da /airports?search={query}
//          (result.name nella nuova proprietà airport).
//  Utilizzerai Promise.all() per eseguire queste richieste in parallelo e poi restituirai un oggetto con i dati aggregati.
//      Attenzione: le chiamate sono delle ricerche e ritornano un’array ciascuna, di cui devi prendere il primo risultato (il primo elemento).

// Note del docente
//  Scrivi la funzione getDashboardData(query), che deve:
//  Essere asincrona (async).
//  Utilizzare Promise.all() per eseguire più richieste in parallelo.
//  Restituire una Promise che risolve un oggetto contenente i dati aggregati.
//  Stampare i dati in console in un messaggio ben formattato.
//  Testa la funzione con la query "london"

// 🎯 Bonus 1 - Risultato vuoto
// Se l’array di ricerca è vuoto, invece di far fallire l'intera funzione, semplicemente i dati relativi a quella chiamata verranno settati a null e la frase relativa non viene stampata. Testa la funzione con la query “vienna” (non trova il meteo).

// 🎯 Bonus 2 - Chiamate fallite
// Attualmente, se una delle chiamate fallisce, **Promise.all()** rigetta l'intera operazione.
//  Modifica `getDashboardData()` per usare **Promise.allSettled()**, in modo che:
//      Se una chiamata fallisce, i dati relativi a quella chiamata verranno settati a null.
//      Stampa in console un messaggio di errore per ogni richiesta fallita.
//      Testa la funzione con un link fittizio per il meteo (es. https://www.meteofittizio.it).

async function getDashboardData(city) {
  try {
    // raccolta info - città
    const getDestination = fetch(
      `http://localhost:5000/destinations?search=${city}`
    ).then((res) => res.json());

    // raccolta info - meteo
    const getWeather = fetch(
      `http://localhost:5000/weathers?search=${city}`
    ).then((res) => res.json());

    // raccolta info - aereoporto
    const getAirport = fetch(
      `http://localhost:5000/airports?search=${city}`
    ).then((res) => res.json());

    // esecuzione Promises
    // Bonus 2
    //  esecuzione con promiseAllSettled
    const [destinationInfo, weatherInfo, airportInfo] =
      await Promise.allSettled([getDestination, getWeather, getAirport]);

    // // controllo presenza risultati
    if (!destinationInfo.value.length) {
      throw new Error("La città non esiste o non è presente in elenco");
    }

    // con l'aggiunta della promiseAllSettled non recupero più array (bonus 2)
    // if (!weatherInfo.value.length) {
    //   let weatherInfo = null;
    // }

    // if (!airportInfo.value.length) {
    //   let airportInfo = null;
    // }

    // Bonus 2
    //  controllo status promises
    const destinationInfoSettled =
      destinationInfo.status === "fulfilled" ? destinationInfo.value : null;

    const weatherInfoSettled =
      weatherInfo.status === "fulfilled" ? weatherInfo.value : null;

    const airportInfoSettled =
      airportInfo.status === "fulfilled" ? airportInfo.value : null;

    // Bonus 2
    //  gestione errore per le chiamate fallite
    if (destinationInfo.status === "rejected") {
      console.error("Errore nel recupero dati località");
    }
    if (weatherInfo.status === "rejected") {
      console.error("Errore nel recupero dati meteo");
    }
    if (airportInfo.status === "rejected") {
      console.error("Errore nel recupero dati aeroporto in prossimità");
    }

    // raccolta dati
    // Bonus 1
    //  se l'array è vuoto i risultati saranno null (bonus 2: non più necessario in quanto non arriva più sotto forma di array)
    const query = {
      city: destinationInfoSettled[0]?.name || null,
      country: destinationInfoSettled[0]?.country || null,
      temperature: weatherInfoSettled[0]?.temperature || null,
      weather: weatherInfoSettled[0]?.weather_description || null,
      airport: airportInfoSettled[0]?.name || null,
    };

    // controllo stato promises (bonus 2)
    console.log("Destination Info:", destinationInfo);
    console.log("Weather Info:", weatherInfo);
    console.log("Airport Info:", airportInfo);

    if (destinationInfo) return query;
  } catch (error) {
    console.error("Errore:", error);
    throw error;
  }
}

// Bonus 1
//  se una chiamata (esclusa quella relativa alla città: se non è presente nessuno dei suoi dati ha motivo di esistere) fallisce
//      fallisce le informazioni contenute (null) non vengono mostrate
getDashboardData("vienna").then((result) => {
  console.log(result);
  console.log(`${result.city} is in ${result.country}.`);
  if (result.temperature && result.weather) {
    console.log(
      `Today there are ${result.temperature} degrees and the weather is ${result.weather}.`
    );
  }
  if (result.airport) {
    console.log(`The main airport is ${result.airport}.`);
  }
});
