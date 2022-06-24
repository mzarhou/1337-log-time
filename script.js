console.log("42 log time: start")

// window.addEventListener('load', function () {
//     gBrowser.addEventListener('DOMContentLoaded', function () {
//         onLoad();
//     }, false);
// }, false);
// function onLoad() {

// }

setTimeout(main, 500);

function main()
{
    const result = {}
    let currentMonth;
    const data = [...document.querySelectorAll("#user-locations > text,g[data-toggle='tooltip']")]
    data.forEach(e => {
        if (e.tagName == "text")
        {
            currentMonth = e.textContent;
            result[currentMonth] = []
        }
        else if (e.tagName == "g")
            result[currentMonth] = [...result[currentMonth], e.dataset.originalTitle]
    })
    console.log(result)
}
