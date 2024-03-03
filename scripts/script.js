var audio = new Audio('./scripts/muse.mp3');

// check if the user has a score in local storage
var highScore = localStorage.getItem("highScore");
if (highScore) {
	document.getElementById("scorearea").innerText = "Your high score: " + highScore;
	document.getElementById("scorearea").style.display = "block";
}

var gamePaused = true;
var score = 0;

function getDynamicParams() {

	var acc = 0.18;
	var circleCount = 26;
	var circleRadius = 18;

	// increase acc if the screen is huge
	if (window.screen.width > 1730) {
		acc = 0.35;
		circleCount = 35;
		circleRadius = 15;
	}

	console.log(window.screen.width);

	return {
		acc,
		circleCount,
		circleRadius,
		interpolation: true
	};
}


const startGame = () => {
	console.log("start game");
	gamePaused = false;
	score = 0;

	audio.play();

	// hide the contentarea and show the canvas
	document.getElementById("contentarea").style.display = "none";
	document.getElementById("leaderboard").style.display = "none";
	document.getElementById("playarea").style.display = "block";
	document.getElementById("scorearea").style.display = "block";
	document.getElementById("endgamearea").style.display = "none";
	var m = new MarchingSquares("canvas", {
		...getDynamicParams(),
		stepFunc() {

			if(gamePaused) return;
			this.moveCircles();
			this.updateGridPoints();
			this.drawLines();
			// this.drawCircles();

			document.getElementById("scorearea").innerText = "Score: " + Math.round(score/60, 2);

			// set the player invincible to false after 2 seconds
			if (this.invincible) {
				setTimeout(() => {
					this.invincible = false;
				}, 1500);
			}else{
				score++;
			}

			if(Math.round(score/60, 2) > 100 ){
				this.resetGame();
				// show an alert 
				alert("HACKER hai bhai Hacker hai...");
			}

		},
		resetGame(){

			audio.pause();
			audio.currentTime = 0;

			// hide the canvas and show the contentarea
			gamePaused = true;
			document.getElementById("scorearea").style.display = "none";
			document.getElementById("contentarea").style.display = "none";
			document.getElementById("playarea").style.display = "none";
			this.removeEntities();

			document.getElementById('endgamearea').style.display = 'flex';
			// show my score as a div in the endgamearea
			document.getElementById('endgamearea').innerHTML = `<h1>Your Score: ${Math.round(score/60, 2)}</h1>`;

			// check if the user has a name in local storage
			var name = localStorage.getItem("username");
			
			if (name == null) {

				document.getElementById('endgamearea').innerHTML += `<p>Enter a username to submit your score on the leaderboard...</p>`;

				// add a input field for user to enter their name
				document.getElementById('endgamearea').innerHTML += `<input type="text" id="name" placeholder="username">`;
				// add a button to submit the score
				document.getElementById('endgamearea').innerHTML += `<button onclick="submitScore()">Submit</button></br>`;	

				document.getElementById('endgamearea').innerHTML += `<p>or just play again maybe?</p>`;

			}
			else{
				const name = localStorage.getItem("username");
				// show a loading message
				document.getElementById('endgamearea').innerHTML = `<p>Submitting score...</p>`;

				window.saveScore(name, Math.round(score/60, 2)).then(() => {
					
					document.getElementById('endgamearea').innerHTML = `<h1>Your Score: ${Math.round(score/60, 2)}</h1>`;
					document.getElementById('endgamearea').innerHTML += `<p>You are ranked <span style="color: #ffc400">${window.rank}</span> on the leaderboard!</p>`;
					document.getElementById('endgamearea').innerHTML += `<button onclick="startGame()">Play Again</button>`;
		
				});
			}
			
			// console.log("game reset", score, localStorage.getItem("highScore"));

			if(localStorage.getItem("highScore") == undefined || Math.round(score/60, 2) > parseInt(localStorage.getItem("highScore"))){	
				localStorage.setItem("highScore", Math.round(score/60, 2));
			}

			// add a button to play again
			document.getElementById('endgamearea').innerHTML += `<button onclick="startGame()">Play Again</button>`;

			document.getElementById("leaderboard").style.display = "flex";

		}
	});
}


const submitScore = () => {
	var name = document.getElementById("name").value;
	localStorage.setItem("username", name);

	// show a loading message
	document.getElementById('endgamearea').innerHTML = `<p>Submitting score...</p>`;

	window.saveScore(name, Math.round(score/60, 2)).then(() => {
		
		document.getElementById('endgamearea').innerHTML = `<h1>Your Score: ${Math.round(score/60, 2)}</h1>`;
		document.getElementById('endgamearea').innerHTML += `<p>You are ranked <span style="color: #ffc400">${window.rank}</span> on the leaderboard!</p>`;
		document.getElementById('endgamearea').innerHTML += `<button onclick="startGame()">Play Again</button>`;

	});
}