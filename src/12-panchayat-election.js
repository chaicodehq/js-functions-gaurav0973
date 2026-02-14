/**
 * 🗳️ Panchayat Election System - Capstone
 *
 * Village ki panchayat election ka system bana! Yeh CAPSTONE challenge hai
 * jisme saare function concepts ek saath use honge:
 * closures, callbacks, HOF, factory, recursion, pure functions.
 *
 * Functions:
 *
 *   1. createElection(candidates)
 *      - CLOSURE: private state (votes object, registered voters set)
 *      - candidates: array of { id, name, party }
 *      - Returns object with methods:
 *
 *      registerVoter(voter)
 *        - voter: { id, name, age }
 *        - Add to private registered set. Return true.
 *        - Agar already registered or voter invalid, return false.
 *        - Agar age < 18, return false.
 *
 *      castVote(voterId, candidateId, onSuccess, onError)
 *        - CALLBACKS: call onSuccess or onError based on result
 *        - Validate: voter registered? candidate exists? already voted?
 *        - If valid: record vote, call onSuccess({ voterId, candidateId })
 *        - If invalid: call onError("reason string")
 *        - Return the callback's return value
 *
 *      getResults(sortFn)
 *        - HOF: takes optional sort comparator function
 *        - Returns array of { id, name, party, votes: count }
 *        - If sortFn provided, sort results using it
 *        - Default (no sortFn): sort by votes descending
 *
 *      getWinner()
 *        - Returns candidate object with most votes
 *        - If tie, return first candidate among tied ones
 *        - If no votes cast, return null
 *
 *   2. createVoteValidator(rules)
 *      - FACTORY: returns a validation function
 *      - rules: { minAge: 18, requiredFields: ["id", "name", "age"] }
 *      - Returned function takes a voter object and returns { valid, reason }
 *
 *   3. countVotesInRegions(regionTree)
 *      - RECURSION: count total votes in nested region structure
 *      - regionTree: { name, votes: number, subRegions: [...] }
 *      - Sum votes from this region + all subRegions (recursively)
 *      - Agar regionTree null/invalid, return 0
 *
 *   4. tallyPure(currentTally, candidateId)
 *      - PURE FUNCTION: returns NEW tally object with incremented count
 *      - currentTally: { "cand1": 5, "cand2": 3, ... }
 *      - Return new object where candidateId count is incremented by 1
 *      - MUST NOT modify currentTally
 *      - If candidateId not in tally, add it with count 1
 *
 * @example
 *   const election = createElection([
 *     { id: "C1", name: "Sarpanch Ram", party: "Janata" },
 *     { id: "C2", name: "Pradhan Sita", party: "Lok" }
 *   ]);
 *   election.registerVoter({ id: "V1", name: "Mohan", age: 25 });
 *   election.castVote("V1", "C1", r => "voted!", e => "error: " + e);
 *   // => "voted!"
 */
export function createElection(candidates) {
  if (!Array.isArray(candidates)) candidates = [];
  const candidateMap = {};
  const votes = {};
  const registered = new Set();
  const voted = new Set();

  for (let i = 0; i < candidates.length; i++) {
    const c = candidates[i];
    if (c && c.id) {
      candidateMap[c.id] = { ...c };
      votes[c.id] = 0;
    }
  }

  function registerVoter(voter) {
    if (
      !voter ||
      typeof voter !== "object" ||
      !voter.id ||
      typeof voter.age !== "number" ||
      voter.age < 18 ||
      registered.has(voter.id)
    ) {
      return false;
    }

    registered.add(voter.id);
    return true;
  }

  function castVote(voterId, candidateId, onSuccess, onError) {
    const successCb = typeof onSuccess === "function" ? onSuccess : () => {};
    const errorCb = typeof onError === "function" ? onError : () => {};

    if (!registered.has(voterId)) {
      return errorCb("voter_not_registered");
    }

    if (!candidateMap[candidateId]) {
      return errorCb("candidate_not_found");
    }

    if (voted.has(voterId)) {
      return errorCb("already_voted");
    }

    votes[candidateId] = (votes[candidateId] || 0) + 1;
    voted.add(voterId);

    return successCb({ voterId, candidateId });
  }

  function getResults(sortFn) {
    const results = [];

    for (let id in candidateMap) {
      const c = candidateMap[id];
      results.push({
        id: c.id,
        name: c.name,
        party: c.party,
        votes: votes[id] || 0
      });
    }

    if (typeof sortFn === "function") {
      results.sort(sortFn);
    } else {
      results.sort((a, b) => b.votes - a.votes);
    }

    return results;
  }

  function getWinner() {
    let winner = null;
    let maxVotes = 0;

    for (let id in votes) {
      const v = votes[id];
      if (v > maxVotes) {
        maxVotes = v;
        winner = candidateMap[id];
      }
    }

    if (maxVotes === 0) return null;
    return winner ? { ...winner } : null;
  }

  return {
    registerVoter,
    castVote,
    getResults,
    getWinner
  };
}

export function createVoteValidator(rules) {
  const minAge = rules?.minAge ?? 18;
  const required = Array.isArray(rules?.requiredFields) ? rules.requiredFields : [];

  return function (voter) {
    if (!voter || typeof voter !== "object") {
      return { valid: false, reason: "invalid_voter" };
    }

    for (let i = 0; i < required.length; i++) {
      const field = required[i];
      if (!(field in voter)) {
        return { valid: false, reason: `missing_${field}` };
      }
    }

    if (typeof voter.age !== "number" || voter.age < minAge) {
      return { valid: false, reason: "underage" };
    }

    return { valid: true, reason: "" };
  };
}

export function countVotesInRegions(regionTree) {
  if (!regionTree || typeof regionTree !== "object") return 0;

  let total = typeof regionTree.votes === "number" ? regionTree.votes : 0;

  if (Array.isArray(regionTree.subRegions)) {
    for (let i = 0; i < regionTree.subRegions.length; i++) {
      total += countVotesInRegions(regionTree.subRegions[i]);
    }
  }

  return total;
}

export function tallyPure(currentTally, candidateId) {
  const base = currentTally && typeof currentTally === "object" ? currentTally : {};
  const newTally = { ...base };

  if (!candidateId) return newTally;

  newTally[candidateId] = (newTally[candidateId] || 0) + 1;

  return newTally;
}

