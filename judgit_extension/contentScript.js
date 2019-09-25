console.log('contentscipt_');

function ByBulk() {
    let aElems = Array.from(document.querySelectorAll('a'))
    let urls = aElems.map(e=>{
        return e.href
    }) 
    fetch('https://judgit.site/votes/colorTotalBulk',
    {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({urls: urls})
      }
    )
    .then(res=>res.json())
    .then(data=>{
        data.forEach(colorTotal=>{
            let{green,yellow,red,url} = colorTotal
            colorTotal = green+yellow+red
            green = ((parseFloat(green) / parseFloat(colorTotal))*100)
            yellow = ((parseFloat(yellow) / parseFloat(colorTotal))*100)
            red = ((parseFloat(red) / parseFloat(colorTotal))*100)
            if(!green) {//dummy data

            } else {
                document.styleSheets[0].addRule(`a[href="${url}"]:hover::after{
                    background:${colorLineGraph(green,yellow,red)};
                    margin-top: -6px;
                    `)
            }
        })
    })
}

ByBulk()
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