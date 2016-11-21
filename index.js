import Nightmare from 'nightmare'
import jsonfile from 'jsonfile'
import moment from 'moment'

const nightmare = Nightmare({ show: true })
const file = '/media/deadcoder0904/DEAD/Coding/100dayz/github-trending-json-api/json/' + moment().format('D-MM-YY') + '.json' 

nightmare
  .goto('https://google.com')
  .type('form[action*="/search"] [name=q]', 'github trending')
  .click('form[action*="/search"] [type=submit]')
  .wait('#ires')
  .click('html body#gsr.vasq.srp div#viewport.ctr-p div#main.content div#cnt div.mw div#rcnt div.col div#center_col div#res.med div#search div div#ires div#rso div.g div div.rc h3.r a')
  .evaluate(function () {
		let repos = document.querySelector('ol.repo-list')
		let links = []
		let description = []

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
		
		let details = []
		for (let i = 0; i < links.length; i++)
			details[links[i]] = description[i]
    return {
    	links,
    	description
    }
  })
  .end()
  .then(function (result) {
		jsonfile.writeFile(file, result, function (err) {
		  console.error(err)
		})
  })
  .catch(function (error) {
    console.error('Search failed:', error);
  });