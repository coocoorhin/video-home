
import './App.css';
import React from 'react';
import Clappr from 'clappr';
import PropTypes from 'prop-types';
// import * as fs from 'fs';

class SourceSelector extends React.Component {
  constructor(props) {
    super(props)
    this.nodeRef = React.createRef()
  }
  
  handleLoadSource() {
    console.log('Loading source'+ typeof this.props.onChange)
    if (typeof this.props.onChange !== 'function') return 
    this.props.onChange(this.nodeRef.current.value)
    // console.log('not return')
  }
  
  handleKeyPress(e) {
    if (e.key !== 'Enter') return
    this.handleLoadSource()
  }
  
  render() {
    return (
      <div className="source-selector">
        {/* <SourceItem  /> */}
        <span>URL: </span>
        <input 
          ref={this.nodeRef}
          className="url-input"
          type="text" 
          placeholder="https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8"
          onKeyPress={this.handleKeyPress.bind(this)}
          defaultValue={this.props.src}/>
        <button onClick={this.handleLoadSource.bind(this)}>Load</button>
      </div>
    )
  }
}

class VideoItem extends React.Component{
  constructor(props) {
    super(props)
    // this.handleClick = this.handleClick.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }
  

  // handleClick(e) {
  //   e.preventDefault();
  //   console.log('Loading source'+ typeof this.props.onChange)
  //   if (typeof this.props.onChange !== 'function') return 
  //   this.props.onChange(this.nodeRef.current.value)
  //   // console.log('not return')
  // }

   handleChange(event){
    console.log(event.target)
    this.props.onClick(event)
   }

  // handleChange(){
  //   console.log(this.props)
  // }

  render() {
    return (
    <li>
      <a onClick={this.handleClick}
      ref={this.nodeRef}
    >
      
      {this.props.value.Name}</a>
      
        <button onClick={this.handleChange.bind(this)}> button</button>

      </li>
    
    )
  }
}


class VideoSelector extends React.Component {
  constructor(props) {
    super(props)
  }

  handleChange(){
    console.log(this.props)
    this.props.onChange('/2.mp4')
    console.log(this.props)

  }
  
  render() {

    const videos = this.props.videos;
    const listItems = videos.map((video, index) =>
    <VideoItem key={index} value={video} 
    onClick={this.props.handleChange}
    />
    );

    return(
      <div>
        <ul>
          {listItems}
        </ul>
        <button onClick={this.handleChange}> button</button>
      </div>

    );
  }

}





class ClapprWrapper extends React.Component {
  PropTypes = {
    src: PropTypes.string
  }

  constructor(props) {
    super(props)
    this.playerInstance = new Clappr.Player({ 
      autoPlay: false,
      mute: false,
      // chromeless:true,
    })
    this.nodeRef = React.createRef()
  }
  
  componentDidMount() {
    this.playerInstance.attachTo(this.nodeRef.current)
    this.loadSource(this.props.src)
  }
  
  componentWillUnmount() {
    this.playerInstance.destroy()
  }
  
  shouldComponentUpdate(nextProps, ) {
    if (nextProps.src !== this.props.src) {
      this.loadSource(nextProps.src)
    }
    return false;
  }
  
  loadSource(src) {
    this.playerInstance.load(src)
  }
  
  render() {
    return <div ref={this.nodeRef} className='player-wrapper'/>
  }
}

class App extends React.Component {  
  constructor(props) {
     super(props)
     this.state = {
      //  src: 'https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_480_1_5MG.mp4',
       src: process.env.PUBLIC_URL + "/1.mp4",
       videos: []
     }
   }
  
  handleChange(newSrc) {
    console.log('onSourceChanged: ', newSrc)
    // if (!/https?:/.test(newSrc)) 
    return this.setState({
      src: newSrc
    })
  }


  componentDidMount() {
    fetch('http://localhost:8080/videolist')
    .then(res => res.json())
    .then((data) => {
      // console.log(JSON.parse(atob(data)));
      
      this.setState({ videos: JSON.parse(atob(data)) })
    })
    .catch(console.log)

  }

  render() { 
    return (
      <div>
        <h1>React Example</h1>
        <p>This is a simple React application to demonstrate how to load Clappr from within React.</p>
        <SourceSelector 
          src={this.state.src}
          onChange={this.handleChange.bind(this)}/>

        <VideoSelector 
        videos={this.state.videos}
        src={this.state.src}
        onChange={this.handleChange.bind(this)}/>

        <ClapprWrapper src={this.state.src}/>
      </div>
    )
  }
}

export default App;
