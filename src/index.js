import $ from 'jquery';
import App from './three/app';

window.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOM fully loaded and parsed");
    const container = $("#container")[0];
    const threeApp = new App(container);
    threeApp.start();
});
