/*
Inputs:
  FGFO_1, FGFO_2: fresh gas oxygen flow
  FGFA_1, FGFA_2: fresh gas air flow

Outputs:
  FiO2_1, FiO2_2: fraction inspired oxygen
*/
function calc(inputs) {
  outputs = {};

  outputs['FiO2_1'] = (inputs['FGFA_1'] * 0.21 + inputs['FGFO_1']) / (inputs['FGFA_1'] + inputs['FGFO_1']);
  outputs['FiO2_2'] = (inputs['FGFA_2'] * 0.21 + inputs['FGFO_2']) / (inputs['FGFA_2'] + inputs['FGFO_2']);

  return outputs;
}

inputs = {
  'W_1': 123,
};
outputs = calc(inputs)
console.log(outputs);
