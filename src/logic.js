/*
Based on "20200416 Cerberus.xlsx"

Inputs.

M: main ventilator settings / shared variables

  (ventilator settings)
  PC: pressure control
  PEEP0: positive end expiratory pressure, should be set to zero
  RR: respiratory rate (breaths / min)
  IT: inspiratory time

  (environment)
  Pbar: barometric pressure


P1, P2: two patients

  (fixed characteristics)
  H: height in cm
  W: weight in kg
  Cr: lung compliance
  PF: arterial PaO2:FiO2 ratio
  HCO3: arterial bicarbonate concentration

  (secondary ventilator settings)
  FGFO: fresh gas flow, oxygen, in L/min
  FGFA: fresh gas flow, air, in L/min
  PEEP: PEEP valve setting on secondary circuit

*/
export function calc(M, P1, P2) {

  // Subtract vapor pressure
  M.Pdry = M.Pbar - 47;

  // duration of respiratory cycle, in seconds
  M.Ttot = 60 / M.RR;

  // inspiratory time / expiratory time
  M.IER = M.IT / (M.Ttot - M.IT);

  let patients = [P1, P2];
  for(var i in [0, 1]) {
    let P = patients[i];

    // fresh gas flow total, in L/min
    P.FGFtot = P.FGFO + P.FGFA;

    // tidal volume in mL
    P.VT = P.FGFtot / 60 * 1000 * M.Ttot;

    // mean inspiratory pressure
    P.MIP = P.VT / P.Cr;

    // peak inspiratory pressure
    P.PIP = 2 * P.MIP;

    // fraction of inspired oxygen
    P.FIO2 = (P.FGFA * 0.21 + P.FGFO) / P.FGFtot;

    // intrinsic PEEP from FGF
    P.PEEPInt = 1;
//    if(P.FGFTot < 7){
//      P.PIPInt = 0;
//    }
//    else{
//      P.PIPInt = 3 + (P.FGFtot - 7) * 0.6;
//    }

    // actual PEEP
    P.APEEP = M.PEEP0 + P.PEEP + P.PEEPInt;

    // CO2 production rate
    P.VCO2 = (0.4 + 0.2 * P.W / 70) * (1000 / (60 * 1.964));

    // O2 consumption rate
    P.VO2 = P.VCO2 / 0.8;

    // anatomical dead space
    P.ADS = P.W / 0.45;

    // alveolar tidal volume
    P.AVT = P.VT - P.ADS;

    // arterial partial pressure of O2
    P.PaO2 = P.FIO2 * P.PF;

    // arterial partial pressure of CO2
    P.PaCO2 = M.Pdry * M.Ttot * P.VCO2 / P.AVT;

    // arterial concentration of CO2
    P.CaCO2 = 0.107 * Math.pow(P.PaCO2, 0.415);

    // arterial hydrogen ion concentration, [H+]
    P.HPlus = 24 * P.PaCO2 / P.HCO3;

    // arterial blood acidity
    P.pH = -Math.log10(P.HPlus * 1e-9);
  }

  return {M, P1, P2};
}

function test_calc(){
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

  let outputs = calc(M, P1, P2)
  console.log(outputs);
}

test_calc();
