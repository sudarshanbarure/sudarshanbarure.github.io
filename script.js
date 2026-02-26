// Typing animation
const text = ["Application Support Engineer","Cloud | Linux | SQL | ITIL"];
let i = 0, j = 0, current = "";

(function typing(){
  if(i < text.length){
    if(j <= text[i].length){
      current = text[i].substring(0, j++);
      document.querySelector(".typing").textContent = current;
    } else {
      j = 0; i++;
    }
  }
  setTimeout(typing, 100);
})();

// Theme toggle
document.getElementById("themeToggle").onclick = () => {
  document.body.classList.toggle("light");
}
