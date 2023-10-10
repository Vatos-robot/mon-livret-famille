// src/components/FamilyDetails.jsx

import React from 'react';

function FamilyDetails({ familyData, onAddChild, onReportDeath }) {
  return (
    <div>
      <h2>Détails de la famille</h2>
      <p>Conjoint 1: {familyData.spouse1.name}</p>
      <p>Conjoint 2: {familyData.spouse2.name}</p>
      <h3>Enfants:</h3>
      <ul>
        {familyData.children.map((child, index) => (
          <li key={index}>{child.name}</li>
        ))}
      </ul>
      <button onClick={onAddChild}>Ajouter un enfant</button>
      <button onClick={onReportDeath}>Signaler un décès</button>
    </div>
  );
}

export default FamilyDetails;
