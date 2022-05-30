// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

contract Election {

    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    //store accounts tht have voted
    mapping(address=> bool) public voters;

    mapping(uint => Candidate) public candidates;
    uint public candidatesCount;

event votedEvent(
    uint indexed _candidateId
);

    function addCandidate (string memory _name) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount,_name,0);
    }
    constructor() public {
        addCandidate("Candidate1");
        addCandidate("Candidate2");
    }

    function vote (uint _candidateId) public {
        //record that voter has voted
        require(voters[msg.sender] == false);
        // valide candidate
        require(_candidateId > 0 && _candidateId <= candidatesCount);
        //record vote
        voters[msg.sender] = true;
        //updare candidate vote count
        candidates[_candidateId].voteCount++;    
        //emit event
        emit votedEvent(_candidateId);
    }


}
