/// import React from 'react'
import "../App.css"
import { Button } from "./Button"
import "./Opening.css"

const Opening = () => {
  return (
    <div className="opening-container">
        {/* <img src="/LinkedIn-pfp.jpg"/> */}
        <h1 className="title">I AM FARHAN ADEYEMO</h1>
        <p className="subtitle">Welcome to my portfolio</p>
        <div className="opening-btns">
            {/* <Button className="btn" style="btn--secondary" size="btn--large">
                Discover
            </Button> */}
            <Button className="btn" style="btn--secondary" size="btn--large" link="/#/about-me">
                About me <i className="bi bi-info-circle"></i>
            </Button>
        </div>
    </div>
  )
}

export default Opening