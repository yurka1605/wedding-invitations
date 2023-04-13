async function setAnswer(answer) {
  if (answer) {
    loadParticles();
  }

  document.querySelector('.answers').classList.add('hide');
  document.querySelector(answer ? '.welcome-message' : '.regret-message').classList.remove('hide');

  fetch(`${window.location.origin}/api/answer${window.location.search}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json;charset=utf-8'},
    body: JSON.stringify({answer})
  });
}

async function loadParticles() {
  tsParticles.load("tsparticles", {
    particles: {
      color: {
        value: [
          "#c8c3c3", 
          "#aec6b8", 
          "#a9c5d6", 
          "#dfb8ce", 
          "#d4b3bb"
        ],
      },
      shape: {
        type: ["circle", "square"]
      },
      size: {
        value: 7,
        random: {
          enable: true,
          minimumValue: 3
        }
      },
      opacity: {
        value: {
          max: 1,
          min: 0
        },
        animation: {
          enable: true,
          speed: 2,
          startValue: "max",
          destroy: "min"
        }
      },
      life: {
        duration: {
          sync: true,
          value: 5
        },
        count: 1
      },
      move: {
        enable: true,
        gravity: {
          enable: true,
          acceleration: 10
        },
        speed: 20,
        decay: 0.05,
        direction: "none",
        outModes: {
          default: "destroy",
          top: "none"
        }
      },
      emitters: {
        direction: "top",
        rate: {
          delay: 1,
          quantity: 200
        },
        position: {
          x: 50,
          y: 50
        },
        size: {
          width: 20,
          height: 20
        }
      }
    },
    preset: "confetti",
  });
}