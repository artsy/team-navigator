import * as React from "react"

const query = `
{
  bn: filter_artworks(aggregations: [TOTAL, PRICE_RANGE], acquireable: true, at_auction: false) {
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
  mo: filter_artworks(aggregations: [TOTAL, PRICE_RANGE], offerable: true, at_auction: false) {
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
    // Setup
    this.getJSONData()

    // Reload react every 10 seconds
    const tenSecs = 1000 * 10
    setInterval(() => this.getJSONData(), tenSecs)
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
    const forSale = this.props.data.bn.aggregations[0].counts.find((c: any) => c.name === "for Sale")
    const bnWorks = this.props.data.bn.hits
    const moWorks = this.props.data.mo.hits
    const forMO = this.props.data.mo.aggregations[0].counts.find((c: any) => c.name === "for Sale")
    return (
      <div
        style={{
          display: "flex",
          backgroundColor: "white",
          height: "100%",
          width: "100%",
          position: "absolute",
          fontFamily: "Unica77LLWebRegular",
          fontSize: 20,
          color: "white",
        }}
      >
        <link rel="stylesheet" type="text/css" href="https://webfonts.artsy.net/unica-webfonts.css" />

        <div style={{ padding: 40, display: "flex", flexDirection: "row", justifyContent: "space-evenly", width: "90%" }}>
          <div id="BN" style={{marginRight: 20 }}>
            <h2 style={{color: "black", borderRadius: 0, borderColor: "black", borderStyle: "solid", padding: "5px"}}> Buy Now </h2>
            <div style={{ display: "flex", flexDirection: "column", flexShrink: 0.1, borderRight: "1px black solid", paddingRight: 30 }}>
            {
              bnWorks.slice(0, 3).map( (item, index) => {
                return(
                  <div style={{color: "black", display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: 80}}>
                    <p>
                      No. {(forSale.count - index).toLocaleString() }
                      <span style={{ fontSize: 50, position: "relative", top: 11, left: 4 }}>•</span>
                    </p>
                    <div style={{ marginTop: 16, height: "450px" }}>
                      <img src={item.image.url} style={{ display: "block", width: "auto", height: "100%" }} />
                      <h2 style={{ marginTop: 20, padding: 0, lineHeight: "25px", fontSize: 20, color: "black" }}>
                        {item.artist_names}
                        <br />
                        {item.price}
                      </h2>
                    </div>
                  </div>
                )
              })
            }
            </div>
          </div>

          <div id="MO" style={{marginLeft: 10}}>
            <h2 style={{color: "black", borderRadius: 0, borderColor: "black", borderStyle: "solid", padding: "5px"}}> Make Offer </h2>
            <div style={{ flex: 1, color: "white", padding: 10, position: "relative", flexDirection: "column" }}>
            {
              moWorks.slice(0, 3).map( (item, index) => {
                return(
                  <div style={{color: "black", display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: 80}}>
                    <p>
                      No. {(forMO.count - index).toLocaleString() }
                      <span style={{ fontSize: 50, position: "relative", top: 11, left: 4 }}>•</span>
                    </p>
                    <div style={{ marginTop: 16, height: "450px" }}>
                      <img src={item.image.url} style={{ display: "block", width: "auto", height: "100%" }} />
                      <h2 style={{ marginTop: 20, padding: 0, lineHeight: "25px", fontSize: 20, color: "black" }}>
                        {item.artist_names}
                        <br />
                        {item.price}
                      </h2>
                    </div>
                  </div>
                )
              })
            }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ReloaderApp
