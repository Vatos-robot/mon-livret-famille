import React, { Component } from 'react';
import LivretFamille from './contracts/LivretFamille.json';
import getWeb3 from './getWeb3';

class App extends Component {
  state = {
    web3: null,
    accounts: null,
    contract: null,
    details: null,
  };

  componentDidMount = async () => {
    try {
      // Récupération de web3
      const web3 = await getWeb3();

      // Récupération des comptes
      const accounts = await web3.eth.getAccounts();

      // Récupération du réseau et création de l'instance du contrat
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = LivretFamille.networks[networkId];
      const instance = new web3.eth.Contract(
        LivretFamille.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Mise à jour du state avec les données récupérées
      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      alert('Erreur lors de la récupération de web3, des comptes ou du contrat.');
      console.error(error);
    }
  };

  // Supprimez cette fonction ou remplacez-la par la bonne méthode du contrat
  // getDetails = async () => {
  //   const { accounts, contract } = this.state;
  //   const response = await contract.methods.getDetails().call({ from: accounts[0] });
  //   this.setState({ details: response });
  // };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    return (
      <div className="App">
        <h1>Livret de Famille</h1>
        {/* Supprimez ou remplacez ce bouton si la méthode getDetails n'est pas utilisée */}
        {/* <button onClick={this.getDetails}>Obtenir les détails</button> */}
        {this.state.details && (
          <div>
            <p>Nom époux 1: {this.state.details.spouse1.name}</p>
            <p>Nom époux 2: {this.state.details.spouse2.name}</p>
            {/* ... Ajoutez d'autres détails si nécessaire ... */}
          </div>
        )}
      </div>
    );
  }
}

export default App;
