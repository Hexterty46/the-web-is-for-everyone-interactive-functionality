// Importeer het npm package Express (uit de door npm aangemaakte node_modules map)
// Deze package is geïnstalleerd via `npm install`, en staat als 'dependency' in package.json
import express from 'express'

// Importeer de Liquid package (ook als dependency via npm geïnstalleerd)
import { Liquid } from 'liquidjs';

// Maak een nieuwe Express applicatie aan, waarin we de server configureren
const app = express()

// Maak werken met data uit formulieren iets prettiger
app.use(express.urlencoded({extended: true}))

// Gebruik de map 'public' voor statische bestanden (resources zoals CSS, JavaScript, afbeeldingen en fonts)
// Bestanden in deze map kunnen dus door de browser gebruikt worden
app.use(express.static('public'))

// Stel Liquid in als 'view engine'
const engine = new Liquid()
app.engine('liquid', engine.express())

// Stel de map met Liquid templates in
// Let op: de browser kan deze bestanden niet rechtstreeks laden (zoals voorheen met HTML bestanden)
app.set('views', './views')


console.log('Let op: Er zijn nog geen routes. Voeg hier dus eerst jouw GET en POST routes toe.')

/*
// Zie https://expressjs.com/en/5x/api.html#app.get.method over app.get()
app.get(…, async function (request, response) {
  
  // Zie https://expressjs.com/en/5x/api.html#res.render over response.render()
  response.render(…)
})
*/

/*
// Zie https://expressjs.com/en/5x/api.html#app.post.method over app.post()
app.post(…, async function (request, response) {

  // In request.body zitten alle formuliervelden die een `name` attribuut hebben in je HTML
  console.log(request.body)

  // Via een fetch() naar Directus vullen we nieuwe gegevens in

  // Zie https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch over fetch()
  // Zie https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify over JSON.stringify()
  // Zie https://docs.directus.io/reference/items.html#create-an-item over het toevoegen van gegevens in Directus
  // Zie https://docs.directus.io/reference/items.html#update-an-item over het veranderen van gegevens in Directus
  const fetchResponse = await fetch(…, {
    method: …,
    body: JSON.stringify(…),
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })

  // Als de POST niet gelukt is, kun je de response loggen. Sowieso een goede debugging strategie.
  // console.log(fetchResponse)

  // Eventueel kun je de JSON van die response nog debuggen
  // const fetchResponseJSON = await fetchResponse.json()
  // console.log(fetchResponseJSON)

  // Redirect de gebruiker daarna naar een logische volgende stap
  // Zie https://expressjs.com/en/5x/api.html#res.redirect over response.redirect()
  response.redirect(303, …)
})
*/

app.get('/', async function (request, response) {
   // Render index.liquid uit de Views map
   // Geef hier eventueel data aan mee
   const params = {
    'filter[district]': 'algemeen',
    'fields': 'title, slug, district, intro, date, cover.*'
  }

  if (request.query.sort === "nieuw") {
    params['sort'] = '-date'
  } else if (request.query.sort === "oud") {
    params['sort'] = 'date'
  }

   if (request.query.search && request.query.search.trim() !== "") {
      params['filter[title][_icontains]'] = request.query.search
   }

  const apiURL = 'https://fdnd-agency.directus.app/items/buurtcampuskrant_stories?' + new URLSearchParams(params)
  // console.log(apiURL)

  const apiResponse = await fetch(apiURL)
  const apiResponseJSON = await apiResponse.json()
  console.log(apiResponseJSON.data)

   response.render('index.liquid', {
      stories : apiResponseJSON.data,
      search: request.query.search || ""    
    })
})

app.get('/:district', async function (request, response) {

  const district = request.params.district || "algemeen"
  console.log(district)
  const params = {
    'fields': 'title, slug, district, intro, date, cover.*'
  }

  // Dit zou er eigenlijk moeten zorgen dat, als er geen zoekterm is dat ik dan de artikelen zie van de huidige district, en als er wel een zoekterm is dat er wereldwijd word gezogd. MAAR HET WERKT NOG NIET IK WEET OOK NOG NIET WAAROM
  // Trim is er voor om alle witruimte te verwijderen aan het begin en einde van de string
  if (!request.query.search || request.query.search.trim() === "") {
    params['filter[district]'] = district;
  } else {
    params['filter[title][_icontains]'] = request.query.search;
  }

  // Word gebruikt voor het filteren op datum
  if (request.query.sort === "nieuw") {
    params['sort'] = '-date'
  } else if (request.query.sort === "oud") {
    params['sort'] = 'date'
  }

  const apiURL = 'https://fdnd-agency.directus.app/items/buurtcampuskrant_stories?' + new URLSearchParams(params)

  const apiResponse = await fetch(apiURL)
  const apiResponseJSON = await apiResponse.json()

  response.render('district.liquid', {
    stories: apiResponseJSON.data,
    district: district,
    search: request.query.search || ""  
  })

})

app.get('/:district/:slug', async function (request, response) {
  const district = request.params.district
  const slug = request.params.slug

  const params = {
    'filter[slug][_eq]': slug,
    'fields': 'title, id, slug, district, intro, date, cover.*, comments.*'   
  }

  const apiURL = 'https://fdnd-agency.directus.app/items/buurtcampuskrant_stories?' + new URLSearchParams(params)

  const apiResponse = await fetch(apiURL)
  const apiResponseJSON = await apiResponse.json()

  const story = apiResponseJSON.data[0]

  response.render('article.liquid', {
    story: story,
    district: district
  })
})

app.get('/:slug', async function (request, response) {
  const slug = request.params.slug

  const params = {
    'filter[slug][_eq]': slug,
    'fields': 'title, district, intro, date, cover.*'
  }

  const apiURL = 'https://fdnd-agency.directus.app/items/buurtcampuskrant_stories?' + new URLSearchParams(params)

  const apiResponse = await fetch(apiURL)
  const apiResponseJSON = await apiResponse.json()

  const story = apiResponseJSON.data[0]

  response.render('article.liquid', {
    story: story,
    district: story.district
  })
})

app.use(express.urlencoded({ extended: true }))

app.post('/:district/:slug/comment', async function (request, response) {

  const res = await fetch('https://fdnd-agency.directus.app/items/buurtcampuskrant_stories_comments', {
    method: 'POST',
    body: JSON.stringify({
      name: request.body.name,
      comment: request.body.comment,
      story: Number(request.body.story)
    }),
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })

  const data = await res.json()
  console.log(data)
  console.log(request.params)

  response.redirect(303, `/${request.params.district}/${request.params.slug}/`)
})

// app.get('/nieuw-west', async function (request, response) {
//    // Render index.liquid uit de Views map
//    // Geef hier eventueel data aan mee
//    const params = {
//     'filter[district]': 'nieuw-west',
//     'fields': 'title, district, intro, date, cover.id'
//   }

//   const apiURL = 'https://fdnd-agency.directus.app/items/buurtcampuskrant_stories?' + new URLSearchParams(params)
//   // console.log(apiURL)

//   const apiResponse = await fetch(apiURL)
//   const apiResponseJSON = await apiResponse.json()
//   // console.log(apiResponseJSON.data)
//    response.render('district.liquid', {stories : apiResponseJSON.data})
// })

// app.get('/oost', async function (request, response) {
//    // Render index.liquid uit de Views map
//    // Geef hier eventueel data aan mee
//    const params = {
//     'filter[district]': 'oost',
//     'fields': 'title, district, intro, date, cover.id'
//   }

//   const apiURL = 'https://fdnd-agency.directus.app/items/buurtcampuskrant_stories?' + new URLSearchParams(params)
//   // console.log(apiURL)

//   const apiResponse = await fetch(apiURL)
//   const apiResponseJSON = await apiResponse.json()
//   // console.log(apiResponseJSON.data)
//    response.render('district.liquid', {stories : apiResponseJSON.data})
// })

// app.get('/zuid-oost', async function (request, response) {
//    // Render index.liquid uit de Views map
//    // Geef hier eventueel data aan mee
//    const params = {
//     'filter[district]': 'zuid-oost',
//     'fields': 'title, intro, date, cover.id'
//   }

//   const apiURL = 'https://fdnd-agency.directus.app/items/buurtcampuskrant_stories?' + new URLSearchParams(params)
//   // console.log(apiURL)

//   const apiResponse = await fetch(apiURL)
//   const apiResponseJSON = await apiResponse.json()
//   // console.log(apiResponseJSON.data)
//    response.render('district.liquid', {stories : apiResponseJSON.data})
// })

// app.get('/algemeen-nieuws-nieuw-oud', async function (request, response) {
//    // Render index.liquid uit de Views map
//    // Geef hier eventueel data aan mee


//    const params = {
//     'filter[district]': "algemeen",
//     'fields': 'title, intro, date, cover.*',
//     'sort': '-date'
//   }

//   const apiURL = 'https://fdnd-agency.directus.app/items/buurtcampuskrant_stories?' + new URLSearchParams(params)
//   // console.log(apiURL)

//   const apiResponse = await fetch(apiURL)
//   const apiResponseJSON = await apiResponse.json()
//   // console.log(personResponseJSON.data)
//    response.render('index.liquid', {
//     stories: apiResponseJSON.data
//   })
// })

// app.get('/algemeen-nieuws-oud-nieuw', async function (request, response) {
//    // Render index.liquid uit de Views map
//    // Geef hier eventueel data aan mee


//    const params = {
//     'filter[district]': "algemeen",
//     'fields': 'title, intro, date, cover.*',
//     'sort': 'date'
//   }

//   const apiURL = 'https://fdnd-agency.directus.app/items/buurtcampuskrant_stories?' + new URLSearchParams(params)
//   // console.log(apiURL)

//   const apiResponse = await fetch(apiURL)
//   const apiResponseJSON = await apiResponse.json()
//   // console.log(personResponseJSON.data)
//    response.render('index.liquid', {
//     stories: apiResponseJSON.data
//   })
// })

// Stel het poortnummer in waar Express op moet gaan luisteren
// Lokaal is dit poort 8000; als deze applicatie ergens gehost wordt, waarschijnlijk poort 80
app.set('port', process.env.PORT || 8000)

// Start Express op, gebruik daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  // Toon een bericht in de console
  console.log(`Daarna kun je via http://localhost:${app.get('port')}/ jouw interactieve website bekijken.\n\nThe Web is for Everyone. Maak mooie dingen 🙂`)
})

app.use((req, res, next) => {
   res.status(404).render("error.liquid")
})