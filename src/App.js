import React, {Component} from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Register from './components/Register/Register';
import Rank from './components/Rank/Rank';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import Signin from './components/Signin/Signin';


const initialState = {
  input: '',
  imageURL: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''

  }
}

class App extends Component {
  
  constructor() {
    super();
    this.state = initialState
    }
  

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
      }})
  }
  
  calculateFaceLocation= (data) => {
   const clarifaiFace =  data.outputs[0].data.regions[0].region_info.bounding_box;
   const image = document.getElementById('inputImage');
   const width = Number(image.width);
   const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box});
  }
  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageURL: this.state.input});
    fetch('https://serene-thicket-17425.herokuapp.com/imageurl', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        input: this.state.input
      })
    })
    .then(response => response.json())
    .then(response => {
      if(response) {
        fetch('https://serene-thicket-17425.herokuapp.com/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
        .then(response =>
          response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, {entries: count}));
      })
      .catch(console.log);
    }
    
    this.displayFaceBox(
    this.calculateFaceLocation(response))
      })
    .catch(err =>
      console.log(err));
  }


  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState);
    } else if (route === 'home') {
      this.setState({isSignedIn: true})

    }
    this.setState({route: route});
  }
  render() {
    const {isSignedIn, imageURL, box, route} = this.state;
  
    const particlesInit = async (main) => {
     console.log(main);
      // you can initialize the tsParticles instance (main) here, adding custom shapes or presets
      // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
      // starting from v2 you can add only the features you need reducing the bundle size
      await loadFull(main);
    };
  
    const particlesLoaded = (container) => {
      console.log(container);
    };
    return (
      <div className=' App'>
        <div className='particles'>
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: {
            color: {
              value: "linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)"
            },
          },
          fpsLimit: 120,
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: "push",
              },
              onHover: {
                enable: true,
                mode: "repulse",
              },
              resize: true,
            },
            modes: {
              push: {
                quantity: 4,
              },
              repulse: {
                distance: 200,
                duration: 0.4,
              },
            },
          },
          particles: {
            color: {
              value: "#ffffff",
            },
            links: {
              color: "#ffffff",
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            collisions: {
              enable: true,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: 1,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 80,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 5 },
            },
          },
          detectRetina: true,
        }}
      />
      </div>
     
    <Navigation isSignedIn={isSignedIn}
    onRouteChange={this.onRouteChange}/>
    { this.state.route === 'home' ?
     <div>
    <Logo />
    <Rank name = {this.state.user.name} entries = {this.state.user.entries}/>
    <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit= {this.onButtonSubmit}/>
    <FaceRecognition box= {box} imageURL={imageURL} />
    </div>
    : (
      route === 'signin' ?
      <Signin loadUser= {this.loadUser} onRouteChange= {this.onRouteChange} />
      : <Register loadUser= {this.loadUser} onRouteChange= {this.onRouteChange} />

    )
      }

   </div>
   

  );
}
}


export default App;
