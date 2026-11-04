const tierNames = {
  29743574: "Resonance Adept",
  29743581: "Otsutsuki Chosen",
  29743595: "New Era Architect",
};
// Identity is verified server-side. This is display information, never an access grant.
export function supporterTierNames(identity, allowedTierIds) {
  if (!identity.active) return [];
  return [...new Set(identity.tierIds ?? [])]
    .filter((id) => allowedTierIds.includes(id) && tierNames[id])
    .map((id) => tierNames[id]);
}
