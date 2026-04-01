// Importeer het npm package Express (uit de door npm aangemaakte node_modules map)
// Deze package is geïnstalleerd via `npm install`, en staat als 'dependency' in package.json
import express from 'express'

// Importeer de Liquid package (ook als dependency via npm geïnstalleerd)
import { Liquid } from 'liquidjs'

// Maak een nieuwe Express applicatie aan, waarin we de server configureren
const app = express()

// Form-data uitlezen (POST)
app.use(express.urlencoded({ extended: true }))

// Gebruik de map 'public' voor statische bestanden (resources zoals CSS, JavaScript, afbeeldingen en fonts)
app.use(express.static('public'))

// Stel Liquid in als 'view engine'
const engine = new Liquid()
app.engine('liquid', engine.express())

// Stel de map met Liquid templates in
app.set('views', './views')

/**
 * INDEX – algemene stories (district: algemeen)
 * ondersteunt: ?search=... & ?sort=nieuw|oud
 */
app.get('/', async function (request, response) {
  const params = {
    'filter[district]': 'algemeen',
    'fields': 'title, target_group, slug, district, intro, date, cover.*'
  }

  // Sorteren op datum
  if (request.query.sort === 'nieuw') {
    params['sort'] = '-date' // nieuw → oud
  } else if (request.query.sort === 'oud') {
    params['sort'] = 'date'  // oud → nieuw
  }

  // Zoeken op titel
  if (request.query.search && request.query.search.trim() !== '') {
    params['filter[title][_icontains]'] = request.query.search.trim()
  }

  const apiURL =
    'https://fdnd-agency.directus.app/items/buurtcampuskrant_stories?' +
    new URLSearchParams(params)

  const apiResponse = await fetch(apiURL)
  const apiResponseJSON = await apiResponse.json()

  response.render('index.liquid', {
    stories: apiResponseJSON.data,
    search: request.query.search || '',
    currentSort: request.query.sort || ''
  })
})

/**
 * DISTRICT – lijstpagina per district
 * ondersteunt: ?search=... & ?sort=nieuw|oud & ?filter=...
 */
app.get('/:district', async function (request, response) {
  const district = request.params.district || 'algemeen'

  const params = {
    'fields': 'title, target_group, slug, district, intro, date, cover.*'
  }

  // Zoekterm: globale search op titel, anders filter op district
  if (request.query.search && request.query.search.trim() !== '') {
    params['filter[title][_icontains]'] = request.query.search.trim()
  } else {
    params['filter[district]'] = district
  }

  // Filter op category
  if (request.query.filter && request.query.filter !== '') {
    params['filter[category][_eq]'] = request.query.filter
  }

  // Sorteren op datum
  if (request.query.sort === 'nieuw') {
    params['sort'] = '-date'
  } else if (request.query.sort === 'oud') {
    params['sort'] = 'date'
  }

  const apiURL =
    'https://fdnd-agency.directus.app/items/buurtcampuskrant_stories?' +
    new URLSearchParams(params)

  const apiResponse = await fetch(apiURL)
  const apiResponseJSON = await apiResponse.json()

  response.render('district.liquid', {
    stories: apiResponseJSON.data,
    district,
    search: request.query.search || '',
    currentSort: request.query.sort || '',
    currentFilter: request.query.filter || ''
  })
})

/**
 * ARTIKEL – enkel artikel binnen een district
 * URL: /:district/:slug
 */
app.get('/:district/:slug', async function (request, response) {
  const district = request.params.district
  const slug = request.params.slug

  const params = {
    'filter[slug][_eq]': slug,
    'fields':
      'title, body, target_group, id, slug, district, intro, date, cover.*, comments.*'
  }

  const apiURL =
    'https://fdnd-agency.directus.app/items/buurtcampuskrant_stories?' +
    new URLSearchParams(params)

  const apiResponse = await fetch(apiURL)
  const apiResponseJSON = await apiResponse.json()
  const story = apiResponseJSON.data[0]

  if (!story) {
    return response.status(404).render('error.liquid')
  }

  response.render('article.liquid', {
    story,
    district: story.district || district
  })
})

/**
 * COMMENT POST – reactie plaatsen op artikel
 */
app.post('/:district/:slug/comment', async function (request, response) {
  const res = await fetch(
    'https://fdnd-agency.directus.app/items/buurtcampuskrant_stories_comments',
    {
      method: 'POST',
      body: JSON.stringify({
        name: request.body.name,
        comment: request.body.comment,
        story: Number(request.body.story)
      }),
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    }
  )

  // Optioneel: result checken
  // const data = await res.json()
  // console.log(data)

  response.redirect(303, `/${request.params.district}/${request.params.slug}/`)
})

/**
 * 404 – altijd als laatste
 */
app.use((req, res) => {
  res.status(404).render('error.liquid')
})

// Stel het poortnummer in waar Express op moet gaan luisteren
app.set('port', process.env.PORT || 8000)

// Start Express
app.listen(app.get('port'), function () {
  console.log(
    `App draait op http://localhost:${app.get('port')}/\nThe Web is for Everyone.`
  )
})