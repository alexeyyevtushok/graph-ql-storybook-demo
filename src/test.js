const fetch = require("node-fetch");
var query = `query {
  registries {
    Name,
    Spouse,
    Address
  }
}`;
fetch('http://ICGUA-PC-465:4000/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    body: JSON.stringify({
        query
    })
})
    .then(r => r.json())
    .then(data => console.log(JSON.stringify(data)))
;