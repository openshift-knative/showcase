const eventsList = document.getElementById('events-list')
function init() {
  const source = new EventSource('/events')
  source.onmessage = (e) => {
    const li = document.createElement('li')
    const d = JSON.parse(e.data)
    li.innerHTML = `<code>${JSON.stringify(d.data)}</code>`
    eventsList.appendChild(li)
  }
  source.onopen = (e) => {
    eventsList.innerHTML = ''
  }
  source.onerror = (e) => {
    source.close()
    init()
  }
}
init()
