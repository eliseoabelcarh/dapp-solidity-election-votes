const Election = artifacts.require("Election");
const { assert } = require("chai");

require("chai").use(require("chai-as-promised")).should();

contract("Election", (accounts) => {
  before(async () => {
    // Load Contracts
    election = await Election.new();
  });

  describe("Contar candidatos", async () => {
    it("matches cantidad successfully", async () => {
      const cant = await election.candidatesCount();
      assert.equal(cant.toString(), "2");
    });
  });
  describe("Candidate1 match data correct", async () => {
    it("matches data successfully", async () => {
      const candidate1 = await election.candidates(1);
      assert.equal(candidate1[0].toString(), "1", "contains id Correct");
      assert.equal(
        candidate1[1].toString(),
        "Candidate1",
        "contains name Correct"
      );
      assert.equal(candidate1[2].toString(), "0", "contains Votes Correct");
    });
  });
  describe("Candidate2 match data correct", async () => {
    it("matches data successfully", async () => {
      const candidate2 = await election.candidates(2);
      assert.equal(candidate2[0].toString(), "2", "contains id Correct");
      assert.equal(
        candidate2[1].toString(),
        "Candidate2",
        "contains name Correct"
      );
      assert.equal(candidate2[2].toString(), "0", "contains Votes Correct");
    });
  });
  describe("vote correctly and count vote", async () => {
    it("vote one time only", async () => {
      const voter = accounts[2];
      await election.vote(1, { from: voter });
      const candidate1 = await election.candidates(1);
      assert.equal(candidate1[2].toString(), "1", "contains Votes Correct");
      const yaEmitioVoto = await election.voters(voter)
      assert.equal(yaEmitioVoto, true, "emitió su voto Correctamente");
      await election.vote(1, { from: voter }).should.be.rejected //no se vota 2 veces
    });
  });
  describe("vote incorrectly candidate inexistente", async () => {
    it("vote incorrectly should be rejected", async () => {
      const voter = accounts[3];
      const idCandidatoInexistente = 3
      await election.vote(idCandidatoInexistente, { from: voter }).should.be.rejected
    });
  });
  describe("Event is triggered", async () => {
    it("vote and event is correctly emited", async () => {
      const voter = accounts[3];
      const candidateIdVoted = 2 //vota por candidato2
      const receipt = await election.vote(candidateIdVoted, { from: voter });
   
      assert.equal(receipt.logs.length,1,"an event was triggered");
      assert.equal(receipt.logs[0].event, "votedEvent", "the event name is correct");
      assert.equal(receipt.logs[0].args._candidateId.toNumber(),candidateIdVoted, "candidato votado matches")
      
    });
  });
});
