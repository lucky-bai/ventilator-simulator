import { calc } from "./logic.js";
import config from "./config.json"
import seedrandom from "seedrandom";

// Squared distance from midpoint, adjusted for scale
function deviation(x, lo, hi) {
  x = (x - lo) / (hi - lo);
  return (x - 0.5) * (x - 0.5);
}

// Try to minimize: sum of squares to middle of acceptable range, for all variables
function objective(P1, P2) {
  var E = 0;
  E += deviation(P1.pH, 7.3, 7.4);
  E += deviation(P2.pH, 7.3, 7.4);
  E += deviation(P1.PaCO2, 30, 50);
  E += deviation(P2.PaCO2, 30, 50);
  E += deviation(P1.PaO2, 80, 200);
  E += deviation(P2.PaO2, 80, 200);
  E += deviation(P1.APEEP, 0, 25);
  E += deviation(P2.APEEP, 0, 25);
  E += deviation(P1.VT, 4*P1.W, 8*P1.W);
  E += deviation(P2.VT, 4*P2.W, 8*P2.W);
  return E;
}

function rand_range(rng, lo, hi) {
  return Math.floor(lo + rng() * (hi - lo));
}

function optimize(M, P1, P2, num_iters) {
  var rng = seedrandom(12345);

  var bestM = M;
  var bestP1 = P1;
  var bestP2 = P2;
  var bestObjective = 999999;
  for(var iter = 0; iter < num_iters; iter++) {
    var tempM = {...M};
    var tempP1 = {...P1};
    var tempP2 = {...P2};
    tempM.RR = rand_range(rng, 5, 35);
    tempP1.FGFA = rand_range(rng, 0, 15);
    tempP2.FGFA = rand_range(rng, 0, 15);
    tempP1.FGFO = rand_range(rng, 0, 15);
    tempP2.FGFO = rand_range(rng, 0, 15);
    tempP1.PEEP = rand_range(rng, 0, 25);
    tempP2.PEEP = rand_range(rng, 0, 25);
    calc(tempM, tempP1, tempP2);
    var E = objective(tempP1, tempP2);
    if(E < bestObjective) {
      bestObjective = E;
      bestM = tempM;
      bestP1 = tempP1;
      bestP2 = tempP2;
    }
  }
  return {bestM, bestP1, bestP2, bestObjective};
}

function test_solve(){
  let M = {};
  M.PC = 40;
  M.PEEP0 = 5;
  M.RR = 18;
  M.IT = 1;
  M.Pbar = 760;

  let P1 = {}
  P1.H = 140;
  P1.W = 55;
  P1.Cr = 15;
  P1.PF = 100;
  P1.HCO3 = 24;
  P1.FGFO = 8;
  P1.FGFA = 2;
  P1.PEEP = 5;

  let P2 = {}
  P2.H = 180;
  P2.W = 70;
  P2.Cr = 50;
  P2.PF = 300;
  P2.HCO3 = 24;
  P2.FGFO = 1;
  P2.FGFA = 8;
  P2.PEEP = 5;

  console.log(optimize(M, P1, P2, 100000));
}

test_solve();
