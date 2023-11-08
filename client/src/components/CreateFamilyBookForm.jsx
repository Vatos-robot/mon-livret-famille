import React, { Component } from 'react';
import Web3 from 'web3';
import LivretFamille from '../contracts/LivretFamille.json'; 
class CreateFamilyBookForm extends Component {
  state = {
    name1: '',
    birthDate1: '',
    name2: '',
    birthDate2: '',
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Props web3:', this.props.web3);
    const { web3, accounts, contract } = this.props;
    console.log('contract address', contract)
    const { name1, birthDate1, name2, birthDate2 } = this.state;
    console.log(contract.methods)
    try {
      // Assurez-vous de convertir les dates en format Unix timestamp si nécessaire
      await contract.methods
        .createFamilyBook(name1, Date.parse(birthDate1), name2, Date.parse(birthDate2))
        .send({ from: accounts[0] });

      alert('Livret de famille créé avec succès!');
      // Vous pouvez également mettre à jour l'état ou rediriger l'utilisateur
    } catch (error) {
      alert(`Erreur lors de la création du livret de famille: ${error.message}`);
      // Gestion plus détaillée de l'erreur peut être implémentée ici
    }
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <label>Nom Conjoint(e) 1:</label>
          <input
            type="text"
            name="name1"
            value={this.state.name1}
            onChange={this.handleInputChange}
            required
          />
        </div>
        <div>
          <label>Date de naissance Conjoint(e) 1:</label>
          <input
            type="date"
            name="birthDate1"
            value={this.state.birthDate1}
            onChange={this.handleInputChange}
            required
          />
        </div>
        <div>
          <label>Nom Conjoint(e) 2:</label>
          <input
            type="text"
            name="name2"
            value={this.state.name2}
            onChange={this.handleInputChange}
            required
          />
        </div>
        <div>
          <label>Date de naissance Conjoint(e) 2:</label>
          <input
            type="date"
            name="birthDate2"
            value={this.state.birthDate2}
            onChange={this.handleInputChange}
            required
          />
        </div>
        <button type="submit">Soumettre</button>
      </form>
    );
  }
}

export default CreateFamilyBookForm;
