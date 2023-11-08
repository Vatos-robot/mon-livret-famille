import React, { Component } from 'react';
import LivretFamille from './contracts/LivretFamille.json';
import getWeb3 from './getWeb3';
import CreateFamilyBookForm from './components/CreateFamilyBookForm';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';

class App extends Component {
  state = {
    web3: null,
    accounts: null,
    contract: null,
    hasFamilyBook: false,
    familyBook: null,
    error: null,
    children: []
  };

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = LivretFamille.networks[networkId];
      const instance = new web3.eth.Contract(
        LivretFamille.abi,
        deployedNetwork && deployedNetwork.address,
      );

      this.setState({ web3, accounts, contract: instance }, this.getHasFamilyBook);
    } catch (error) {
      alert("Erreur lors de l'initialisation: " + error.message);
      this.setState({ error: "Erreur lors de la connexion à Ethereum." });
    }
  };

  getHasFamilyBook = async () => {
    const { accounts, contract } = this.state;
    const response = await contract.methods.familyBooks(accounts[0]).call();
    this.setState({ hasFamilyBook: response[3] });
  };

  getFamilyBook = async () => {
    const { accounts, contract } = this.state;
    const response = await contract.methods.familyBooks(accounts[0]).call();
    this.setState({ familyBook: response });
    console.log(response)
  };
  getChildren = async () => {
    const { contract, accounts } = this.state;
    console.log('in func')
    try {
        const response = await contract.methods.getChildren().call({ from: accounts[0] });
        console.log(response);    
        const names = response[0];
        const birthDates = response[1];
        const isAliveArray = response[2];
        const children = names.map((name, index) => {
          return { name, birthDate: birthDates[index], isAlive: isAliveArray[index] };
      });
        this.setState({ children });
    } catch (error) {
        console.error("Erreur lors de la récupération des enfants:", error);
        
    }
  };
  reportDeath = async (personName) => {
    const { accounts, contract } = this.state;  
    try {
      await contract.methods.reportDeath(personName).send({ from: accounts[0] });
      this.getFamilyBook();
      console.log(`Le décès de ${personName} a été enregistré avec succès.`);
    } catch (error) {
      console.error("Erreur lors du report du décès:", error);
      this.setState({ error: "Erreur lors du report du décès." });
    }
  };
  

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    
    return (
      <Router>
        <div className="App">
          <h1>Livret de Famille</h1>

          {!this.state.hasFamilyBook && (
            <Link to="/create-family-book">
              <button>Créer un Livret de Famille</button>
            </Link>
          )}

          {this.state.hasFamilyBook && (
            <div>
            <button onClick={this.getFamilyBook}>Obtenir le Livret de Famille</button>
            {this.state.familyBook && (
            <div>
              <p>Nom époux 1: {this.state.familyBook.spouse1.name} vivant : {this.state.familyBook.spouse1.isAlive.toString()} <button onClick={() => {this.reportDeath(this.state.familyBook.spouse1.name)}}>Déclarer Mort</button></p>
              <p>Nom époux 2: {this.state.familyBook.spouse2.name} vivant : {this.state.familyBook.spouse2.isAlive.toString()}<button onClick={() => this.reportDeath(this.state.familyBook.spouse2.name)}>Déclarer Mort</button></p>
              {this.state.familyBook.childrenCount >= 1 && (
                <button onClick={this.getChildren}>Voir les enfants</button>
              )}
              {this.state.children && this.state.children.map((child, index) => (
                <p key={index}>Nom enfant: {child.name} vivant: {child.isAlive.toString()} <button onClick={()=> this.reportDeath(child.name)}>Déclarer Mort</button></p>
              ))}
            </div>
          
        )}
            </div>
          )}

          <Routes>
            <Route path="/create-family-book" element={<CreateFamilyBookForm web3={this.state.web3} accounts={this.state.accounts} contract={this.state.contract} />} />
            {/* Define other routes as needed */}
          </Routes>
        </div>
      </Router>
    );
  }
}

export default App;
