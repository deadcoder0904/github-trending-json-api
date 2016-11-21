import Nightmare from 'nightmare'
import jsonfile from 'jsonfile'
import moment from 'moment'
import path from 'path'

const nightmare = Nightmare()
const file = path.join(__dirname, '..','json/') + moment().format('D-MM-YY') + '.json' 

const map_to_object = map => {
  const out = Object.create(null)
  map.forEach((value, key) => {
    if (value instanceof Map) {
      out[key] = map_to_object(value)
    }
    else {
      out[key] = value
    }
  })
  return out
}

nightmare
  .goto('https://google.com')
  .type('form[action*="/search"] [name=q]', 'github trending')
  .click('form[action*="/search"] [type=submit]')
  .wait('#ires')
  .click('html body#gsr.vasq.srp div#viewport.ctr-p div#main.content div#cnt div.mw div#rcnt div.col div#center_col div#res.med div#search div div#ires div#rso div.g div div.rc h3.r a')
  .evaluate(function () {
		var repos = document.querySelector('ol.repo-list')
		var links = []
		var description = []

		repos.querySelectorAll('li>div>h3>a')
					.forEach(function(a) { 
										links.push(a.href) 
									})

		repos.querySelectorAll('li>div.py-1')
					.forEach(function(a) {
										if(a.childNodes.length != 3)
											description.push("")
										else description.push(a.childNodes[1].innerText)
									})
		
    return {
			links,
			description
    }
  })
  .end()
  .then(function (result) {
		var details = []
		var m = null
		
		for (var i = 0; i < result.links.length; i++) {
			m = new Map() 
			m.set(result.links[i],result.description[i]);
			details.push(m)
		}

		jsonfile.writeFile(file, map_to_object(details), function (err) {
		  console.error(err)
		})
  })
  .catch(function (error) {
    console.error('Search failed:', error)
  })
