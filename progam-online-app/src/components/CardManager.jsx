// import React from 'react'

import Cards from "./Cards"
import "./CardManager.css"

const CardManager = () => {
    return (
      <div className="card_manager">
        <h1>Start Exploring</h1>
        <div className="cards_container">
            <div className="cards_wrapper">
                <ul className="cards_items">
                  <Cards src="/jpmorganStockImage.jpg" text="JP Morgan Software Engineering Job Simulation" label="Experience" path="/#/experience/jpmorgan-swe-simulation"/>
                  <Cards src="/uclPortico.jpg" text="Studies at University College London" label="Education" path="/#/education/ucl"/>
                </ul>
                <ul className="cards_items">
                  <Cards src="/codeStockImage.jpg" text="Java Platform Game" label="Projects" path="/#/projects/java-platformer"/>
                  <Cards src="/kumonLogo.jpg" text="Maths & English Tutor at Kumon UK" label="Experience" path="/#/experience/kumon-tutor"/>
                </ul>
            </div>
        </div>
      </div>
    )
  }
  
  export default CardManager