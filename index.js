import Nightmare from 'nightmare'
import jsonfile from 'jsonfile'
import moment from 'moment'
import path from 'path'

const nightmare = Nightmare()
const file = path.join(__dirname, '..','json/') + moment().format('DD-MM-YY') + '.json'
console.log(file)
nightmare
  .goto('https://google.com')
  .type('form[action*="/search"] [name=q]', 'github trending')
  .click('form[action*="/search"] [type=submit]')
  .wait('#ires')
  .click('html body#gsr.vasq.srp div#viewport.ctr-p div#main.content div#cnt div.mw div#rcnt div.col div#center_col div#res.med div#search div div#ires div#rso div.g div div.rc h3.r a')
  .evaluate(function () {
		var repos = document.querySelector('ol.repo-list')
		var url = []
		var description = []

		repos.querySelectorAll('li>div>h3>a')
					.forEach(function(a) {
										url.push(a.href)
									})

		repos.querySelectorAll('li>div.py-1')
					.forEach(function(a) {
										if(a.childNodes.length != 3)
											description.push("Description Not Provided")
										else description.push(a.childNodes[1].innerText)
									})

    return {
			url,
			description
    }
  })
  .end()
  .then(function (result) {
		var details = []

		for (var i = 0; i < result.url.length; i++) {
			var name = result.url[i].substring(result.url[i].lastIndexOf('/')+1);
			var url = result.url[i];
			var description = result.description[i];
			details.push({
				name,
				url,
				description
			});
		}
		console.log(JSON.stringify(details, null, 2));
		jsonfile.writeFile(file, JSON.stringify(details, null, 2), function (err) {
		  console.error(err)
		})
  })
  .catch(function (error) {
    console.error('Search failed:', error)
  })
