/*
window.onload = load;
function load() {
	vvh_main('Player 1', 'Player 2', [ 9, 8, 7, 6, 5, 4, 3, 2, 1, 0 ], [ 3, 2, 3,
			1, 3, 3, 2, 3, 1, 3 ]);
}
*/
// Draws VVH on Canvas
// Takes player names and arrays of remoteness and move-values
function vvh_main(name1, name2, rv, mv, pv, rmax) {
//alert(rv+" | "+mv+" | "+pv);
	var temp;
		var input = new Array();
		for (var i = 0; i < rv.length; i++) {
		temp = new value(rv[i],mv[i],pv[i]);
		input.push(temp);
		}
		var canvas = document.getElementById("history-graph-canvas");
		var game = new game(name1, name2);
		/*
		var rmax = 0;
		for (i = 0; i < rv.length; i++) {
			rmax = Math.max(rmax, rv[i]);
		}*/
		var vvh = new vvh((canvas.width - 40) / (2 * (rmax * 1 + 1)), 10, 10,
				1, 1 + Math.floor(rmax * 10 / canvas.width), 1, "#66FF00",
				"#FFFF00", "#8A0000", "#FFFFFF", "#000066");
		canvas.height = (input.length + 3) * vvh.ts;
		
		//alert(vvh.win+" | "+vvh.tie+" | "+vvh.lose);
		draw(game, vvh, canvas, input, rmax);

	function game(p1, p2) {
		this.p1 = p1; // player 1 name
		this.p2 = p2; // player 2 name
	}

	function vvh(rs, ts, ds, ls, xs, ys, win, tie, lose, line, back) {
		this.rs = rs; // remoteness spacing
		this.ts = ts; // turn spacing
		this.ds = ds; // dot size
		this.ls = ls; // line size
		this.xs = xs; // x-label interval
		this.ys = ys; // y-label interval
		this.win = win; // win color
		this.tie = tie; // tie color
		this.lose = lose; // lose color
		this.line = line; // grid color
		this.back = back; // background color
	}

	function value(r, t, p) {
		this.r = r; // remoteness
		this.t = t; // win lose tie
		this.p = p; // player
	}
	
	function pair(r,t){
	this.r = r;
	this.t = t;}

	function draw(game, vvh, canvas, input, rmax) {

		var i, p;
		var coordinates = convert(input);
		
	
		// Coordinates Function - Converts an array of remoteness win-lose-tie
		// values into XY canvas coordinate values
		// Negative Remoteness => Player 2 Winning
		// Positive Remoteness => Player 1 Winning
		// Zero Remoteness => Player 1 Win if even Turn : Player 2 Win if odd
		// Turn
		// Max Remoteness + 1 => Draw

		function convert(input) {
			var i, c, rc, tc;
			var temp;
			var result = new Array();

			for (i = 0; i < input.length; i++) {
				c = input[i];
				if(c.t!=2){
				rc = canvas.width/2 - (c.p*2-1)*(c.t-2)*(rmax+1-c.r)*vvh.rs;
				}
				else if (c.t==2){
				rc = canvas.width/2 + (rmax + 1 - c.r) * vvh.rs;
				}
				tc = vvh.ts * (i + 3);
				temp = new pair(rc,tc);
				result.push(temp);
			}
			
			return result;
		}

		back(); // Draw the Background
		function back() {
			var ctx = canvas.getContext("2d");
			ctx.fillStyle = vvh.back;
			ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill
			// Background
		}

		plabel(); // Draw the Player's Names
		function plabel() {
			var ctx = canvas.getContext("2d");
			ctx.textBaseline = "middle";
			ctx.textAlign = "center";
			ctx.fillStyle = vvh.line;

			ctx.fillText(game.p1, canvas.width / 2 - vvh.rs * (rmax + 1) / 2,
					vvh.ts);
			ctx.fillText(game.p2, canvas.width / 2 + vvh.rs * (rmax + 1) / 2,
					vvh.ts);
		}
		xlabel(); // Draw the Horizontal Axis Label
		function xlabel() {
			var ctx = canvas.getContext("2d");
			ctx.textBaseline = "middle";
			ctx.textAlign = "center";
			ctx.fillStyle = vvh.line;
			var i, x;
			ctx.fillText("D", canvas.width / 2, vvh.ts * 2);
			for (i = 0; i <= rmax; i++) {
				if (i % (5 * vvh.xs) == 0) {
					ctx.fillText(i, canvas.width / 2 + vvh.rs * (rmax + 1 - i),
							vvh.ts * 2);
					ctx.fillText(i, canvas.width / 2 - vvh.rs * (rmax + 1 - i),
							vvh.ts * 2);
				}
			}
		}

		ylabel(); // Draw the Vertical Axis Label
		function ylabel() {
			var ctx = canvas.getContext("2d");
			ctx.textBaseline = "middle";
			ctx.textAlign = "center";
			ctx.fillStyle = vvh.line;
			var i, y;
			for (i = 0; i < (canvas.height - vvh.ts * 3) / vvh.ts; i++) {
				if (i % vvh.ys == 0) {
					y = i;
					ctx.fillText(y,
							canvas.width / 2 - (rmax + 1) * vvh.rs - 10, vvh.ts
									* (i + 3));
					ctx.fillText(y,
							canvas.width / 2 + (rmax + 1) * vvh.rs + 10, vvh.ts
									* (i + 3));
				}
			}
		}

		grid();// Draw the Grid
		function grid() {
			var ctx = canvas.getContext("2d");
			// Draw Vertical Grid Lines with bold line every five lines
			thickline(canvas.width / 2);
			var i;
			for (i = 0; i <= rmax; i++) {
				ctx.strokeStyle = vvh.line;
				if (i % (5 * vvh.xs) == 0) {
					thickline(canvas.width / 2 + vvh.rs * (rmax + 1 - i));
					thickline(canvas.width / 2 - vvh.rs * (rmax + 1 - i));
				} else if (i % vvh.xs == 0) {
					gridline(canvas.width / 2 + vvh.rs * (rmax + 1 - i));
					gridline(canvas.width / 2 - vvh.rs * (rmax + 1 - i));
				}
			}
		}

		var i, roc, toc, tc, tc, t;

		// Draw the lines linking the dots

		link(coordinates[0].r, coordinates[0].t, coordinates[0].r,
				coordinates[0].t, input[0].t);

		for (i = 1; i < coordinates.length; i++) {
			rc = coordinates[i].r;
			tc = coordinates[i].t;
			roc = coordinates[i - 1].r;
			toc = coordinates[i - 1].t;
			t = input[i].t;
			to = input[i - 1].t;

			link(roc, toc, rc, tc, t, to);
		}

		// Draw the dots

		dots(coordinates[0].r, coordinates[0].t, input[0].t);

		for (i = 1; i < coordinates.length; i++) {
			rc = coordinates[i].r;
			tc = coordinates[i].t;
			roc = coordinates[i - 1].r;
			toc = coordinates[i - 1].t;
			t = input[i].t;
			
			dots(rc, tc, t);
		}

		function link(roc, toc, rc, tc, t, to) {
			var canvas = document.getElementById("history-graph-canvas");
			var ctx = canvas.getContext("2d");
			// Choose Dot + Line Color
			switch (t) {
			case 3:
				ctx.strokeStyle = vvh.lose;
				ctx.fillStyle = vvh.win;
				break;
			case 2:
				ctx.strokeStyle = vvh.tie;
				ctx.fillStyle = vvh.tie;
				break;
			case 1:
				ctx.strokeStyle = vvh.win;
				ctx.fillStyle = vvh.lose;
				break;
			}
			// Draw Line
			var i;
			for (i = 0; i < vvh.ls; i++) {
				// Tie-Tie |_|
				if (t == 2 && to == 2) {
					line(rc, tc + i, canvas.width - rc, tc + i);
					line(rc, tc - i, canvas.width - rc, tc - i);
					line(roc, toc + i, rc, tc + i);
					line(roc, toc - i, rc, tc - i);
					line(canvas.width - roc, toc + i, canvas.width - rc, tc + i);
					line(canvas.width - roc, toc - i, canvas.width - rc, tc - i);
				}
				// Win-Tie /_\
				else if (t == 2 && to != 2) {
					line(rc, tc + i, canvas.width - rc, tc + i);
					line(rc, tc - i, canvas.width - rc, tc - i);
					line(roc, toc + i, rc, tc + i);
					line(roc, toc - i, rc, tc - i);
					line(roc, toc + i, canvas.width - rc, tc + i);
					line(roc, toc - i, canvas.width - rc, tc - i);
				}
				// Tie-Lose \/
				else if (t != 2 && to == 2) {
					line(roc, toc + i, rc, tc + i);
					line(roc, toc - i, rc, tc - i);
					line(canvas.width - roc, toc + i, rc, tc + i);
					line(canvas.width - roc, toc - i, rc, tc - i);
				}
				// Win-Win \ or Win-Lose /
				else if (t != 2 && to != 2) {
					line(roc, toc + i, rc, tc + i);
					line(roc, toc - i, rc, tc - i);
				}
			}
		}

		function dots(rc, tc, t) {
		//alert(t);
			var canvas = document.getElementById("history-graph-canvas");
			var ctx = canvas.getContext("2d");
			// Choose Dot + Line Color
			switch (t) {
			case 3:
				ctx.strokeStyle = vvh.lose;
				ctx.fillStyle = vvh.win;
				break;
			case 2:
				ctx.strokeStyle = vvh.tie;
				ctx.fillStyle = vvh.tie;
				break;
			case 1:
				ctx.strokeStyle = vvh.win;
				ctx.fillStyle = vvh.lose;
				break;
			}
			//alert(vvh.win + " | " + vvh.lose);
			//alert(ctx.fillStyle+" | "+ctx.strokeStyle);
			// Draw Dot
			ctx.save();
			dot(rc, tc);
			if (t == 2) {
				dot(canvas.width - rc, tc);
			}
			ctx.restore();
		}

		function line(x1, y1, x2, y2) {
			var canvas = document.getElementById("history-graph-canvas");
			var ctx = canvas.getContext("2d");
			ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);
			ctx.stroke();
		}

		function gridline(x) {
			var canvas = document.getElementById("history-graph-canvas");
			var ctx = canvas.getContext("2d");
			if(x<canvas.width/2){x=Math.floor(x)+0.5;}
			else if (x>canvas.width/2){x=Math.ceil(x)-0.5;}
			ctx.strokeStyle = vvh.line;
			ctx.beginPath();
			ctx.moveTo(x, vvh.ts * 3);
			ctx.lineTo(x, canvas.height);
			ctx.stroke();
		}

		function thickline(x) {
			gridline(x);
			gridline(x - 1);
			gridline(x + 1);
		}

		function dot(x, y) {
			var canvas = document.getElementById("history-graph-canvas");
			var ctx = canvas.getContext("2d");
			ctx.beginPath();
			ctx.arc(x, y, vvh.ds / 2, 0, Math.PI * 2, true);
			ctx.closePath();
			ctx.fill();
		}
	}
}
