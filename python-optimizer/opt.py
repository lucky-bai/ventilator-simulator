from dotmap import DotMap
import math
import pprint
import scipy.optimize


def calc(M, P1, P2):
  M.Pdry = M.Pbar - 47
  M.Ttot = 60 / M.RR
  M.IER = M.IT / (M.Ttot - M.IT)

  for P in [P1, P2]:
    P.FGFtot = P.FGFO + P.FGFA
    P.VT = P.FGFtot / 60 * 1000 * M.Ttot
    P.MIP = P.VT / P.Cr
    P.PIP = 2 * P.MIP
    P.FIO2 = (P.FGFA * 0.21 + P.FGFO) / P.FGFtot
    if P.FGFtot < 7:
      P.PEEPInt = 0
    else:
      P.PEEPInt = 3 + (P.FGFtot - 7) * 0.6
    P.APEEP = M.PEEP0 + P.PEEP + P.PEEPInt
    P.VCO2 = (0.4 + 0.2 * P.W / 70) * (1000 / (60 * 1.964))
    P.VO2 = P.VCO2 / 0.8
    P.ADS = P.W / 0.45
    P.AVT = P.VT - P.ADS
    P.PaO2 = P.FIO2 * P.PF
    P.PaCO2 = M.Pdry * M.Ttot * P.VCO2 / P.AVT
    P.CaCO2 = 0.107 * P.PaCO2**0.415
    P.HPlus = 24 * P.PaCO2 / P.HCO3
    P.pH = -math.log10(P.HPlus * 1e-9)

  return M, P1, P2

def deviation(x, lo, hi):
  x = (x - lo) / (hi - lo)
  return (x - 0.5)**2

def objective(P1, P2):
  E = 0
  E += deviation(P1.pH, 7.3, 7.4)
  E += deviation(P2.pH, 7.3, 7.4)
  E += deviation(P1.PaCO2, 30, 50)
  E += deviation(P2.PaCO2, 30, 50)
  E += deviation(P1.PaO2, 80, 200)
  E += deviation(P2.PaO2, 80, 200)
  E += deviation(P1.APEEP, 0, 25)
  E += deviation(P2.APEEP, 0, 25)
  E += deviation(P1.VT, 4*P1.W, 8*P1.W)
  E += deviation(P2.VT, 4*P2.W, 8*P2.W)
  return E

def solver(M, P1, P2):
  def objfun(x):
    tempM = DotMap(M)
    tempP1 = DotMap(P1)
    tempP2 = DotMap(P2)
    tempM.RR = x[0]
    tempP1.FGFA = x[1]
    tempP2.FGFA = x[2]
    tempP1.FGFO = x[3]
    tempP2.FGFO = x[4]
    tempP1.PEEP = x[5]
    tempP2.PEEP = x[6]
    tempM, tempP1, tempP2 = calc(tempM, tempP1, tempP2)
    E = objective(tempP1, tempP2)
    #print(list(x), E)
    return E

  x0 = [M.RR, P1.FGFA, P2.FGFA, P1.FGFO, P2.FGFO, P1.PEEP, P2.PEEP]
  bounds = [(5, 35), (0, 15), (0, 15), (0, 15), (0, 15), (0, 25), (0, 25)]
  soln = scipy.optimize.minimize(objfun, x0, bounds=bounds, method="L-BFGS-B")
  print(soln)

def test_calc():
  M = DotMap()
  M.PC = 40
  M.PEEP0 = 5
  M.RR = 18
  M.IT = 1
  M.Pbar = 760

  P1 = DotMap()
  P1.H = 140
  P1.W = 55
  P1.Cr = 15
  P1.PF = 100
  P1.HCO3 = 24
  P1.FGFO = 8
  P1.FGFA = 2
  P1.PEEP = 5

  P2 = DotMap()
  P2.H = 180
  P2.W = 70
  P2.Cr = 50
  P2.PF = 300
  P2.HCO3 = 24
  P2.FGFO = 1
  P2.FGFA = 8
  P2.PEEP = 5

  solver(M, P1, P2)

test_calc()
