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
    const [destinationInfo, weatherInfo, airportInfo] = await Promise.all([
      getDestination,
      getWeather,
      getAirport,
    ]);

    // // controllo presenza risultati
    if (!destinationInfo.length) {
      throw new Error("La città non esiste o non è presente in elenco");
    }

    if (!weatherInfo.length) {
      let weatherInfo = null;
    }

    // raccolta dati
    // Bonus 1
    //  se l'array è vuoto i risultati saranno null
    const query = {
      city: destinationInfo.length > 0 ? destinationInfo[0]?.name : null,
      country: destinationInfo.length > 0 ? destinationInfo[0]?.country : null,
      temperature: weatherInfo.length > 0 ? weatherInfo[0]?.temperature : null,
      weather:
        weatherInfo.length > 0 ? weatherInfo[0]?.weather_description : null,
      airport: airportInfo.length > 0 ? airportInfo[0]?.name : null,
    };
    return query;
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
