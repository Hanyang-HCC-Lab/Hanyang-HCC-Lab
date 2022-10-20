import React from 'react';

function Nav() {

    const navStyle={
        --fa-font-solid: normal 900 1em/1 "Font Awesome 6 Solid";
        --fa-font-regular: normal 400 1em/1 "Font Awesome 6 Regular";
        --fa-font-light: normal 300 1em/1 "Font Awesome 6 Light";
        --fa-font-thin: normal 100 1em/1 "Font Awesome 6 Thin";
        --fa-font-duotone: normal 900 1em/1 "Font Awesome 6 Duotone";
        --fa-font-brands: normal 400 1em/1 "Font Awesome 6 Brands";
        --bs-blue: #0d6efd;
        --bs-indigo: #6610f2;
        --bs-purple: #6f42c1;
        --bs-pink: #d63384;
        --bs-red: #dc3545;
        --bs-orange: #fd7e14;
        --bs-yellow: #ffc800;
        --bs-green: #198754;
        --bs-teal: #20c997;
        --bs-cyan: #0dcaf0;
        --bs-white: #fff;
        --bs-gray: #6c757d;
        --bs-gray-dark: #343a40;
        --bs-gray-100: #f8f9fa;
        --bs-gray-200: #e9ecef;
        --bs-gray-300: #dee2e6;
        --bs-gray-400: #ced4da;
        --bs-gray-500: #adb5bd;
        --bs-gray-600: #6c757d;
        --bs-gray-700: #495057;
        --bs-gray-800: #343a40;
        --bs-gray-900: #212529;
        --bs-primary: #ffc800;
        --bs-secondary: #6c757d;
        --bs-success: #198754;
        --bs-info: #0dcaf0;
        --bs-warning: #ffc800;
        --bs-danger: #dc3545;
        --bs-light: #f8f9fa;
        --bs-dark: #212529;
        --bs-primary-rgb: 255, 200, 0;
        --bs-secondary-rgb: 108, 117, 125;
        --bs-success-rgb: 25, 135, 84;
        --bs-info-rgb: 13, 202, 240;
        --bs-warning-rgb: 255, 200, 0;
        --bs-danger-rgb: 220, 53, 69;
        --bs-light-rgb: 248, 249, 250;
        --bs-dark-rgb: 33, 37, 41;
        --bs-white-rgb: 255, 255, 255;
        --bs-black-rgb: 0, 0, 0;
        --bs-body-color-rgb: 33, 37, 41;
        --bs-body-bg-rgb: 255, 255, 255;
        --bs-font-sans-serif: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
        --bs-font-monospace: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        --bs-gradient: linear-gradient(180deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0));
        --bs-body-font-family: Roboto Slab, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
        --bs-body-font-size: 1rem;
        --bs-body-font-weight: 400;
        --bs-body-line-height: 1.5;
        --bs-body-color: #212529;
        --bs-body-bg: #fff;
        font-family: var(--bs-body-font-family);
        font-size: var(--bs-body-font-size);
        font-weight: var(--bs-body-font-weight);
        line-height: var(--bs-body-line-height);
        color: var(--bs-body-color);
        text-align: var(--bs-body-text-align);
        -webkit-text-size-adjust: 100%;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        z-index: 1030;
        --bs-bg-opacity: 1;
        background-color: rgba(var(--bs-secondary-rgb), var(--bs-bg-opacity)) !important;
        padding-top: 1rem;
        padding-bottom: 1rem;
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark fixed-top bg-secondary" id="mainNav">
            <div className="container">
                <a className="navbar-brand" href="#page-top"><img style={{width: '3rem', height: 'auto'}} src="../assets/images/navbar-logo.png" alt="..." /></a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                Menu
                <i className="fas fa-bars ms-1" />
                </button>
                <div className="collapse navbar-collapse" id="navbarResponsive">
                <p className="fs-3">Hanyang Human-Centered Computing Lab</p>
                <ul className="navbar-nav text-uppercase ms-auto py-4 py-lg-0">
                    <li className="nav-item"><a className="nav-link" href="#">Research</a></li>
                    <li className="nav-item"><a className="nav-link" href="#">Members</a></li>
                    <li className="nav-item"><a className="nav-link" href="#">Publications</a></li>
                    <li className="nav-item"><a className="nav-link" href="#">Courses</a></li>
                    <li className="nav-item"><a className="nav-link" href="#">Gallery</a></li>
                </ul>
                </div>
            </div>
        </nav>
    )
}

export default Nav;