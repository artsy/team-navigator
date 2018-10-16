import * as React from "react"

const query = `
{
  filter_artworks(aggregations: [TOTAL, PRICE_RANGE], acquireable: true, at_auction: false) {
    aggregations {
      counts {
        name
        count
      }
    }
  }
}

`

class ReloaderApp extends React.Component<{}, {data: any}> {
  componentDidMount() {
    // Reload after an hour, by using the browsers refresh
    const oneHour = 1000 * 60 * 60
    setInterval(() => window.document.location = window.document.location, oneHour)
    
    // Make the query, which sets the state
    fetch("https://metaphysics-production.artsy.net/", {
      method: "POST",  
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query })
    }).then(response => response.json()).then(json => {
      this.setState({ data: json.data })
    })
  }  

  public render() {
    if(!this.state || !this.state.data) {
      return null
    } else {
      return <App data={this.state.data} />
    }
  }
}

class App extends React.Component<{ data: any}> {
  public render() {
    const forSale = this.props.data.filter_artworks.aggregations[0].counts.find((c :any) => c.name === "for Sale")
    return <html>
    <body style={{ textAlign: "center" }}>
    <h1 style={{ fontSize: 400, marginBottom: 0 }}>{forSale.count}</h1>
    <h2 style={{ fontSize: 200, marginBottom: 0 }}>Buy Now<br/>Artworks</h2>
    </body>
    </html>
  }
}


export default ReloaderApp
