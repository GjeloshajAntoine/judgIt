
// chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
//     let tab = tabs[0]
//     document.getElementById('url').innerText = tab.url
// })

let currentTab = new Promise((resolve,reject)=>chrome.tabs.query({ active: true, currentWindow: true }, resolve))
currentTab.then(tabs=>{
    console.log(tabs[0]);
    tabs[0].title
    document.querySelector('#title').innerText = tabs[0].title
    document.getElementById('url').innerText = tabs[0].url
})
let app = new Vue({
    el: '#new-entry',
    data: {
      color:'yellow',
      colorVotes:[]
    },
    methods:{
        switchColor:function (event) {
            this.color = event.target.dataset.color
        },
        sendVote:function () {
            
        }
    }
  })