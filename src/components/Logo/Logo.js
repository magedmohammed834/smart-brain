import React from 'react';
import Tilt from 'react-parallax-tilt';
import './Logo.css';
import brain from './brain.jpg';


const Logo = () => {
    return (
        <div className= "ma4 mt0">
            
            <Tilt className= 'br2 shadow-2 ' style= {{width: '150px'}}>
                <div className= 'pa2 ba b--black' style={{ height: '150px', width: '150px'}}>
                <img alt= 'logo' src={brain}/>

                </div>
                
            </Tilt>
            <div>
                <p className= 'f4 br4 black mt4' style= {{display: 'flex', justifyContent: 'flex-start'}}>credits: <a className='white' href="https://www.vecteezy.com/free-vector/brain-icon" target= 'blank'>Brain Icon Vectors by Vecteezy</a></p>

                </div>
        </div>
    )
}

export default Logo;