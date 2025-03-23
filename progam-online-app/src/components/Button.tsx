import React from 'react'
import "./Button.css"
// import { Link } from 'react-router-dom'

interface ButtonProps {
    children: string;
    type: any;
    onClick: () => void;
    style?: "btn--primary" | "btn--outline" | "btn--secondary"
    size?: "btn--medium" | "btn--large"
    link: string;
}

// const STYLES = ["btn--primary", "btn--outline"]
// const SIZES = ["btn--medium","btn--large"]

export const Button = ({children, type, onClick, style = "btn--primary", size = "btn--medium", link = "/#/contact-me"}) => {
    // const checkStyle = STYLES.includes(style) ? style: STYLES[0]
    // const checkSize = SIZES.includes(size) ? style: SIZES[0]

    return (
        <a href={link} className="btn-mobile">
            <button className={`btn ${style} ${size}`} onClick={onClick} type={type}>
                {children}
            </button>
        </a>
    )
}