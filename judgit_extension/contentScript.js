console.log('contentscipt_');

//console.log(document.querySelectorAll('a'));

document.querySelectorAll('a').forEach(e=> {
    console.log('before fetch');
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
            this.style.backgroundImage = colorLineGraph(colors.green,colors.yellow,colors.red)
            // this.style.backgroundImage = 'linear-gradient(transparent, transparent),linear-gradient(transparent, transparent),linear-gradient(to right, #30e8bf, #F90F00)'
        })
        e.addEventListener('mouseout',function () {
            this.style.backgroundImage = ''
        })
    })
    
})


function colorLineGraph(green,yellow,red) {
    return 'linear-gradient(transparent, transparent),linear-gradient(transparent, transparent),linear-gradient(to right, #30e8bf, #F90F00)'
}