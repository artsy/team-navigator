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
    const alAlmostRecent = works[2]
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

        <div style={{ width: 490, borderRight: "1px black solid", padding: 35 }}>
          <svg width="127px" height="47px" viewBox="0 0 127 47" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <title>Group 2</title>
            <desc>Created with Sketch.</desc>
            <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <g id="Artboard-Copy-4" transform="translate(-40.000000, -39.000000)">
                <g id="Group-2" transform="translate(40.000000, 39.000000)">
                  <path
                    d="M29.7878199,29.0737179 L29.7878199,15.9498718 L33.7964455,15.9498718 C35.3493365,15.9498718 36.5952607,16.0764103 37.4258768,16.600641 C38.3467773,17.1429487 38.9065403,18.0648718 38.9065403,19.3664103 C38.9065403,20.8125641 38.0759242,21.9694872 36.4688626,22.3491026 L36.4688626,22.4033333 C38.2203791,22.6925641 39.1773934,23.7771795 39.1773934,25.4764103 C39.1773934,26.9587179 38.4551185,27.9891026 37.3355924,28.5314103 C36.3966351,28.9833333 35.2590521,29.0737179 33.724218,29.0737179 L29.7878199,29.0737179 Z M32.0810427,27.2298718 L33.8325592,27.2298718 C35.4035071,27.2298718 36.8480569,26.9587179 36.8480569,25.295641 C36.8480569,23.7229487 35.7465877,23.3614103 33.7422749,23.3614103 L32.0810427,23.3614103 L32.0810427,27.2298718 Z M32.0810427,21.5175641 L33.7061611,21.5175641 C34.9520853,21.5175641 36.6674882,21.3548718 36.6674882,19.655641 C36.6674882,18.0467949 35.3854502,17.8117949 33.7783886,17.8117949 L32.0810427,17.8117949 L32.0810427,21.5175641 Z M47.2488152,29.0737179 L47.2488152,27.8625641 C46.5265403,28.8387179 45.3709005,29.2544872 44.305545,29.2544872 C43.0957346,29.2544872 42.2470616,28.7844872 41.6692417,27.9891026 C41.2178199,27.3564103 41.1275355,26.3802564 41.1275355,25.0425641 L41.1275355,19.7460256 L43.2763033,19.7460256 L43.2763033,24.9702564 C43.2763033,26.3441026 43.4929858,27.6094872 44.9917062,27.6094872 C45.6417536,27.6094872 46.1834597,27.3744872 46.5265403,26.8864103 C46.8876777,26.3983333 47.1043602,25.6210256 47.1043602,24.4821795 L47.1043602,19.7460256 L49.2711848,19.7460256 L49.2711848,29.0737179 L47.2488152,29.0737179 Z M51.1671564,32.6710256 L51.1671564,30.9175641 C51.4921801,31.0441026 51.7991469,31.0621795 52.1061137,31.0621795 C53.1353555,31.0621795 53.767346,30.465641 53.9118009,29.1641026 L50.5532227,19.7460256 L52.9728436,19.7460256 L54.3451659,24.4098718 C54.616019,25.3137179 54.8146445,26.235641 55.0674408,27.1394872 L55.175782,27.1394872 C55.4105213,26.2537179 55.6272038,25.295641 55.8980569,24.4098718 L57.3606635,19.7460256 L59.6177725,19.7460256 L56.3675355,28.820641 C55.3382938,31.6767949 54.4173934,32.7794872 52.5575355,32.7794872 C52.0880569,32.7794872 51.7449763,32.7794872 51.1671564,32.6710256 Z M66.5154976,19.7460256 L66.5154976,20.9571795 C67.2558294,19.9810256 68.3934123,19.5652564 69.4768246,19.5652564 C70.83109,19.5652564 71.6436493,20.0533333 72.0950711,20.8487179 C72.5464929,21.5717949 72.6548341,22.5660256 72.6548341,23.7229487 L72.6548341,29.0737179 L70.4880095,29.0737179 L70.4880095,23.8675641 C70.4880095,22.4575641 70.271327,21.2283333 68.7906635,21.2283333 C67.4363981,21.2283333 66.6780095,22.1502564 66.6780095,24.355641 L66.6780095,29.0737179 L64.5111848,29.0737179 L64.5111848,19.7460256 L66.5154976,19.7460256 Z M79.0650237,19.4929487 C81.9180095,19.4929487 83.7236967,21.4814103 83.7236967,24.4098718 C83.7236967,27.3564103 81.9180095,29.3267949 79.0469668,29.3267949 C76.2120379,29.3267949 74.4244076,27.3564103 74.4244076,24.4098718 C74.4244076,21.4633333 76.2300948,19.4929487 79.0650237,19.4929487 Z M79.0650237,21.1560256 C77.5663033,21.1560256 76.6815166,22.4214103 76.6815166,24.4098718 C76.6815166,26.3802564 77.5482464,27.6637179 79.0469668,27.6637179 C80.5818009,27.6637179 81.4665877,26.3983333 81.4665877,24.4098718 C81.4665877,22.4214103 80.5818009,21.1560256 79.0650237,21.1560256 Z M86.7211374,29.0737179 L84.4279147,19.7460256 L86.64891,19.7460256 L87.623981,24.4098718 C87.8045498,25.295641 87.9670616,26.3079487 88.1295735,27.2117949 L88.2559716,27.2117949 C88.4184834,26.3079487 88.617109,25.295641 88.8157346,24.3917949 L89.88109,19.7460256 L92.9146445,19.7460256 L93.9980569,24.4098718 C94.1966825,25.295641 94.3591943,26.3079487 94.539763,27.2117949 L94.6661611,27.2117949 C94.8106161,26.3079487 94.973128,25.295641 95.1536967,24.4098718 L96.1468246,19.7460256 L98.1872512,19.7460256 L95.8940284,29.0737179 L92.9688152,29.0737179 L91.9395735,24.3917949 C91.722891,23.4517949 91.5423223,22.4394872 91.3617536,21.4994872 L91.2353555,21.4994872 C91.0367299,22.4394872 90.8381043,23.4517949 90.6214218,24.4098718 L89.5741232,29.0737179 L86.7211374,29.0737179 Z"
                    id="Buy-now"
                    fill="#000000"
                  />
                  <rect
                    id="Rectangle"
                    stroke="#000000"
                    stroke-width="2.25"
                    x="1.125"
                    y="1.125"
                    width="124.599526"
                    height="44.75"
                    rx="4.5"
                  />
                </g>
              </g>
            </g>
          </svg>
        </div>

        <div style={{ flex: 1, color: "white", padding: 40 }}>
          <p
            style={{
              position: "absolute",
              left: 269,
              top: -40,
              fontSize: 30,
              paddingRight: 50,
              marginBottom: 0,
              color: "black",
              backgroundColor: "white",
              textAlign: "right",
              width: 270,
              paddingTop: 40,
              paddingBottom: 25,
            }}
          >
            No. {forSale.count.toLocaleString()}
            <span style={{ fontSize: 50, position: "relative", top: 6, left: 30 }}>•</span>
          </p>
          <div style={{ marginTop: 16, height: "450px" }}>
            <img src={mostRecent.image.url} style={{ display: "block", width: "auto", height: "100%" }} />
          </div>
          <h2 style={{ marginTop: 20, padding: 0, lineHeight: "25px", fontSize: 20, color: "black" }}>
            {mostRecent.artist_names}
            <br />
            {mostRecent.price}
          </h2>

          <div style={{ marginTop: 60 }} />
 
          <p
          style={{
            position: "absolute",
            left: 269,
            fontSize: 30,
            paddingRight: 50,
            marginBottom: 0,
            color: "black",
            backgroundColor: "white",
            textAlign: "right",
            width: 270,
            marginTop: -48,
            paddingTop: 20,
            paddingBottom: 25,
          }}
        >
          No. {(forSale.count -2).toLocaleString()}
          <span style={{ fontSize: 50, position: "relative", top: 6, left: 30 }}>•</span>
        </p>
        <div style={{ marginTop: 16, height: "450px" }}>
          <img src={alAlmostRecent.image.url} style={{ display: "block", width: "auto", height: "100%" }} />
        </div>
        <h2 style={{ marginTop: 20, padding: 0, lineHeight: "25px", fontSize: 20, color: "black" }}>
          {alAlmostRecent.artist_names}
          <br />
          {alAlmostRecent.price}
        </h2>


        <div style={{ marginTop: 60 }} />
 
        <p
        style={{
          position: "absolute",
          left: 269,
          fontSize: 30,
          paddingRight: 50,
          marginBottom: 0,
          color: "black",
          backgroundColor: "white",
          textAlign: "right",
          width: 270,
          marginTop: -48,
          paddingTop: 20,
          paddingBottom: 25,
        }}
      >
        No. {(forSale.count -1).toLocaleString()}
        <span style={{ fontSize: 50, position: "relative", top: 6, left: 30 }}>•</span>
      </p>
      <div style={{ marginTop: 16, height: "450px" }}>
        <img src={almostRecent.image.url} style={{ display: "block", width: "auto", height: "100%" }} />
      </div>
      <h2 style={{ marginTop: 20, padding: 0, lineHeight: "25px", fontSize: 20, color: "black" }}>
        {almostRecent.artist_names}
        <br />
        {almostRecent.price}
      </h2>

          </div>
      </div>
    )
  }
}

export default ReloaderApp
