// import React from 'react'

// import { Button } from "./Button"
import "./Footer.css"

const Footer = () => {
  return (
    <div className="footer-manager">

        <section className="socials">
            <div className="socials-container">
                <div className="footer-logo">
                    <a href="/" className="socials-logo">
                        Program<i className="bi bi-outlet"></i>nline
                    </a>
                </div>
                <div className="socials-icon">
                    <a className="socials-icon-link linkedin" href="https://www.linkedin.com/in/farhan-adeyemo-2a4113287" target="_blank">
                        <i className="bi bi-linkedin"></i>
                    </a>
                    <a className="socials-icon-link github" href="https://github.com/FarhanAde" target="_blank">
                        <i className="bi bi-github"></i>
                    </a>
                    <a className="socials-icon-link instagram" href="https://www.instagram.com/farhan.adey/" target="_blank">
                        <i className="bi bi-instagram"></i>
                    </a>
                </div>
            </div>
        </section>
    </div>
  )
}

export default Footer