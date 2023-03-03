import './src/style.scss';
import { init, animate } from "./src/scene";


window.addEventListener('DOMContentLoaded', () => {
    init().then((succeeded) => {
      if (succeeded){
        console.log("succeeded")
        animate()
      }
    })
});
