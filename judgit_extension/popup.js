
// chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
//     let tab = tabs[0]
//     document.getElementById('url').innerText = tab.url
// })

let currentTab = new Promise((resolve, reject) => chrome.tabs.query({ active: true, currentWindow: true }, resolve))
const urlProm = currentTab.then(tabs => {
    console.log(tabs[0]);
    tabs[0].title
    document.querySelector('#title').innerText = tabs[0].title
    document.getElementById('url').innerText = tabs[0].url
    return  tabs[0].url;
})



fapi = NewFapi('http://localhost:3000')
let linkIdProm = urlProm.then(url=> fapi('votes/getLinkId',jsonPostBody({url,url}))) 

let app = new Vue({
    el: '#view-root',
    data: {
        color: 'yellow',
        colorVotes: [
            {
                color: 'green',
                text: 'spawn',
                text_id:2,
                nbr: 285,
                is_upvoted_by_current_user: 0
            },
            {
                color: 'red',
                text: 'you 50ct',
                text_id:4,
                nbr: 285,
                is_upvoted_by_current_user: 1
            }
        ]
    },
    methods: {
        switchColor: function (event) {
            this.color = event.target.dataset.color
        },
        sendVote: async function (event) {
            let text = event.target.innerText
            await fapi('vote/CreateOrUpVote')
        },
        upVote: async function (event) {
            let textId = event.target.dataset['text-id']
            let linkId = await linkIdProm
        }
    }
})


function NewFapi(domain) {
    return function () {
        arguments[0] = domain + arguments[0]
        return fetch(...arguments)
    }
}
function jsonPostBody(jsonBody) {
    return {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonBody)
      }
}