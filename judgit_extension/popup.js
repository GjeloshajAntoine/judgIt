// import { link } from "fs";

// chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
//     let tab = tabs[0]
//     document.getElementById('url').innerText = tab.url
// })

let currentTab = new Promise((resolve, reject) => chrome.tabs.query({ active: true, currentWindow: true }, resolve))
const urlProm = currentTab.then(tabs => {
    console.log(tabs[0]);
    document.querySelector('#title').innerText = tabs[0].title
    document.getElementById('url').innerText = tabs[0].url
    return  tabs[0].url;
})

fapi = NewFapi('http://localhost:3000')
let linkIdProm = urlProm.then(url=> fapi('/votes/linkId',jsonPostBody({url,url}))).then(resp=>resp.json()).then(data=>data.id) 

let app = new Vue({
    el: '#view-root',
    data: {
        input:{
            color:'yellow',
            text:''
        },
        colorVotes:[

        ],
        colorVotesExample: [
            {
                color: 'yellow',
                text: 'spawn',
                text_id:2,
                nbr: 285,
                percentage:50,
                is_upvoted_by_current_user: 0
            },
            {
                color: 'red',
                text: 'you 50ct',
                text_id:4,
                nbr: 285,
                percentage:50,
                is_upvoted_by_current_user: 1
            }
        ]
    },
    created:async function () {
       await linkIdProm ? fapi('/votes/votes',jsonPostBody({linkId:await linkIdProm})).then(res=>res.json())
       .then(data=>this.colorVotes=data) 
       : ''
    },
    methods: {
        switchColor: function (event) {
            this.input.color = event.target.dataset.color
        },
        sendVote: async function (event) {
            let text = this.input.text
            let color = this.input.color
            let linkId = await linkIdProm;
            //console.warn(linkId);
            
            (linkId ? fapi('/votes/CreateOrUpVoteLinkId',jsonPostBody({linkId:linkId,text:text,color:color})) :
            fapi('/votes/CreateOrUpVoteLinkUrl',jsonPostBody({url:await urlProm,text:text,color:color}))
            )
            .then(async o=>{
                if (await linkIdProm) {
                    return linkIdProm
                }else {
                    linkIdProm = fapi('/votes/linkId',jsonPostBody({url : await urlProm})).then(resp=>resp.json()).then(data=>data.id) 
                    return  linkIdProm
                }
            })
            .then(async o=>fapi('/votes/votes',jsonPostBody({linkId:await linkIdProm})))
            .then(res=>res.json())
            .then(votes=>{this.colorVotes = votes})
        },
        upVote: async function (event) {
            let textId = event.target.dataset.textId
            let color = event.target.dataset.color
            fapi('/votes/upvote',jsonPostBody({textId:textId,linkId: await linkIdProm,color:color}))
            .then(resp=>resp.json())
            .then(async o=>fapi('/votes/votes',jsonPostBody({linkId:await linkIdProm})))
            .then(resp=>resp.json())
            .then(votes=>this.colorVotes = votes)
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