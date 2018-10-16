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
    
    hits {
      title
			image {
        url(version:"original")
      }
      price
      artist_names
    }
  }
}

`

class ReloaderApp extends React.Component<{}, { data: any }> {
  componentDidMount() {
    // Reload after an hour, by using the browsers refresh
    const oneHour = 1000 * 5
    setInterval(() => this.getJSONData(), oneHour)
    this.getJSONData()
  }

  getJSONData() {
    // Make the query, which sets the state
    fetch("https://metaphysics-production.artsy.net/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    })
      .then(response => response.json())
      .then(json => {
        this.setState({ data: json.data })
      })
  }

  public render() {
    if (!this.state || !this.state.data) {
      return null
    } else {
      return <App data={this.state.data} />
    }
  }
}

class App extends React.Component<{ data: any }> {
  public render() {
    const forSale = this.props.data.filter_artworks.aggregations[0].counts.find((c: any) => c.name === "for Sale")
    const works = this.props.data.filter_artworks.hits
    const mostRecent = works[0]
    const almostRecent = works[1]
    return (
      <div
        style={{
          display: "flex",
          backgroundColor: "black",
          height: "100%",
          width: "100%",
          position: "absolute",
          fontFamily: "Unica77LLWebRegular",
        }}
      >
        <link rel="stylesheet" type="text/css" href="https://webfonts.artsy.net/unica-webfonts.css" />
        <div style={{ marginLeft: 300, width: 60, borderLeft: "1px white solid" }} />
        <div style={{ flex: 1, color: "white" }}>
          <p
            style={{
              position: "absolute",
              left: 76,
              top: -22,
              fontSize: 30,
              paddingRight: 50,
              marginBottom: 0,
              color: "white",
              backgroundColor: "black",
              textAlign: "right",
              width: 230,
              paddingTop: 20,
            }}
          >
            {forSale.count}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;•
          </p>
          <div style={{ marginTop: 40, height: "800px" }}>
            <img src={mostRecent.image.url} style={{ display: "block", width: "auto", height: "100%" }} />
          </div>
          <h2>{mostRecent.artist_names}</h2>
          <h2>{mostRecent.price}</h2>

          <div style={{ marginTop: 90 }} />
          <p
            style={{
              position: "absolute",
              left: 76,
              fontSize: 30,
              paddingRight: 50,
              marginBottom: 0,
              color: "white",
              backgroundColor: "black",
              textAlign: "right",
              width: 230,
              paddingTop: 20,
              marginTop: -30,
            }}
          >
            {forSale.count - 1}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;•
          </p>

          <div style={{ width: "400px" }}>
            <img src={almostRecent.image.url} style={{ display: "block", width: "100%", height: "auto" }} />
          </div>
          <h2>{almostRecent.artist_names}</h2>
          <h2>{almostRecent.price}</h2>
        </div>
      </div>
    )
  }
}

export default ReloaderApp
