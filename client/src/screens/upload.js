import React, { Component } from 'react'
import LineChart from '../components/chart';

export default class Upload extends Component {

    constructor(props) {
        super(props);
        this.fileUploader = React.createRef();
        this.state={
            status:"Add your JSON file to be uploaded to mongodb",
            path:"Upload",
            file:null,
            showGraph:false,
            viewOption:false,
            noPrevious:false
        }
    }
    
    componentDidMount=async()=>{
        await fetch(
            "upload?index=1"
        ).then(response=>response.json()).then(data=>{
            if(data.length>1){
                this.setState({viewOption:true})
            } else {
                this.setState({noPrevious:true})
            }
        })
    }

    async handleClick(e) {
        const {path, file} = this.state;
        if(path=="Send"){
            this.setState({status: "Uploading your file..."})
            console.log(file)
            const formData = new FormData();
            formData.append('file', file);
            var requestOptions = {
                method: 'POST',
                body: formData,
                redirect: 'follow'
              };
            await fetch("/upload", requestOptions)
                .then(response => response)
                .then((data) => this.setState({status:data.message, path: "Click to view the graph!"}))
                .catch(error => console.log('error', error));
            // axios.post("upload", formData)
                // .then((res) => res.data)
                // .then((data) => this.setState({status:data.message, path: "Click to view the graph!"}))
        } else if(path=="Upload") {
            this.fileUploader.current.click()
        } else if(path=="Click to view the graph!"){
            this.setState({showGraph:true})
        }
    }

    getUrl=(file)=>{
        this.setState({path:"Send", file:file, status: `Uploaded ${file.name}, send your file to db`})
    }

    checkGraphData=()=>{
        this.setState({showGraph:true})
    }

    deleteGraphData=()=>{
        var raw = "";
        var requestOptions = {
        method: 'DELETE',
        body: raw,
        redirect: 'follow'
        };

        fetch("/upload", requestOptions)
        .then(response => response.json())
        .then(result => {this.setState({showGraph:false, viewOption:false, noPrevious:true}); alert("Data deleted!")})
        .catch(error => console.log('error', error));
    }

    render() {
        const {path, status, file, showGraph, viewOption, noPrevious} = this.state;
        return (
            <div className="container">
                <div style={{height:"100vh"}} className="row align-items-center justify-content-center">
                    {showGraph?<LineChart/>:
                    <div className>
                        <h5 style={{height:"7vh"}}>{status}</h5>
                        {status=="Uploading your file..."&&
                            <h6 style={{height:"7vh"}}>"This process will take a longer time depending on the file size. Usually less than 1 minute per 30 MB"</h6>
                        }
                        <input type="file" accept=".json" id="file" onChange={(e)=>this.getUrl(e.target.files[0])} ref={this.fileUploader} style={{display: "none"}}/>
                        <button type="button" onClick={()=>this.handleClick()} className={"btn "+(file?"btn-success":"btn-primary")}>
                            {status=="Uploading your file..."
                                ?
                                <div class="spinner-border" role="status"></div>
                                :
                                <>{path}</>
                            }
                        </button>
                        {viewOption?
                        <div style={{marginTop:"5%"}}>
                            <h5 style={{marginBottom:"2%"}}>Previous data found!</h5>
                            <button type="button" onClick={()=>this.checkGraphData()} className={"btn btn-success"}>
                                View graph data
                            </button>
                            <button type="button" onClick={()=>this.deleteGraphData()} className={"btn btn-danger"} style={{marginLeft:'5%'}}>
                                Delete data
                            </button>
                        </div>:
                        <div style={{marginTop:"5%", marginBottom:"5%"}}>
                            <h6 style={{color:'#999999'}}>{!noPrevious?"Will show previous uploaded data, if anything found...":"No previous data found"}</h6>
                        </div>
                        }
                        
                    </div>
                    }
                </div>
            </div>
        )
    }
}
