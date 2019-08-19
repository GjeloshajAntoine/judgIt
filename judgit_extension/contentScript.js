console.log('contentscipt_');

//console.log(document.querySelectorAll('a'));
function oneByone() {
    document.querySelectorAll('a').forEach(e=> {
        console.log('before fetch');
        e.style.backgroundImage = colorLineGraph()
        let url = e.href
        if (!url) return ;
        fetch('http://localhost:3000/votes/colorTotal',
         {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({url: url})
          }
        )
        .then(res=>{
            return res.json().catch(console.log)
        })
        .then(colors=>{
            if(colors.hasOwnProperty('url')) console.log(colors)
            e.addEventListener('mouseover', function () {
                //this.style.backgroundImage = colorLineGraph(colors.green,colors.yellow,colors.red)
                // this.dataset.color = colorLineGraph(50,10,40)
                // this.style.backgroundImage = 'linear-gradient(transparent, transparent),linear-gradient(transparent, transparent),linear-gradient(to right, #30e8bf, #F90F00)'
               
                //TODO:
                document.styleSheets[0].addRule(`a[href="${url}"]:hover::after{background:${colorLineGraph(50,10,40)};`)
            })
            e.addEventListener('mouseout',function () {
                this.style.backgroundImage = ''
            })
        })
        
    })  
}



// function colorLineGraph(green,yellow,red) {
//     return 'linear-gradient(transparent, transparent),linear-gradient(transparent, transparent),linear-gradient(to right, #30e8bf, #F90F00)'
// }
function colorLineGraph(green,yellow,red) {// arg as percentage
    let greenEnd = green // percentage of green equals
    let yellowStart = greenEnd
    let yellowEnd = yellowStart + yellow // 
    let redStart = yellowEnd // red has to be 100% and will automaticall fill the available space and thus matching the  remaining percentage amount
    let redEnd = 100 // red has to be 100% and will automaticall fill the available space and thus matching the  remaining percentage amount
    return  `linear-gradient(90deg, rgba(9,255,0,1) ${0}%,
            rgba(0, 255, 31, 0.97) ${greenEnd}%,  
            rgba(244,255,0,1) ${yellowStart}%, 
            rgba(255,239,0,1) ${yellowEnd}%, 
            rgb(255, 1, 1) ${redStart}%,
            rgb(255, 1, 1) ${redEnd}%)`
}