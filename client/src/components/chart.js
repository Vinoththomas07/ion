import React from "react";
import FusionCharts from "fusioncharts";
import TimeSeries from "fusioncharts/fusioncharts.timeseries";
import ReactFC from "react-fusioncharts";
const width = window.innerWidth*0.9
const height = window.innerHeight*0.8
ReactFC.fcRoot(FusionCharts, TimeSeries);

const jsonify = res => res.json();

let dataFetch = fetch(
    "upload?index=1"
  ).then(jsonify);
const schemaFetch = [{
    "name": "time",
    "type": "date",
    "format": "%d-%b-%y %H:%M:%S"
  }, {
    "name": "val",
    "type": "number"
  }]

const dataSource = {
  chart: {},
  caption: {
    text: "Temperature Analysis"
  },
  subcaption: {
    text: ""
  },
  yaxis: [
    {
      plot: {
        value: "Value"
      },
      title: "Value"
    }
  ]
};



export default class LineChart extends React.Component {
  constructor(props) {
    super(props);
    this.onFetchData = this.onFetchData.bind(this);
    this.state = {
      timeseriesDs: {
        type: "timeseries",
        renderAt: "container",
        width: width,
        height: height,
        dataSource,
      },
      nextIndex:2,
      loading: false
    };
  }

  componentDidMount() {
    this.onFetchData();
  }

  handleClick=async()=>{
    let {currentData, nextIndex, loading} = this.state;
    if(!loading){
        this.setState({loading:true})
        let newData = await fetch(
            "upload?index="+nextIndex
          ).then(jsonify);
        dataFetch = [...newData, ...currentData]
        console.log(newData[newData.length-1].nextIndex)
        this.setState({currentData: dataFetch, nextIndex: newData[newData.length-1].nextIndex, loading:false})
        this.onFetchData()
    }
}

  onFetchData() {
    Promise.all([dataFetch, schemaFetch]).then(res => {
      const data = res[0];
      const schema = res[1];
      const fusionTable = new FusionCharts.DataStore().createDataTable(
        data,
        schema
      );
      const timeseriesDs = Object.assign({}, this.state.timeseriesDs);
      timeseriesDs.dataSource.data = fusionTable;
      this.setState({
        timeseriesDs,
        currentData: data
      });
    });
  }

  render() {
    return (
      <div>
        {(this.state.timeseriesDs.dataSource.data) ? (
            <>
                <ReactFC {...this.state.timeseriesDs} />
                <button type="button" onClick={()=>this.handleClick()} className={"btn btn-success"} style={{width: "30%", left:"35%", position: "absolute", zIndex:1}}>
                    {this.state.loading?<div class="spinner-border" role="status" style={{height:20, width:20}}></div>:"Load more previous data"}
                </button>
            </>
        ) : (
          "loading"
        )}
      </div>
    );
  }
}