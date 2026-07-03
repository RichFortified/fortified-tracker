// Fortified Tracker — frontend entry point
// Wire your prototype UI to these API helpers

const API = {
  async getMembers(q = '') {
    const res = await fetch(`/api/members?q=${encodeURIComponent(q)}`);
    return res.json();
  },
  async addMember(name) {
    const res = await fetch('/api/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    return res.json();
  },
  async logSet(member_id, lift, kg, reps) {
    const res = await fetch('/api/sets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ member_id, lift, kg, reps }),
    });
    return res.json();
  },
  async getSets(member_id, lift = '') {
    const params = new URLSearchParams({ member_id });
    if (lift) params.set('lift', lift);
    const res = await fetch(`/api/sets?${params}`);
    return res.json();
  },
  async getBests(member_id) {
    const res = await fetch(`/api/sets/bests?member_id=${member_id}`);
    return res.json();
  },
};

console.log('Fortified Tracker API ready. Replace this file with your prototype JS.');
