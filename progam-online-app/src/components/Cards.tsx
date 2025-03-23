import React from 'react'

interface CardProps {
  label: string;
  path: string;
  src: string
  text: string;
}

function Cards(card: CardProps) {
  return (
    <>
    <li className="cards">
        <a className="cards_link" href={card.path}>
            <figure className="cards_pic_wrap" data-category={card.label}>
                <img src={card.src} alt="Java Platform Game" className="cards_image"/>
            </figure>
            <div className="cards_info">
                <h5 className="cards_text">{card.text}</h5>
            </div>
        </a>
    </li>
    </>
  )
}

export default Cards