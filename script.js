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
    if (!destinationInfo.length || !weatherInfo.length || !airportInfo.length) {
      throw new Error("Uno o più fetch hanno restituito un array vuoto.");
    }
    // raccolta dati
    const query = {
      city: destinationInfo[0]?.name,
      country: destinationInfo[0]?.country,
      temperature: weatherInfo[0]?.temperature,
      weather: weatherInfo[0]?.weather_description,
      airport: airportInfo[0]?.name,
    };
    return query;
  } catch (error) {
    console.error("Errore:", error);
    throw error;
  }
}

getDashboardData("london").then((result) => {
  console.log(result);
  console.log(
    `${result.city} is in ${result.country}. \n` +
      `Today there are ${result.temperature} degrees and the weather is ${result.weather}.\n` +
      `The main airport is ${result.airport}.\n`
  );
});
