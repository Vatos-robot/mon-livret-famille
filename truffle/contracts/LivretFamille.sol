// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LivretFamille {

    struct Person {
        string name;
        uint256 birthDate;  
        bool isAlive;       
    }

    struct FamilyBook {
        Person spouse1;
        Person spouse2;
        mapping(uint256 => Person) children;
        uint256 childrenCount; // Ajouté pour suivre le nombre d'enfants
        bool isMarried;
    }

    // Mapping d'adresses Ethereum vers des livrets de famille
    mapping(address => FamilyBook) public familyBooks;

    // Créer un nouveau livret de famille
    function createFamilyBook(string memory name1, uint256 birthDate1, string memory name2, uint256 birthDate2) public {
        require(keccak256(abi.encodePacked(familyBooks[msg.sender].spouse1.name)) == keccak256(abi.encodePacked("")), "Livret de famille deja existant pour cette adresse.");

        familyBooks[msg.sender].spouse1 = Person(name1, birthDate1, true);
        familyBooks[msg.sender].spouse2 = Person(name2, birthDate2, true);
        familyBooks[msg.sender].isMarried = true;
        familyBooks[msg.sender].childrenCount = 0;
    }

    // Ajouter un enfant
    function addChild(string memory name, uint256 birthDate) public {
        require(familyBooks[msg.sender].isMarried, "Le couple doit etre marie pour ajouter un enfant.");

        familyBooks[msg.sender].children[familyBooks[msg.sender].childrenCount] = Person({
            name: name,
            birthDate: birthDate,
            isAlive: true
        });

        familyBooks[msg.sender].childrenCount++; // Incrémentez le compteur d'enfants
    }



    // Divorcer
    function divorce() public {
        require(familyBooks[msg.sender].isMarried, "Le couple n'est pas marie.");
        familyBooks[msg.sender].isMarried = false;
    }


    function reportDeath(string memory name) public {
        if (keccak256(abi.encodePacked(familyBooks[msg.sender].spouse1.name)) == keccak256(abi.encodePacked(name))) {
            familyBooks[msg.sender].spouse1.isAlive = false;
            familyBooks[msg.sender].isMarried = false;
        } else if (keccak256(abi.encodePacked(familyBooks[msg.sender].spouse2.name)) == keccak256(abi.encodePacked(name))) {
            familyBooks[msg.sender].spouse2.isAlive = false;
            familyBooks[msg.sender].isMarried = false;
        } else {
            for (uint256 i = 0; i < familyBooks[msg.sender].childrenCount; i++) {
                if (keccak256(abi.encodePacked(familyBooks[msg.sender].children[i].name)) == keccak256(abi.encodePacked(name))) {
                    familyBooks[msg.sender].children[i].isAlive = false;
                    return;
                }
            }
            revert("Cette personne n'est pas trouvee dans ce livret de famille.");
        }
    }

    
}
