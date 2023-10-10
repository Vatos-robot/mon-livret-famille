const LivretFamille = artifacts.require("LivretFamille");

module.exports = function(deployer) {
  deployer.deploy(LivretFamille);
};
