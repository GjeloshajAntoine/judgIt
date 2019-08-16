
// chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
//     let tab = tabs[0]
//     document.getElementById('url').innerText = tab.url
// })

let currentTab = new Promise((resolve, reject) => chrome.tabs.query({ active: true, currentWindow: true }, resolve))
currentTab.then(tabs => {
    console.log(tabs[0]);
    tabs[0].title
    document.querySelector('#title').innerText = tabs[0].title
    document.getElementById('url').innerText = tabs[0].url
})

function NewFapi(domain) {
    return function () {
        arguments[0] = domain + arguments[0]
        return fetch(...arguments)
    }
}

fapi = NewFapi('http://localhost:3000')

let app = new Vue({
    el: '#view-root',
    data: {
        color: 'yellow',
        colorVotes: [
            {
                color: 'green',
                text: 'spawn',
                nbr: 285,
                is_upvoted_by_current_user: 0
            },
            {
                color: 'red',
                text: 'you 5ct',
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
            let textId = event.target.dataset.textId
        }
    }
})